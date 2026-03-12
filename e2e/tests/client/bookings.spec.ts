import { timeouts } from '../../constants'
import { expect, test } from '../../fixtures'
import { ClientBookingsPage } from '../../page-objects/client/bookings.page'

test.describe('Client Bookings', () => {
  test.setTimeout(timeouts.workflow.extended)
  let bookingsPage: ClientBookingsPage

  test.beforeEach(async ({ authenticatedClientPage }) => {
    bookingsPage = new ClientBookingsPage(authenticatedClientPage)
    await bookingsPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  

  test('display bookings page', async () => {
    await expect(bookingsPage.heading).toBeVisible({ timeout: timeouts.page.pageLoad })
  })

  test('search for bookings', async () => {
    await bookingsPage.searchBookings('workshop')
  })
})
