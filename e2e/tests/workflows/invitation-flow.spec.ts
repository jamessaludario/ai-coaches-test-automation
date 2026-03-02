import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Invitation Flow', () => {
  test.setTimeout(timeouts.workflow.fullWorkflow)
  test.skip(true, 'Invitation flow tests pending implementation')

  test('invite participants to booking', async ({ page, browser }) => {
    // TODO: Implement
  })
})
