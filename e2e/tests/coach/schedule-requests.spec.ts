import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Coach Schedule Requests', () => {
  test.setTimeout(timeouts.workflow.extended)
  test.skip(true, 'Schedule requests tests pending implementation')

  test('view schedule requests', async ({ authenticatedCoachPage }) => {
    // TODO: Implement
  })
})
