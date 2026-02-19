import { timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import {
  expectCoachBookingDetailsVisible,
  expectCoachBookingInfoVisible,
  expectCoachBookingTabsVisible,
  getFirstDataTableCellText,
} from '../../helpers'
import { CoachBookingDetailsPage, CoachDashboardPage } from '../../page-objects'

/**
 * Coach Booking Details - Page Tests
 *
 * Tests coach booking details functionality
 */

test.describe('Coach Booking Details', () => {
  test.setTimeout(timeouts.workflow.extended)
  let firstBookingId: string | null = null

  test.beforeAll(async ({ authenticatedCoachPage }) => {
    const dashboard = new CoachDashboardPage(authenticatedCoachPage)
    await dashboard.goto()
    await dashboard.navigateToBookings()
    await authenticatedCoachPage.waitForLoadState('networkidle')

    const BOOKING_ID_COLUMN_INDEX = 3
    firstBookingId = await getFirstDataTableCellText(authenticatedCoachPage, BOOKING_ID_COLUMN_INDEX)
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('coach', testInfo.workerIndex)
  })

  test('display booking information', async ({ authenticatedCoachPage }) => {
    if (!firstBookingId) {
      test.skip(true, 'No bookings available')
    }

    const bookingDetailsPage = new CoachBookingDetailsPage(authenticatedCoachPage)
    await bookingDetailsPage.navigateToBooking(firstBookingId!)
    await expectCoachBookingDetailsVisible(authenticatedCoachPage)
    await expectCoachBookingTabsVisible(authenticatedCoachPage)
    await expectCoachBookingInfoVisible(authenticatedCoachPage)
  })

  test('navigate between booking tabs', async ({ authenticatedCoachPage }) => {
    if (!firstBookingId) {
      test.skip(true, 'No bookings available')
    }

    const bookingDetailsPage = new CoachBookingDetailsPage(authenticatedCoachPage)
    await bookingDetailsPage.navigateToBooking(firstBookingId!)

    const paymentsTab = bookingDetailsPage.paymentsTab
    const hasPaymentsTab = await paymentsTab.isVisible()
    test.skip(!hasPaymentsTab, 'No payments tab available')

    await bookingDetailsPage.navigateToPayments()
    await expect(authenticatedCoachPage).toHaveURL(/\/payments$/)
  })
})
