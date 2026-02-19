import { adminUserFixtures, timeouts } from '../constants'
import { cleanupAuthFile, expect, test } from '../fixtures'
import {
  expectUserCreateFormOpen,
  expectUserDetailPageLoaded,
  expectUserDetailTabsVisible,
  expectUserInTable,
  expectUsersPageLoaded,
} from '../helpers'
import { UsersPage } from '../page-objects'

test.describe('Admin Users Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let usersPage: UsersPage

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    usersPage = new UsersPage(authenticatedAdminPage)
    await usersPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('admin', testInfo.workerIndex)
  })

  test('displays users page with data table', async ({ authenticatedAdminPage }) => {
    // Assert
    await expectUsersPageLoaded(authenticatedAdminPage)
    await expect(usersPage.dataTable).toBeVisible()
  })

  test('opens create user dialog when clicking create button', async ({ authenticatedAdminPage }) => {
    // Act
    await usersPage.clickCreateUser()

    // Assert
    await expectUserCreateFormOpen(authenticatedAdminPage)
  })

  test('creates a new client user', async ({ authenticatedAdminPage }) => {
    // Arrange
    const timestamp = Date.now()
    const userData = {
      ...adminUserFixtures.newClient,
      email: `test-client-${timestamp}@example.com`,
      username: `client_${timestamp}`,
    }

    // Act
    await usersPage.createUser(userData)

    // Assert
    await expectUserDetailPageLoaded(authenticatedAdminPage, userData.username)
    await usersPage.goto()
    await expectUserInTable(authenticatedAdminPage, userData.email)
  })

  test('creates a new coach user', async ({ authenticatedAdminPage }) => {
    // Arrange
    const timestamp = Date.now()
    const userData = {
      ...adminUserFixtures.newCoach,
      email: `test-coach-${timestamp}@example.com`,
      username: `coach_${timestamp}`,
    }

    // Act
    await usersPage.createUser(userData)

    // Assert
    await expectUserDetailPageLoaded(authenticatedAdminPage, userData.username)
    await usersPage.goto()
    await expectUserInTable(authenticatedAdminPage, userData.email)
  })

  test('searches for users in data table', async () => {
    // Arrange
    const searchQuery = 'Test'

    // Act
    await usersPage.searchUser(searchQuery)

    // Assert
    await expect(usersPage.dataTable).toBeVisible()
    const rows = await usersPage.dataTable.locator('tbody tr').all()
    expect(rows.length).toBeGreaterThan(0)

    for (const row of rows) {
      const text = await row.textContent()
      expect(text?.toLowerCase()).toContain(searchQuery.toLowerCase())
    }
  })

  test('navigates to user detail page', async ({ authenticatedAdminPage }) => {
    // Act
    const userName = await usersPage.getFirstUserCellText(2)

    if (!userName) {
      test.skip(true, 'No user name visible in data table')
      return
    }

    await usersPage.viewUser(userName)
    await expectUserDetailPageLoaded(authenticatedAdminPage, userName)
  })

  test('displays user detail tabs', async ({ authenticatedAdminPage }) => {
    // Arrange
    const userName = await usersPage.getFirstUserCellText(2)

    if (!userName) {
      test.skip(true, 'No user name visible in data table')
      return
    }

    await usersPage.viewUser(userName)
    await expectUserDetailPageLoaded(authenticatedAdminPage, userName)

    // Act & Assert
    await expectUserDetailTabsVisible(authenticatedAdminPage)
  })

  test('fills user form with all fields', async () => {
    // Arrange
    await usersPage.clickCreateUser()
    const userData = adminUserFixtures.newClient

    // Act
    await usersPage.fillCreateUserForm({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      username: userData.username,
    })

    // Assert
    await expect(usersPage.firstNameInput).toHaveValue(userData.firstName)
    await expect(usersPage.lastNameInput).toHaveValue(userData.lastName)
    await expect(usersPage.emailInput).toHaveValue(userData.email)
    await expect(usersPage.usernameInput).toHaveValue(userData.username)
  })

  test('shows validation error for empty required fields', async () => {
    // Arrange
    await usersPage.clickCreateUser()

    // Act
    await usersPage.continueButton.click()

    // Assert
    await expect(usersPage.formErrorMessage.first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
  })
})
