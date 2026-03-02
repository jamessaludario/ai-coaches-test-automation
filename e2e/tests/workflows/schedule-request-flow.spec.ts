import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Schedule Request Flow', () => {
  test.setTimeout(timeouts.workflow.fullWorkflow)
  test.skip(true, 'Schedule request flow tests pending implementation')

  test('client requests schedule and coach responds', async ({ page, browser }) => {
    // TODO: Implement
  })
})
