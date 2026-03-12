import { adminSelectors, timeouts } from '../../constants'
import { expect, test } from '../../fixtures'
import { AdminBookingsPage } from '../../page-objects/admin/bookings.page'

test.describe('Admin Bookings Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let bookingsPage: AdminBookingsPage

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    bookingsPage = new AdminBookingsPage(authenticatedAdminPage)
    await bookingsPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  

  test('display bookings page with data table', async () => {
    await expect(bookingsPage.heading).toBeVisible()
    await expect(bookingsPage.dataTable).toBeVisible()
  })

  test('search for bookings', async () => {
    await bookingsPage.searchBooking('AI Agent')
  })

  test('navigate to booking detail', async ({ authenticatedAdminPage }) => {
    const bookingId = await bookingsPage.getFirstBookingId()
    if (!bookingId) { test.skip(true, 'No bookings available'); return }
    await bookingsPage.viewBooking(bookingId!)
  })
})
