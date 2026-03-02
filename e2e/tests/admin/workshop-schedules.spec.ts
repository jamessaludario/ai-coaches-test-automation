import { timeouts } from '../../constants'
import { test } from '../../fixtures'

test.describe('Admin Workshop Schedules', () => {
  test.setTimeout(timeouts.workflow.extended)
  test.skip(true, 'Workshop schedules tests pending implementation')

  test('display workshop schedules page', async ({ authenticatedAdminPage }) => {
    // TODO: Implement
  })
})
