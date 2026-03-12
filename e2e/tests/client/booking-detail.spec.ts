import { timeouts } from '../../constants'
import { expect, test } from '../../fixtures'
import { getFirstDataTableCellText } from '../../helpers'
import { ClientBookingDetailPage } from '../../page-objects/client/booking-detail.page'
import { ClientBookingsPage } from '../../page-objects/client/bookings.page'

test.describe('Client Booking Details', () => {
  test.setTimeout(timeouts.workflow.extended)
  let firstWorkshopScheduleName: string | null = null
  let bookingsPage: ClientBookingsPage

  test.beforeAll(async ({ authenticatedClientPage }) => {
    bookingsPage = new ClientBookingsPage(authenticatedClientPage)
    await bookingsPage.goto()
    firstWorkshopScheduleName = await getFirstDataTableCellText(authenticatedClientPage, 1)
  })

  // eslint-disable-next-line no-empty-pattern
  

  test('display booking details page', async ({ authenticatedClientPage }) => {
    if (!firstWorkshopScheduleName) { test.skip(true, 'No bookings available'); return }
    await bookingsPage.navigatetoBookingDetail(firstWorkshopScheduleName)
    const bookingDetailsPage = new ClientBookingDetailPage(authenticatedClientPage)
    await expect(bookingDetailsPage.workshopTitle).toBeVisible({ timeout: timeouts.page.pageLoad })
  })
})
