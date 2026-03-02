import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Client Schedule Requests', () => {
  test.setTimeout(timeouts.workflow.extended)
  test.skip(true, 'Schedule requests tests pending implementation')

  test('view schedule requests', async ({ authenticatedClientPage }) => {
    // TODO: Implement
  })
})
