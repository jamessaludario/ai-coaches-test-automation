import { dashboardContent, timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import { CoachDashboardPage } from '../../page-objects/coach/dashboard.page'

test.describe('Coach Dashboard', () => {
  test.setTimeout(timeouts.workflow.extended)
  let dashboard: CoachDashboardPage

  test.beforeEach(async ({ authenticatedCoachPage }) => {
    dashboard = new CoachDashboardPage(authenticatedCoachPage)
    await dashboard.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({}, testInfo) => {
    await cleanupAuthFile('coach', testInfo.workerIndex)
  })

  test('display dashboard content', async ({ authenticatedCoachPage }) => {
    await expect(dashboard.dashboardHeading).toBeVisible({ timeout: timeouts.page.pageLoad })
  })

  test('navigate to workshops', async ({ authenticatedCoachPage }) => {
    await dashboard.navigateToWorkshops()
    await expect(authenticatedCoachPage.getByRole('heading', { name: 'Workshops', exact: true })).toBeVisible()
  })

  test('navigate to bookings', async ({ authenticatedCoachPage }) => {
    await dashboard.navigateToBookings()
    await expect(authenticatedCoachPage.getByRole('heading', { name: 'Bookings', exact: true })).toBeVisible()
  })

  test('access account profile', async ({ authenticatedCoachPage }) => {
    await dashboard.navigateToAccount()
    await expect(authenticatedCoachPage).toHaveURL(/account\/profile/)
  })
})
