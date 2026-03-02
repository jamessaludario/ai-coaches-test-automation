import { adminRoutes, adminSelectors, timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import { AdminDashboardPage } from '../../page-objects/admin/dashboard.page'

test.describe('Admin Dashboard', () => {
  test.setTimeout(timeouts.workflow.extended)
  let dashboardPage: AdminDashboardPage

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    dashboardPage = new AdminDashboardPage(authenticatedAdminPage)
    await dashboardPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({}, testInfo) => {
    await cleanupAuthFile('admin', testInfo.workerIndex)
  })

  test('displays dashboard page with all elements', async () => {
    await expect(dashboardPage.heading).toBeVisible()
    await expect(dashboardPage.welcomeMessage).toBeVisible()
  })

  test('opens user creation dialog', async ({ authenticatedAdminPage }) => {
    await dashboardPage.clickAddUser()
    await expect(dashboardPage.getCreateUserDialog()).toBeVisible()
  })
})
