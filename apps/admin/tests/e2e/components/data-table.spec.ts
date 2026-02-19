import { adminRoutes, adminSelectors, timeouts } from '../constants'
import { cleanupAuthFile, expect, test } from '../fixtures'
import { searchDataTable, waitForDataTableLoad } from '../helpers'

test.describe('Admin Data Table Component', () => {
  test.setTimeout(timeouts.workflow.extended)

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('admin', testInfo.workerIndex)
  })

  test('display data table on users page', async ({ authenticatedAdminPage }) => {
    // Arrange & Act
    await authenticatedAdminPage.goto(adminRoutes.users)
    await waitForDataTableLoad(authenticatedAdminPage)

    // Assert
    await expect(authenticatedAdminPage.locator('table')).toBeVisible()
    await expect(authenticatedAdminPage.locator('thead')).toBeVisible()
    await expect(authenticatedAdminPage.locator('tbody')).toBeVisible()
  })

  test('display search input in data table', async ({ authenticatedAdminPage }) => {
    // Arrange & Act
    await authenticatedAdminPage.goto(adminRoutes.users)
    await waitForDataTableLoad(authenticatedAdminPage)

    // Assert
    await expect(authenticatedAdminPage.getByRole('textbox', { name: adminSelectors.dataTable.searchInput })).toBeVisible({ timeout: timeouts.api.dataTableLoad })
  })

  test('filter results when searching', async ({ authenticatedAdminPage }) => {
    // Arrange
    await authenticatedAdminPage.goto(adminRoutes.users)
    await waitForDataTableLoad(authenticatedAdminPage)

    const initialRowCount = await authenticatedAdminPage.locator('tbody tr').count()

    // Act
    await searchDataTable(authenticatedAdminPage, 'test')

    // Assert
    const noResultsVisible = await authenticatedAdminPage
      .getByText(adminSelectors.notifications.noResults)
      .isVisible()

    if (noResultsVisible) {
      test.skip(true, 'No test data available - skipping search test')
      return
    }

    const filteredRows = await authenticatedAdminPage.locator('tbody tr').all()

    for (const row of filteredRows) {
      const text = await row.textContent()
      expect(text).not.toBeNull()
      expect(text!.toLowerCase()).toContain('test')
    }

    expect(filteredRows.length).toBeLessThanOrEqual(initialRowCount)
  })

  test('display table headers correctly', async ({ authenticatedAdminPage }) => {
    // Arrange & Act
    await authenticatedAdminPage.goto(adminRoutes.users)
    await waitForDataTableLoad(authenticatedAdminPage)

    // Assert
    const headers = await authenticatedAdminPage.locator('thead th').count()
    expect(headers).toBeGreaterThan(0)
  })

  test('display action buttons in table rows', async ({ authenticatedAdminPage }) => {
    // Arrange & Act
    await authenticatedAdminPage.goto(adminRoutes.users)
    await waitForDataTableLoad(authenticatedAdminPage)

    // Assert
    const rows = await authenticatedAdminPage.locator('tbody tr').all()

    if (rows.length > 0) {
      for (const [index, row] of rows.entries()) {
        await expect(row.getByRole('button'), `Button not visible in row ${index}`).toBeVisible({ timeout: timeouts.api.dataTableLoad })
      }
    }
    else {
      await expect(authenticatedAdminPage.getByText(adminSelectors.notifications.noResults)).toBeVisible({ timeout: timeouts.api.dataTableLoad })
    }
  })

  test('display pagination controls', async ({ authenticatedAdminPage }) => {
    // Arrange & Act
    await authenticatedAdminPage.goto(adminRoutes.users)
    await waitForDataTableLoad(authenticatedAdminPage)

    // Assert
    const nextButton = authenticatedAdminPage.getByRole('button', { name: adminSelectors.dataTable.pagination.next })
    await expect(nextButton).toBeVisible({ timeout: timeouts.api.dataTableLoad })
  })

  const tableRoutes = [
    { name: 'workshops', route: adminRoutes.workshops },
    { name: 'bookings', route: adminRoutes.bookings },
    { name: 'vouchers', route: adminRoutes.vouchers },
  ]

  for (const { name, route } of tableRoutes) {
    test(`maintain table structure on ${name} page`, async ({ authenticatedAdminPage }) => {
      // Arrange & Act
      await authenticatedAdminPage.goto(route)
      await waitForDataTableLoad(authenticatedAdminPage)

      // Assert
      await expect(authenticatedAdminPage.locator('table')).toBeVisible()
      await expect(authenticatedAdminPage.locator('thead')).toBeVisible()
      await expect(authenticatedAdminPage.locator('tbody')).toBeVisible()
    })
  }

  test('display empty state when search yields no results', async ({ authenticatedAdminPage }) => {
    // Arrange
    await authenticatedAdminPage.goto(adminRoutes.users)
    await waitForDataTableLoad(authenticatedAdminPage)

    // Act
    await searchDataTable(authenticatedAdminPage, 'nonexistentdata123456789')

    // Assert
    const noResults = authenticatedAdminPage.getByText(adminSelectors.notifications.noResults)
    await expect(noResults).toBeVisible({ timeout: timeouts.api.dataTableLoad })
  })
})
