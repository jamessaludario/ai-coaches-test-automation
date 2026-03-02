import { adminUserFixtures, timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import { AdminUsersPage } from '../../page-objects/admin/users.page'

test.describe('Admin Users Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let usersPage: AdminUsersPage

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    usersPage = new AdminUsersPage(authenticatedAdminPage)
    await usersPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({}, testInfo) => {
    await cleanupAuthFile('admin', testInfo.workerIndex)
  })

  test('displays users page with data table', async () => {
    await expect(usersPage.heading).toBeVisible()
    await expect(usersPage.dataTable).toBeVisible()
  })

  test('creates a new user', async ({ authenticatedAdminPage }) => {
    const timestamp = Date.now()
    const userData = {
      ...adminUserFixtures.newClient,
      email: `test-client-${timestamp}@example.com`,
      username: `client_${timestamp}`,
    }
    await usersPage.createUser(userData)
  })

  test('searches for users', async () => {
    await usersPage.searchUser('Test')
    await expect(usersPage.dataTable).toBeVisible()
  })
})
