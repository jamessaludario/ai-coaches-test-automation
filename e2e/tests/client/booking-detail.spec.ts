import { timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import { getFirstDataTableCellText } from '../../helpers'
import { ClientBookingDetailPage } from '../../page-objects/client/booking-detail.page'
import { ClientBookingsPage } from '../../page-objects/client/bookings.page'

test.describe('Client Booking Details', () => {
  test.setTimeout(timeouts.workflow.extended)
  let firstBookingId: string | null = null

  test.beforeAll(async ({ authenticatedClientPage }) => {
    const bookingsPage = new ClientBookingsPage(authenticatedClientPage)
    await bookingsPage.goto()
    firstBookingId = await getFirstDataTableCellText(authenticatedClientPage, 2)
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({}, testInfo) => {
    await cleanupAuthFile('client', testInfo.workerIndex)
  })

  test('display booking details page', async ({ authenticatedClientPage }) => {
    if (!firstBookingId) { test.skip(true, 'No bookings available'); return }
    const bookingDetailsPage = new ClientBookingDetailPage(authenticatedClientPage)
    await bookingDetailsPage.navigateToBooking(firstBookingId)
    await expect(bookingDetailsPage.workshopTitle).toBeVisible({ timeout: timeouts.page.pageLoad })
  })
})
