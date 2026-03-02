import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Admin Schedule Requests', () => {
  test.setTimeout(timeouts.workflow.extended)
  test.skip(true, 'Schedule requests tests pending implementation')

  test('display schedule requests page', async ({ authenticatedAdminPage }) => {
    // TODO: Implement
  })
})
