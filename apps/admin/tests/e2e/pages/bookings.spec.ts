import { adminSelectors, timeouts } from '../constants'
import { cleanupAuthFile, expect, test } from '../fixtures'
import {
  expectBookingDetailPageLoaded,
  expectBookingDetailsTabVisible,
  expectBookingPaymentsTabVisible,
  expectBookingSeatsTabVisible,
  expectBookingsPageLoaded,
} from '../helpers'
import { BookingsPage } from '../page-objects'

test.describe('Admin Bookings Page', () => {
  test.setTimeout(timeouts.workflow.standard)
  let bookingsPage: BookingsPage

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    bookingsPage = new BookingsPage(authenticatedAdminPage)
    await bookingsPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('admin', testInfo.workerIndex)
  })

  test('display bookings page with data table', async ({ authenticatedAdminPage }) => {
    // Assert
    await expectBookingsPageLoaded(authenticatedAdminPage)
    await expect(bookingsPage.heading).toBeVisible()
    await expect(bookingsPage.dataTable).toBeVisible()
  })

  test('search for bookings in data table', async () => {
    // Arrange
    const searchQuery = 'AI Agent'
    await expect(bookingsPage.dataTable).toBeVisible()
    const initialCount = await bookingsPage.dataTable.locator('tbody tr').count()

    // Act
    await bookingsPage.searchBooking(searchQuery)

    // Assert
    await expect(bookingsPage.dataTable).toBeVisible()
    const filteredCount = await bookingsPage.dataTable.locator('tbody tr').count()
    expect(filteredCount).toBeLessThanOrEqual(initialCount)

    const rows = await bookingsPage.dataTable.locator('tbody tr').all()
    if (rows.length > 0) {
      for (const row of rows) {
        const text = await row.textContent()
        expect(text?.toLowerCase()).toContain(searchQuery.toLowerCase())
      }
    }
  })

  test('navigate to booking detail page', async ({ authenticatedAdminPage }) => {
    // Act - Get first booking if available
    const bookingId = await bookingsPage.getFirstBookingId()

    test.skip(!bookingId, 'No booking ID found')

    await bookingsPage.viewBooking(bookingId!)
    await expectBookingDetailPageLoaded(authenticatedAdminPage, bookingId!)
  })

  test('display booking detail tabs', async ({ authenticatedAdminPage }) => {
    // Arrange - Get first booking and navigate to detail
    const bookingId = await bookingsPage.getFirstBookingId()
    const bookingWorkshop = await bookingsPage.getFirstBookingWorkshop()

    // Assert
    test.skip(!bookingId || !bookingWorkshop, 'No booking ID or workshop found')

    await bookingsPage.viewBooking(bookingId!)
    await expectBookingDetailPageLoaded(authenticatedAdminPage, bookingId!)
    await expectBookingDetailsTabVisible(authenticatedAdminPage, bookingWorkshop!)
    await bookingsPage.clickSeatsTab()
    await expectBookingSeatsTabVisible(authenticatedAdminPage)
    await bookingsPage.clickPaymentsTab()
    await expectBookingPaymentsTabVisible(authenticatedAdminPage)
  })

  test('display empty state when no bookings exist', async ({ authenticatedAdminPage }) => {
    // Act - Search for non-existent booking
    await bookingsPage.searchBooking('nonexistent123456')

    // Assert - Should show empty state or no results
    await expect(authenticatedAdminPage.getByText(adminSelectors.notifications.noResults)).toBeVisible({ timeout: timeouts.api.dataTableLoad })
  })
})
