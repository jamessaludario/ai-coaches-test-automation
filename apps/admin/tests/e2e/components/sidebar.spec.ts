import { adminRoutes, adminSelectors, timeouts } from '../constants'
import { cleanupAuthFile, expect, test } from '../fixtures'
import { escapeRegExp } from '../utils'

test.describe('Admin Sidebar Component', () => {
  test.setTimeout(timeouts.workflow.extended)

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    await authenticatedAdminPage.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(authenticatedAdminPage.getByRole('link', { name: adminSelectors.sidebar.dashboard })).toBeVisible()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('admin', testInfo.workerIndex)
  })

  const navigationItems = [
    { selector: adminSelectors.sidebar.dashboard, route: adminRoutes.dashboard, heading: adminSelectors.dashboard.heading },
    { selector: adminSelectors.sidebar.users, route: adminRoutes.users, heading: adminSelectors.users.heading },
    { selector: adminSelectors.sidebar.workshops, route: adminRoutes.workshops, heading: adminSelectors.workshops.heading },
    { selector: adminSelectors.sidebar.workshopSchedules, route: adminRoutes.workshopSchedules, heading: adminSelectors.workshopSchedules.heading },
    { selector: adminSelectors.sidebar.bookings, route: adminRoutes.bookings, heading: adminSelectors.bookings.heading },
    { selector: adminSelectors.sidebar.vouchers, route: adminRoutes.vouchers, heading: adminSelectors.vouchers.heading },
    { selector: adminSelectors.sidebar.roles, route: adminRoutes.roles, heading: adminSelectors.roles.heading },
  ]

  test('display all navigation items', async ({ authenticatedAdminPage }) => {
    // Assert
    for (const item of navigationItems) {
      await expect(authenticatedAdminPage.getByRole('link', { name: item.selector })).toBeVisible()
    }
  })

  for (const item of navigationItems) {
    test(`navigate to ${item.route} when clicking link`, async ({ authenticatedAdminPage }) => {
      // Arrange
      const link = authenticatedAdminPage.getByRole('link', { name: item.selector })

      // Act
      await link.click()

      // Assert
      await expect(authenticatedAdminPage).toHaveURL(new RegExp(escapeRegExp(item.route), 'i'))
      await expect(authenticatedAdminPage.getByRole('heading', { name: item.heading })).toBeVisible()
    })
  }

  test('highlight active breadcrumb item', async ({ authenticatedAdminPage }) => {
    // Arrange
    const usersLink = authenticatedAdminPage.getByRole('link', { name: adminSelectors.sidebar.users })
    const breadcrumb = authenticatedAdminPage.getByLabel('breadcrumb').getByRole('link', { name: adminSelectors.sidebar.users })

    // Act
    await usersLink.click()
    await expect(authenticatedAdminPage).toHaveURL(new RegExp(escapeRegExp(adminRoutes.users), 'i'))

    // Assert
    await expect(breadcrumb).toHaveAttribute('aria-current', 'page', { timeout: timeouts.page.pageLoad })
  })

  test('maintain sidebar state across navigation', async ({ authenticatedAdminPage }) => {
    const usersLink = authenticatedAdminPage.getByRole('link', { name: adminSelectors.sidebar.users })
    const dashboardLink = authenticatedAdminPage.getByRole('link', { name: adminSelectors.sidebar.dashboard })
    const workshopsLink = authenticatedAdminPage.getByRole('link', { name: adminSelectors.sidebar.workshops })

    await usersLink.click()
    await expect(authenticatedAdminPage).toHaveURL(new RegExp(escapeRegExp(adminRoutes.users), 'i'))

    await workshopsLink.click()
    await expect(authenticatedAdminPage).toHaveURL(new RegExp(escapeRegExp(adminRoutes.workshops), 'i'))

    await dashboardLink.click()
    await expect(authenticatedAdminPage).toHaveURL(new RegExp(escapeRegExp(adminRoutes.dashboard), 'i'))
  })
})
