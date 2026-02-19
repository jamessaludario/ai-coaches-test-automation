import { adminRoutes, adminSelectors, adminUserFixtures, timeouts } from '../constants'
import { cleanupAuthFile, expect, test } from '../fixtures'
import { expectToastMessage, fillFormFields, waitForModalClose, waitForModalOpen } from '../helpers'

test.describe('Admin Form Dialog Component', () => {
  test.setTimeout(timeouts.workflow.extended)

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('admin', testInfo.workerIndex)
  })

  test('open and close form dialog when clicking cancel', async ({ authenticatedAdminPage }) => {
    // Arrange
    await authenticatedAdminPage.goto(adminRoutes.dashboard, { waitUntil: 'networkidle' })
    await authenticatedAdminPage.getByRole('button', { name: adminSelectors.buttons.addNewUser }).click()
    await waitForModalOpen(authenticatedAdminPage, adminSelectors.dialogs.createUserFormDialog)

    // Act
    const cancelButton = authenticatedAdminPage.getByRole('button', { name: adminSelectors.buttons.cancel })
    const closeButton = authenticatedAdminPage.getByRole('button', { name: adminSelectors.buttons.close })

    const combinedButton = cancelButton.or(closeButton)
    const firstButton = combinedButton.first()
    await firstButton.waitFor({ state: 'visible', timeout: timeouts.ui.modalOpen })
    await firstButton.click()

    // Assert
    await waitForModalClose(authenticatedAdminPage)
  })

  test('display form fields and buttons in create user dialog', async ({ authenticatedAdminPage }) => {
    // Arrange
    await authenticatedAdminPage.goto(adminRoutes.dashboard, { waitUntil: 'networkidle' })
    await authenticatedAdminPage.getByRole('button', { name: adminSelectors.buttons.addNewUser }).click()
    await waitForModalOpen(authenticatedAdminPage, adminSelectors.dialogs.createUserFormDialog)

    // Assert
    await expect(authenticatedAdminPage.getByLabel(adminSelectors.forms.username)).toBeVisible({ timeout: timeouts.ui.modalOpen })
    await expect(authenticatedAdminPage.getByLabel(adminSelectors.forms.firstName)).toBeVisible({ timeout: timeouts.ui.modalOpen })
    await expect(authenticatedAdminPage.getByLabel(adminSelectors.forms.lastName)).toBeVisible({ timeout: timeouts.ui.modalOpen })
    await expect(authenticatedAdminPage.getByLabel(adminSelectors.forms.email)).toBeVisible({ timeout: timeouts.ui.modalOpen })
    await expect(authenticatedAdminPage.getByRole('button', { name: adminSelectors.buttons.continue })).toBeVisible({ timeout: timeouts.ui.modalOpen })
    await expect(authenticatedAdminPage.getByRole('button', { name: adminSelectors.buttons.saveAsDraft })).toBeVisible({ timeout: timeouts.ui.modalOpen })
  })

  test('validate required fields', async ({ authenticatedAdminPage }) => {
    // Arrange
    await authenticatedAdminPage.goto(adminRoutes.dashboard, { waitUntil: 'networkidle' })
    await authenticatedAdminPage.getByRole('button', { name: adminSelectors.buttons.addNewUser }).click()
    await waitForModalOpen(authenticatedAdminPage, adminSelectors.dialogs.createUserFormDialog)

    // Act
    const submitButton = authenticatedAdminPage.getByRole('button', { name: adminSelectors.buttons.continue })
    await submitButton.click()

    // Assert
    await expect(
      authenticatedAdminPage.getByRole('alert').filter({ hasText: adminSelectors.notifications.required }).first(),
    ).toBeVisible({ timeout: timeouts.ui.modalOpen })
  })

  test('display voucher form fields', async ({ authenticatedAdminPage }) => {
    // Arrange
    await authenticatedAdminPage.goto(adminRoutes.vouchers, { waitUntil: 'networkidle' })
    // Act
    const createButton = authenticatedAdminPage.getByRole('button', { name: adminSelectors.buttons.new })
    await createButton.click()

    // Assert
    await waitForModalOpen(authenticatedAdminPage, adminSelectors.dialogs.voucherFormDialog)
    await expect(authenticatedAdminPage.getByLabel(adminSelectors.vouchers.formDialog.code)).toBeVisible({ timeout: timeouts.ui.modalOpen })
    await expect(authenticatedAdminPage.getByLabel(adminSelectors.vouchers.formDialog.discountType)).toBeVisible({ timeout: timeouts.ui.modalOpen })
    await expect(authenticatedAdminPage.getByLabel(adminSelectors.vouchers.formDialog.expiresAt)).toBeVisible({ timeout: timeouts.ui.modalOpen })
    await expect(authenticatedAdminPage.getByLabel(adminSelectors.vouchers.formDialog.maxUses)).toBeVisible({ timeout: timeouts.ui.modalOpen })
  })

  test('fill multiple form fields at once', async ({ authenticatedAdminPage }) => {
    // Arrange
    await authenticatedAdminPage.goto(adminRoutes.dashboard, { waitUntil: 'networkidle' })
    await authenticatedAdminPage.getByRole('button', { name: adminSelectors.buttons.addNewUser }).click()
    await waitForModalOpen(authenticatedAdminPage, adminSelectors.dialogs.createUserFormDialog)
    await fillFormFields(authenticatedAdminPage, adminUserFixtures.newClient, adminSelectors.formsLabelMap)

    // Assert
    const firstNameInput = authenticatedAdminPage.getByLabel(adminSelectors.forms.firstName)
    const lastNameInput = authenticatedAdminPage.getByLabel(adminSelectors.forms.lastName)
    const emailInput = authenticatedAdminPage.getByLabel(adminSelectors.forms.email)
    const usernameInput = authenticatedAdminPage.getByLabel(adminSelectors.forms.username)
    const passwordInput = authenticatedAdminPage.getByLabel(adminSelectors.forms.password)

    await expect(firstNameInput).toHaveValue(adminUserFixtures.newClient.firstName)
    await expect(lastNameInput).toHaveValue(adminUserFixtures.newClient.lastName)
    await expect(emailInput).toHaveValue(adminUserFixtures.newClient.email)
    await expect(usernameInput).toHaveValue(adminUserFixtures.newClient.username)
    await expect(passwordInput).toHaveValue(adminUserFixtures.newClient.password)
  })

  test('handle form submission', async ({ authenticatedAdminPage }) => {
    // Arrange
    const uniqueSuffix = Date.now()
    const newUser = {
      ...adminUserFixtures.newUser,
      email: `test-${uniqueSuffix}@example.com`,
      username: `user-${uniqueSuffix}`,
    }

    await authenticatedAdminPage.goto(adminRoutes.dashboard, { waitUntil: 'networkidle' })
    await authenticatedAdminPage.getByRole('button', { name: adminSelectors.buttons.addNewUser }).click()
    await waitForModalOpen(authenticatedAdminPage, adminSelectors.dialogs.createUserFormDialog)

    // Fill required fields
    await fillFormFields(authenticatedAdminPage, newUser, adminSelectors.formsLabelMap)

    // Act
    const submitButton = authenticatedAdminPage.getByRole('button', { name: adminSelectors.buttons.continue })
    await submitButton.click()

    // Assert
    await waitForModalClose(authenticatedAdminPage)
    await expectToastMessage(authenticatedAdminPage, adminSelectors.notifications.success)
    await expect(authenticatedAdminPage).toHaveURL(new RegExp(adminRoutes.users, 'i'))
    await expect(authenticatedAdminPage
      .getByRole('heading', { name: `${newUser.firstName} ${newUser.lastName}` }))
      .toBeVisible({ timeout: timeouts.page.navigation })
  })
})
