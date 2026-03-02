import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Onboarding Flow', () => {
  test.setTimeout(timeouts.workflow.extended)

  test.skip(true, 'Onboarding flow tests pending implementation')

  test('complete onboarding as a new user', async ({ page }) => {
    // TODO: Implement onboarding flow test
  })
})
