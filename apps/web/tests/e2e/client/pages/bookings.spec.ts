import { timeouts } from '../../constants'
import { cleanupAuthFile, test } from '../../fixtures'
import {
  expectClientBookingsPageLoaded,
  expectClientBookingsVisible,
} from '../../helpers'
import { ClientBookingsPage } from '../../page-objects'

/**
 * Client Bookings - Page Tests
 */
test.describe('Client Bookings', () => {
  test.setTimeout(timeouts.workflow.extended)
  let bookingsPage: ClientBookingsPage

  test.beforeEach(async ({ authenticatedClientPage }) => {
    bookingsPage = new ClientBookingsPage(authenticatedClientPage)
    await bookingsPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    cleanupAuthFile('client', testInfo.workerIndex)
  })

  test('display bookings page', async ({ authenticatedClientPage }) => {
    await expectClientBookingsPageLoaded(authenticatedClientPage)
    await expectClientBookingsVisible(authenticatedClientPage)
  })

  test('search for bookings', async ({ authenticatedClientPage }) => {
    await bookingsPage.searchBookings('workshop')
    await expectClientBookingsVisible(authenticatedClientPage, 'workshop')
  })
})
