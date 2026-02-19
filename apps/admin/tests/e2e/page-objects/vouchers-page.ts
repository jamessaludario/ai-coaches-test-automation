import { adminRoutes, adminSelectors } from '../constants'
import {
  clickRowAction,
  expectToastMessage,
  searchDataTable,
  submitFormAndWaitForSuccess,
  waitForModalClose,
  waitForModalOpen,
} from '../helpers'
import { BasePage } from '../page-objects'

/**
 * Vouchers Page Object
 *
 * Handles voucher page interactions.
 * For assertions, use helpers from `helpers/vouchers-assertions.ts`
 */
export class VouchersPage extends BasePage {
  // Locators
  get heading() {
    return this.page.getByRole('heading', { name: adminSelectors.vouchers.heading })
  }

  get createButton() {
    return this.page.getByRole('button', { name: adminSelectors.vouchers.addButton })
  }

  get searchInput() {
    return this.page.getByRole('textbox', { name: adminSelectors.dataTable.searchInput })
  }

  get dataTable() {
    return this.page.getByTestId('vouchers-table').or(this.page.getByRole('table').first())
  }

  // Form field locators
  get codeInput() {
    return this.page.getByLabel(adminSelectors.vouchers.formDialog.code)
  }

  get discountSelection() {
    return this.page.getByRole('combobox', { name: adminSelectors.vouchers.formDialog.discountType })
  }

  getVoucherCell(voucherCode: string | RegExp) {
    return this.page.getByRole('cell', { name: voucherCode })
  }

  getCreateVoucherDialog() {
    return this.page.getByRole('heading', { name: adminSelectors.dialogs.voucherFormDialog })
  }

  // Actions
  async goto() {
    await this.navigate(adminRoutes.vouchers)
    await this.waitForPageLoad()
  }

  async gotoVoucherDetail(voucherId: string) {
    await this.navigate(adminRoutes.voucherDetail(voucherId))
    await this.waitForPageLoad()
  }

  async clickCreateVoucher() {
    await this.createButton.click()
    await waitForModalOpen(this.page, adminSelectors.dialogs.voucherFormDialog)
  }

  async searchVoucher(query: string) {
    await searchDataTable(this.page, query)
  }

  async fillVoucherForm(data: {
    code: string
    discount: number
    type: string
    maxUses?: number
  }) {
    await this.codeInput.fill(data.code)

    await this.discountSelection.click()
    await this.page.getByRole('option', { name: data.type }).click()

    if (data.type === 'Percentage') {
      await this.page.getByLabel(adminSelectors.vouchers.labels.discountPercentage).fill(String(data.discount))
    }

    if (data.type === 'Fixed Amount') {
      await this.page.getByLabel(adminSelectors.vouchers.labels.discountAmount).fill(String(data.discount))
    }

    if (data.maxUses !== undefined) {
      await this.page.getByLabel(adminSelectors.vouchers.formDialog.maxUses).fill(String(data.maxUses))
    }
  }

  async submitVoucher() {
    await submitFormAndWaitForSuccess(
      this.page,
      adminSelectors.buttons.createVoucher,
      adminSelectors.notifications.voucherCreated,
    )
    await waitForModalClose(this.page)
  }

  async createVoucher(data: {
    code: string
    discount: number
    type: string
    maxUses?: number
  }) {
    await this.clickCreateVoucher()
    await this.fillVoucherForm(data)
    await this.submitVoucher()
  }

  async editVoucher(voucherIdentifier: string | RegExp) {
    await clickRowAction(this.page, voucherIdentifier, 'edit')
    await waitForModalOpen(this.page, adminSelectors.dialogs.voucherFormDialog)
  }

  async deleteVoucher(voucherIdentifier: string | RegExp) {
    await clickRowAction(this.page, voucherIdentifier, 'delete')
    await expectToastMessage(this.page, adminSelectors.notifications.voucherDeleted)
  }
}
