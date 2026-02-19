import { dashboardContent, timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import { expectClientDashboardVisible, expectClientMetricsVisible } from '../../helpers'
import { ClientDashboardPage } from '../../page-objects'

test.describe('Client Dashboard Metrics', () => {
  test.setTimeout(timeouts.workflow.extended)
  let dashboard: ClientDashboardPage

  test.beforeEach(async ({ authenticatedClientPage }) => {
    dashboard = new ClientDashboardPage(authenticatedClientPage)
    await dashboard.goto()
    await expectClientDashboardVisible(authenticatedClientPage, dashboardContent.client.welcomeMessage)
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('client', testInfo.workerIndex)
  })

  test('only display valid numbers in dashboard metrics', async ({ authenticatedClientPage }) => {
    await expectClientMetricsVisible(authenticatedClientPage, dashboardContent.client.metrics)
    const metricsValues = await dashboard.metricsValues
    expect(metricsValues.length).toBeGreaterThan(0)
    for (const metricValue of metricsValues) {
      await expect(metricValue).toHaveText(/^\$?\s*\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?$/, { timeout: 10000 })
    }
  })
})
