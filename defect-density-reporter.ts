import type {
  FullConfig, FullResult, Reporter, Suite, TestCase, TestResult
} from '@playwright/test/reporter';
import { relative, join } from 'path';
import * as fs from 'fs';

interface ModuleStats {
  size: number;
  defects: number;
  passed: number;
  skipped: number;
}

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

function getRiskLevel(density: number): RiskLevel {
  if (density >= 0.3) return 'HIGH';
  if (density >= 0.15) return 'MEDIUM';
  return 'LOW';
}

function getRiskIcon(risk: RiskLevel): string {
  if (risk === 'HIGH') return '🔴 HIGH  ';
  if (risk === 'MEDIUM') return '⚠️  MEDIUM';
  return '✅ LOW   ';
}

function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

export default class DefectDensityReporter implements Reporter {
  private moduleStats: Record<string, ModuleStats> = {};
  private startTime: Date = new Date();
  private environment: string = process.env.TEST_ENV ?? process.env.NODE_ENV ?? 'unknown';

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = new Date();

    // Traverse the suite to count total test cases per file,
    // which serves as our module size metric.
    const traverse = (currentSuite: Suite) => {
      for (const test of currentSuite.tests) {
        const file = relative(process.cwd(), test.location.file);
        if (!this.moduleStats[file]) {
          this.moduleStats[file] = { size: 0, defects: 0, passed: 0, skipped: 0 };
        }
        // Count each test case as 1 unit of "size"
        this.moduleStats[file].size++;
      }
      for (const childSuite of currentSuite.suites) {
        traverse(childSuite);
      }
    };
    traverse(suite);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const file = relative(process.cwd(), test.location.file);
    if (!this.moduleStats[file]) return;

    if (result.status === 'skipped') {
      this.moduleStats[file].skipped++;
    } else if (result.status !== test.expectedStatus) {
      // Unexpected result = defect
      this.moduleStats[file].defects++;
    } else {
      this.moduleStats[file].passed++;
    }
  }

  async onEnd(result: FullResult) {
    const endTime = new Date();
    const durationMs = endTime.getTime() - this.startTime.getTime();
    const durationSec = (durationMs / 1000).toFixed(1);

    // ── Compute per-module rows ──────────────────────────────────────────────
    const rows = Object.entries(this.moduleStats).map(([moduleName, stats]) => {
      const density = stats.size > 0 ? stats.defects / stats.size : 0;
      const risk = getRiskLevel(density);
      return {
        moduleName,
        tests: stats.size,
        passed: stats.passed,
        failed: stats.defects,
        skipped: stats.skipped,
        density,
        risk,
      };
    });

    // ── Compute totals ───────────────────────────────────────────────────────
    const totalTests = rows.reduce((s, r) => s + r.tests, 0);
    const totalPassed = rows.reduce((s, r) => s + r.passed, 0);
    const totalFailed = rows.reduce((s, r) => s + r.failed, 0);
    const totalSkipped = rows.reduce((s, r) => s + r.skipped, 0);
    const totalDensity = totalTests > 0 ? totalFailed / totalTests : 0;
    const totalRisk = getRiskLevel(totalDensity);

    // ── Column widths ────────────────────────────────────────────────────────
    const moduleColW = Math.max(40, ...rows.map(r => r.moduleName.length)) + 2;
    const sep = '─'.repeat(moduleColW + 52);

    // ── Print report ─────────────────────────────────────────────────────────
    console.log('\n' + '='.repeat(moduleColW + 52));
    console.log(' '.repeat(Math.floor((moduleColW + 52 - 24) / 2)) + 'DEFECT DENSITY REPORT');
    console.log('='.repeat(moduleColW + 52));
    console.log(`  Run Date    : ${formatDate(this.startTime)}`);
    console.log(`  Duration    : ${durationSec}s`);
    console.log(`  Environment : ${this.environment}`);
    console.log(`  Size Metric : test cases`);
    console.log(`  Suite Status: ${result.status.toUpperCase()}`);
    console.log(sep);

    // Header row
    const moduleHeader = 'Module'.padEnd(moduleColW);
    console.log(`  ${moduleHeader} ${'Tests'.padEnd(7)} ${'Passed'.padEnd(7)} ${'Failed'.padEnd(7)} ${'Skipped'.padEnd(8)} ${'Density'.padEnd(9)} Risk`);
    console.log(sep);

    if (rows.length === 0) {
      console.log('  No test modules found.');
    } else {
      rows.forEach(row => {
        const mod = row.moduleName.padEnd(moduleColW);
        const tests = row.tests.toString().padEnd(7);
        const passed = row.passed.toString().padEnd(7);
        const failed = row.failed.toString().padEnd(7);
        const skipped = row.skipped.toString().padEnd(8);
        const density = row.density.toFixed(4).padEnd(9);
        const risk = getRiskIcon(row.risk);
        console.log(`  ${mod} ${tests} ${passed} ${failed} ${skipped} ${density} ${risk}`);
      });

      // Totals row
      console.log(sep);
      const totLabel = 'TOTAL'.padEnd(moduleColW);
      const totTests = totalTests.toString().padEnd(7);
      const totPassed = totalPassed.toString().padEnd(7);
      const totFailed = totalFailed.toString().padEnd(7);
      const totSkipped = totalSkipped.toString().padEnd(8);
      const totDensity = totalDensity.toFixed(4).padEnd(9);
      const totRisk = getRiskIcon(totalRisk);
      console.log(`  ${totLabel} ${totTests} ${totPassed} ${totFailed} ${totSkipped} ${totDensity} ${totRisk}`);
    }

    console.log('='.repeat(moduleColW + 52));

    // ── Risk threshold legend ─────────────────────────────────────────────────
    console.log('\n  Risk Thresholds:');
    console.log('    ✅ LOW    → density < 0.15');
    console.log('    ⚠️  MEDIUM → density 0.15 – 0.29');
    console.log('    🔴 HIGH   → density ≥ 0.30');
    console.log('='.repeat(moduleColW + 52) + '\n');

    // ── Save JSON report ─────────────────────────────────────────────────────
    const jsonReport = {
      meta: {
        runDate: formatDate(this.startTime),
        duration: `${durationSec}s`,
        environment: this.environment,
        sizeMetric: 'test cases',
        suiteStatus: result.status,
      },
      summary: {
        totalTests,
        totalPassed,
        totalFailed,
        totalSkipped,
        totalDensity: parseFloat(totalDensity.toFixed(4)),
        overallRisk: totalRisk,
      },
      modules: rows.map(r => ({
        module: r.moduleName,
        tests: r.tests,
        passed: r.passed,
        failed: r.failed,
        skipped: r.skipped,
        density: parseFloat(r.density.toFixed(4)),
        risk: r.risk,
      })),
    };

    const resultsDir = join(process.cwd(), 'test-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    fs.writeFileSync(
      join(resultsDir, 'defect-density-report.json'),
      JSON.stringify(jsonReport, null, 2)
    );
    console.log('  📄 JSON report saved to test-results/defect-density-report.json\n');
  }
}