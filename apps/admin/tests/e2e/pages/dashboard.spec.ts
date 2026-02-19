import { adminRoutes, adminSelectors, timeouts } from '../constants'
import { cleanupAuthFile, expect, test } from '../fixtures'
import {
  expectCalendarVisible,
  expectDashboardPageLoaded,
  expectMetricsVisible,
  expectUserCreateFormOpen,
} from '../helpers'
import { DashboardPage } from '../page-objects'

test.describe('Admin Dashboard', () => {
  test.setTimeout(timeouts.workflow.extended)
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    dashboardPage = new DashboardPage(authenticatedAdminPage)
    await dashboardPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('admin', testInfo.workerIndex)
  })

  test('displays dashboard page with all elements', async ({ authenticatedAdminPage }) => {
    // Assert
    await expectDashboardPageLoaded(authenticatedAdminPage)
    await expectMetricsVisible(authenticatedAdminPage)
    await expectCalendarVisible(authenticatedAdminPage)
  })

  test('displays welcome message with admin name', async () => {
    // Assert
    await expect(dashboardPage.welcomeMessage).toBeVisible({ timeout: timeouts.page.pageLoad })
    await expect(dashboardPage.welcomeMessage).toContainText(adminSelectors.dashboard.welcomeMessage)
  })

  test('opens user creation dialog when clicking Add User button', async ({ authenticatedAdminPage }) => {
    // Act
    await dashboardPage.clickAddUser()

    // Assert
    await expectUserCreateFormOpen(authenticatedAdminPage)
  })

  test('navigates to dashboard from other pages', async ({ authenticatedAdminPage }) => {
    // Arrange
    await authenticatedAdminPage.goto(adminRoutes.users, { waitUntil: 'domcontentloaded' })

    // Act
    await authenticatedAdminPage.getByRole('link', { name: adminSelectors.sidebar.dashboard }).click()

    // Assert
    await expectDashboardPageLoaded(authenticatedAdminPage)
  })
})
