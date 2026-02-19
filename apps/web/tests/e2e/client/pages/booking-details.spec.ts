import { timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import {
  expectClientBookingDetailsVisible,
  expectClientBookingsPageLoaded,
  expectClientBookingTabsVisible,
  expectNotVisible,
  getFirstDataTableCellText,
} from '../../helpers'
import { ClientBookingDetailsPage, ClientBookingsPage } from '../../page-objects'

/**
 * Client Booking Details - Page Tests
 *
 * Tests client booking details functionality
 */

test.describe('Client Booking Details', () => {
  test.setTimeout(timeouts.workflow.extended)
  let firstBookingId: string | null = null

  test.beforeAll(async ({ authenticatedClientPage }) => {
    const bookingsPage = new ClientBookingsPage(authenticatedClientPage)
    await bookingsPage.goto()
    await expectClientBookingsPageLoaded(authenticatedClientPage)
    firstBookingId = await getFirstDataTableCellText(authenticatedClientPage, 2)
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('client', testInfo.workerIndex)
  })

  test('display booking details page', async ({ authenticatedClientPage }) => {
    if (!firstBookingId) {
      test.skip(true, 'No bookings available')
      return
    }

    const bookingDetailsPage = new ClientBookingDetailsPage(authenticatedClientPage)
    await bookingDetailsPage.navigateToBooking(firstBookingId)
    await expectClientBookingDetailsVisible(authenticatedClientPage)
    await expectClientBookingTabsVisible(authenticatedClientPage)
  })

  test('navigate between booking tabs', async ({ authenticatedClientPage }) => {
    if (!firstBookingId) {
      test.skip(true, 'No bookings available')
      return
    }

    const bookingDetailsPage = new ClientBookingDetailsPage(authenticatedClientPage)
    await bookingDetailsPage.navigateToBooking(firstBookingId)

    const resources = bookingDetailsPage.resourcesTab
    const hasResourcesTab = await resources.isVisible()
    test.skip(!hasResourcesTab, 'No resources tab available for this booking')
    await bookingDetailsPage.navigateToResources()
    await expect(authenticatedClientPage).toHaveURL(/\/resources$/)
  })

  test('invite particiapnts to booking', async ({ authenticatedClientPage }) => {
    test.setTimeout(timeouts.workflow.fullWorkflow)
    test.skip(true, 'Skipping test')
    const bookingDetailsPage = new ClientBookingDetailsPage(authenticatedClientPage)
    await bookingDetailsPage.navigateToBooking('01kh0cs1d6bjrs9343b735bnx2')
    await bookingDetailsPage.navigateToSeats()
    await expect(authenticatedClientPage).toHaveURL(/\/seats$/)

    for (let i = 1; i <= 200; i++) {
      await authenticatedClientPage.getByRole('button', { name: 'Invite', exact: true }).click()
      await authenticatedClientPage.getByRole('textbox', { name: 'Email' }).fill(`test${i}@example.com`)
      await authenticatedClientPage.getByRole('button', { name: 'Send Invitation' }).click()
      await expectNotVisible(authenticatedClientPage.getByRole('button', { name: 'Send Invitation' }))
    }
  })
})
