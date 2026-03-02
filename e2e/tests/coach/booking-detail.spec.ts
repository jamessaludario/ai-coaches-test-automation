import { timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import { getFirstDataTableCellText } from '../../helpers'
import { CoachBookingDetailPage } from '../../page-objects/coach/booking-detail.page'
import { CoachDashboardPage } from '../../page-objects/coach/dashboard.page'

test.describe('Coach Booking Details', () => {
  test.setTimeout(timeouts.workflow.extended)
  let firstBookingId: string | null = null

  test.beforeAll(async ({ authenticatedCoachPage }) => {
    const dashboard = new CoachDashboardPage(authenticatedCoachPage)
    await dashboard.goto()
    await dashboard.navigateToBookings()
    await authenticatedCoachPage.waitForLoadState('networkidle')
    firstBookingId = await getFirstDataTableCellText(authenticatedCoachPage, 3)
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({}, testInfo) => {
    await cleanupAuthFile('coach', testInfo.workerIndex)
  })

  test('display booking information', async ({ authenticatedCoachPage }) => {
    if (!firstBookingId) { test.skip(true, 'No bookings available'); return }
    const bookingDetailsPage = new CoachBookingDetailPage(authenticatedCoachPage)
    await bookingDetailsPage.navigateToBooking(firstBookingId!)
    await expect(bookingDetailsPage.workshopTitle).toBeVisible({ timeout: timeouts.page.pageLoad })
  })
})
