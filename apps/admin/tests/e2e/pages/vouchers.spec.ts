import { randomBytes } from 'node:crypto'
import { timeouts, voucherFixtures } from '../constants'
import { cleanupAuthFile, expect, test } from '../fixtures'
import {
  expectVoucherCreateFormOpen,
  expectVoucherInTable,
  expectVouchersPageLoaded,
} from '../helpers'
import { VouchersPage } from '../page-objects'

test.describe('Admin Vouchers Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let vouchersPage: VouchersPage

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    vouchersPage = new VouchersPage(authenticatedAdminPage)
    await vouchersPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('admin', testInfo.workerIndex)
  })

  test('display vouchers page with data table', async ({ authenticatedAdminPage }) => {
    // Assert
    await expectVouchersPageLoaded(authenticatedAdminPage)
    await expect(vouchersPage.heading).toBeVisible()
    await expect(vouchersPage.dataTable).toBeVisible()
  })

  test('open create voucher dialog when clicking create button', async ({ authenticatedAdminPage }) => {
    // Act
    await vouchersPage.clickCreateVoucher()

    // Assert
    await expectVoucherCreateFormOpen(authenticatedAdminPage)
  })

  test('create a new percentage voucher', async ({ authenticatedAdminPage }) => {
    // Arrange
    const voucherData = voucherFixtures.percentage

    // Act
    const uniqueCode = `PERCENT_${randomBytes(8).toString('hex')}`

    await vouchersPage.createVoucher({
      code: uniqueCode,
      discount: voucherData.discount,
      type: voucherData.type,
      maxUses: voucherData.maxUses,
    })

    // Assert
    await expectVoucherInTable(authenticatedAdminPage, uniqueCode)

    // Cleanup
    await vouchersPage.deleteVoucher(uniqueCode)
  })

  test('create a new fixed amount voucher', async ({ authenticatedAdminPage }) => {
    // Arrange
    const voucherData = voucherFixtures.fixed

    // Act
    const uniqueCode = `FIXED_${randomBytes(8).toString('hex')}`

    await vouchersPage.createVoucher({
      code: uniqueCode,
      discount: voucherData.discount,
      type: voucherData.type,
      maxUses: voucherData.maxUses,
    })

    // Assert
    await expectVoucherInTable(authenticatedAdminPage, uniqueCode)

    // Cleanup
    await vouchersPage.deleteVoucher(uniqueCode)
  })

  test('search for vouchers in data table', async ({ authenticatedAdminPage }) => {
    // Arrange
    const testVoucher = {
      code: `SEARCH_TEST_${randomBytes(8).toString('hex')}`,
      discount: 15,
      type: 'Percentage' as const,
      maxUses: 10,
    }
    await vouchersPage.createVoucher(testVoucher)

    // Act
    await vouchersPage.searchVoucher(testVoucher.code)

    // Assert
    await expectVoucherInTable(authenticatedAdminPage, testVoucher.code)
  })
})
