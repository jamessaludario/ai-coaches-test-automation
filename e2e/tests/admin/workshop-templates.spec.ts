import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Admin Workshop Templates', () => {
  test.setTimeout(timeouts.workflow.extended)
  test.skip(true, 'Workshop templates tests pending implementation')

  test('display workshop templates page', async ({ authenticatedAdminPage }) => {
    // TODO: Implement
  })
})
