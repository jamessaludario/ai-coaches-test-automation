import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Guest Booking Flow', () => {
  test.setTimeout(timeouts.workflow.fullWorkflow)
  test.skip(true, 'Guest booking flow tests pending implementation')

  test('guest completes booking without account', async ({ page }) => {
    
  })
})
