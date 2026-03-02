import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Voucher Redemption', () => {
  test.setTimeout(timeouts.workflow.fullWorkflow)
  test.skip(true, 'Voucher redemption tests pending implementation')

  test('redeem voucher during booking', async ({ page }) => {
    // TODO: Implement
  })
})
