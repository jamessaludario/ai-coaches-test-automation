import { dashboardContent, timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import {
  expectCoachDashboardVisible,
  expectCoachMetricsVisible,
} from '../../helpers'
import { CoachDashboardPage } from '../../page-objects'

test.describe('Coach Dashboard Metrics', () => {
  test.skip(true, 'Skipping coach dashboard metrics tests, waiting for the NaN issue to be fixed.')
  test.setTimeout(timeouts.workflow.extended)
  let dashboard: CoachDashboardPage

  test.beforeEach(async ({ authenticatedCoachPage }) => {
    dashboard = new CoachDashboardPage(authenticatedCoachPage)
    await dashboard.goto()
    await expectCoachDashboardVisible(authenticatedCoachPage)
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('coach', testInfo.workerIndex)
  })

  test('only display valid numbers in dashboard metrics', async ({ authenticatedCoachPage }) => {
    await expectCoachMetricsVisible(authenticatedCoachPage, dashboardContent.coach.metrics)
    const metricsValues = await dashboard.metricsValues
    for (const metricValue of metricsValues) {
      await expect(metricValue).toHaveText(/^\$?\s*\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$/, { timeout: 10000 })
    }
  })
})
