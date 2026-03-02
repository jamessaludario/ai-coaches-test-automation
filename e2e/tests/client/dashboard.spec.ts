import { dashboardContent, timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import { ClientDashboardPage } from '../../page-objects/client/dashboard.page'

test.describe('Client Dashboard', () => {
  test.setTimeout(timeouts.workflow.extended)
  let dashboard: ClientDashboardPage

  test.beforeEach(async ({ authenticatedClientPage }) => {
    dashboard = new ClientDashboardPage(authenticatedClientPage)
    await dashboard.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({}, testInfo) => {
    cleanupAuthFile('client', testInfo.workerIndex)
  })

  test('display dashboard content', async ({ authenticatedClientPage }) => {
    await expect(dashboard.dashboardHeading).toBeVisible({ timeout: timeouts.page.pageLoad })
    await expect(dashboard.welcomeText).toBeVisible()
  })

  test('navigate to workshops', async ({ authenticatedClientPage }) => {
    await dashboard.navigateToWorkshops()
    await expect(authenticatedClientPage.getByRole('heading', { name: 'Workshops', exact: true })).toBeVisible()
  })

  test('navigate to bookings', async ({ authenticatedClientPage }) => {
    await dashboard.navigateToBookings()
    await expect(authenticatedClientPage.getByRole('heading', { name: 'Bookings', exact: true })).toBeVisible()
  })
})
