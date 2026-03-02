import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Admin Tenants', () => {
  test.setTimeout(timeouts.workflow.extended)
  test.skip(true, 'Tenants tests pending implementation')

  test('display tenants page', async ({ authenticatedAdminPage }) => {
    // TODO: Implement
  })
})
