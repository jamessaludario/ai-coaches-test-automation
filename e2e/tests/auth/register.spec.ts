import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Registration', () => {
  test.setTimeout(timeouts.workflow.extended)

  test.skip(true, 'Registration tests pending implementation')

  test('register a new user account', async ({ page }) => {
    // TODO: Implement registration test
  })
})
