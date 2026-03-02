import { timeouts } from '../../constants'
import { cleanupAuthFile, test } from '../../fixtures'

test.describe('Coach Bookings', () => {
  test.setTimeout(timeouts.workflow.extended)

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({}, testInfo) => {
    await cleanupAuthFile('coach', testInfo.workerIndex)
  })

  test('display bookings page', async ({ authenticatedCoachPage }) => {
    await authenticatedCoachPage.goto('/c/bookings')
    await authenticatedCoachPage.waitForLoadState('networkidle')
  })
})
