import { randomBytes } from 'node:crypto'
import { timeouts, voucherFixtures } from '../../constants'
import { expect, test } from '../../fixtures'
import { AdminVouchersPage } from '../../page-objects/admin/vouchers.page'

test.describe('Admin Vouchers Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let vouchersPage: AdminVouchersPage

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    vouchersPage = new AdminVouchersPage(authenticatedAdminPage)
    await vouchersPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  

  test('display vouchers page', async () => {
    await expect(vouchersPage.heading).toBeVisible()
    await expect(vouchersPage.dataTable).toBeVisible()
  })

  test('create a new percentage voucher', async ({ authenticatedAdminPage }) => {
    const uniqueCode = `PERCENT_${randomBytes(8).toString('hex')}`
    await vouchersPage.createVoucher({ code: uniqueCode, discount: voucherFixtures.percentage.discount, type: voucherFixtures.percentage.type, maxUses: voucherFixtures.percentage.maxUses })
    await vouchersPage.deleteVoucher(uniqueCode)
  })
})
