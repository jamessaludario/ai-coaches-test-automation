import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Admin Roles', () => {
  test.setTimeout(timeouts.workflow.extended)
  test.skip(true, 'Roles tests pending implementation')

  test('display roles page', async ({ authenticatedAdminPage }) => {
    // TODO: Implement
  })
})
