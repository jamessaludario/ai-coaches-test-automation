import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Client Payments', () => {
  test.setTimeout(timeouts.workflow.extended)
  test.skip(true, 'Payments tests pending implementation')

  test('view payment history', async ({ authenticatedClientPage }) => {
    // TODO: Implement
  })
})
