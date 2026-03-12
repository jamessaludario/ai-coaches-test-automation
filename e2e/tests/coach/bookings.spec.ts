import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Coach Bookings', () => {
  test.setTimeout(timeouts.workflow.extended)

  // eslint-disable-next-line no-empty-pattern
  

  test('display bookings page', async ({ authenticatedCoachPage }) => {
    await authenticatedCoachPage.goto('/c/bookings')
    await authenticatedCoachPage.waitForLoadState('networkidle')
  })
})
