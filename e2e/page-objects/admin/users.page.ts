import { adminRoutes, adminSelectors, timeouts } from '../../constants'
import { clickRowAction, clickTab, searchDataTable, submitFormAndWaitForSuccess, waitForModalClose, waitForModalOpen } from '../../helpers'
import { BasePage } from '../base.page'

export class AdminUsersPage extends BasePage {
  private static readonly USER_EMAIL_COLUMN_INDEX = 2

  get heading() { return this.page.getByRole('heading', { name: adminSelectors.users.heading }) }
  get createButton() { return this.page.getByRole('button', { name: adminSelectors.users.createButton }) }
  get searchInput() { return this.page.getByRole('textbox', { name: adminSelectors.dataTable.searchInput }) }
  get dataTable() { return this.page.getByRole('table') }
  get formErrorMessage() { return this.page.getByRole('dialog').getByRole('alert') }
  get displayNameInput() { return this.page.getByLabel(adminSelectors.forms.displayName) }
  get firstNameInput() { return this.page.getByLabel(adminSelectors.forms.firstName) }
  get lastNameInput() { return this.page.getByLabel(adminSelectors.forms.lastName) }
  get emailInput() { return this.page.getByLabel(adminSelectors.forms.email) }
  get usernameInput() { return this.page.getByLabel(adminSelectors.forms.username) }
  get phoneNumberInput() { return this.page.getByLabel(adminSelectors.forms.phoneNumber) }
  get submitButton() { return this.page.getByRole('button', { name: adminSelectors.buttons.submit }) }
  get continueButton() { return this.page.getByRole('button', { name: adminSelectors.buttons.continue }) }
  get generatePasswordButton() { return this.page.getByRole('button', { name: adminSelectors.buttons.generatePassword }) }

  getUserCell(cellText: string | RegExp) {
    const exact = typeof cellText === 'string'
    return this.page.getByRole('cell', { name: cellText, exact })
  }

  async goto() { await this.navigate(adminRoutes.users) }
  async gotoUserDetail(userId: string) { await this.navigate(adminRoutes.userDetail(userId)) }

  async clickCreateUser() {
    await this.createButton.click()
    await waitForModalOpen(this.page, /Create|Add.*User/i)
  }

  async searchUser(query: string) { await searchDataTable(this.page, query) }

  async fillCreateUserForm(data: { firstName: string, lastName: string, email: string, username?: string }) {
    await this.firstNameInput.fill(data.firstName)
    await this.lastNameInput.fill(data.lastName)
    await this.emailInput.fill(data.email)
    if (data.username) await this.usernameInput.fill(data.username)
  }

  async clickGeneratePassword() { await this.generatePasswordButton.click() }

  async submitUserForm() {
    await submitFormAndWaitForSuccess(this.page, adminSelectors.buttons.continue, adminSelectors.notifications.userCreated)
    await waitForModalClose(this.page)
  }

  async createUser(data: { firstName: string, lastName: string, email: string, username?: string }) {
    await this.clickCreateUser()
    await this.fillCreateUserForm(data)
    await this.clickGeneratePassword()
    await this.submitUserForm()
  }

  async viewUser(userIdentifier: string | RegExp) {
    await clickRowAction(this.page, userIdentifier, 'manage')
    await this.page.waitForURL(adminRoutes.usersRouteRegex, { timeout: timeouts.page.navigation })
  }

  async editUser(userIdentifier: string | RegExp) {
    await clickRowAction(this.page, userIdentifier, 'edit')
    await this.page.getByRole('dialog').locator('form').waitFor({ state: 'visible', timeout: timeouts.ui.modalOpen })
  }

  async deleteUser(userIdentifier: string | RegExp) {
    await clickRowAction(this.page, userIdentifier, 'delete')
    await this.page.waitForSelector('[role="alertdialog"], [role="dialog"]', { state: 'visible', timeout: timeouts.ui.modalOpen })
  }

  async clickDetailsTab() { await clickTab(this.page, adminSelectors.users.tabs.details) }
  async clickCoachProfileTab() { await clickTab(this.page, adminSelectors.users.tabs.coachProfile) }
  async clickWorkshopsTab() { await clickTab(this.page, adminSelectors.users.tabs.workshops) }
  async clickPayoutsTab() { await clickTab(this.page, adminSelectors.users.tabs.payouts) }
  async clickEditTab() { await clickTab(this.page, adminSelectors.users.tabs.edit) }

  async getFirstUserCellText(columnIndex: number = AdminUsersPage.USER_EMAIL_COLUMN_INDEX): Promise<string | null> {
    const firstUserCell = this.dataTable.locator('tbody').getByRole('row').first().getByRole('cell').nth(columnIndex)
    return await firstUserCell.textContent()
  }
}
