import { adminRoutes, adminSelectors, timeouts } from '../../constants'
import { clickRowAction, clickTab, searchDataTable } from '../../helpers'
import { BasePage } from '../base.page'

export class AdminBookingsPage extends BasePage {
  private static readonly BOOKING_ID_COLUMN_INDEX = 3
  private static readonly BOOKING_WORKSHOP_COLUMN_INDEX = 1

  get heading() { return this.page.getByRole('heading', { name: adminSelectors.bookings.heading }) }
  get createButton() { return this.page.getByRole('button', { name: adminSelectors.bookings.addButton }) }
  get searchInput() { return this.page.getByRole('textbox', { name: adminSelectors.dataTable.searchInput }) }
  get dataTable() { return this.page.getByRole('table') }

  getBookingCell(bookingIdentifier: string | RegExp) { return this.page.getByRole('cell', { name: bookingIdentifier }) }
  getTab(tabName: string | RegExp) { return this.page.getByRole('tab', { name: tabName }) }

  async goto() {
    await this.navigate(adminRoutes.bookings)
    await this.heading.waitFor()
  }

  async gotoBookingDetail(bookingId: string) {
    await this.navigate(adminRoutes.bookingDetail(bookingId))
    await this.waitForPageLoad()
  }

  async searchBooking(query: string) { await searchDataTable(this.page, query) }

  async viewBooking(bookingId: string) {
    await clickRowAction(this.page, bookingId, 'manage')
    await this.page.waitForURL(adminRoutes.bookingDetail(bookingId), { timeout: timeouts.page.navigation })
  }

  async clickDetailsTab() { await clickTab(this.page, adminSelectors.bookings.tabs.details) }
  async clickSeatsTab() { await clickTab(this.page, adminSelectors.bookings.tabs.seats) }
  async clickPaymentsTab() { await clickTab(this.page, adminSelectors.bookings.tabs.payments) }

  async getFirstBookingId(): Promise<string | null> {
    return await this.getFirstBookingCellText(AdminBookingsPage.BOOKING_ID_COLUMN_INDEX)
  }

  async getFirstBookingWorkshop(): Promise<string | null> {
    return await this.getFirstBookingCellText(AdminBookingsPage.BOOKING_WORKSHOP_COLUMN_INDEX)
  }

  private async getFirstBookingCellText(columnIndex: number): Promise<string | null> {
    const firstBookingCell = this.page.locator('tbody tr').first().locator('td').nth(columnIndex)
    return await firstBookingCell.textContent()
  }
}
