import { userRoutes } from '../../constants'
import { nuxtGoto, waitForDataTableLoad } from '../../helpers'
import { BasePage } from '../base.page'

export class ClientBookingsPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: 'Bookings', exact: true }) }
  get searchInput() { return this.page.getByRole('textbox', { name: /Search/i }).first() }
  get dataTable() { return this.page.getByRole('table') }
  get dataTableRows() { return this.dataTable.locator('tbody tr') }
  get emptyState() { return this.page.getByText(/No bookings|No results/i) }

  async goto() {
    await nuxtGoto(this.page, userRoutes.client.bookings)
  }

  async searchBookings(query: string) {
    await this.searchInput.fill(query)
    await this.page.keyboard.press('Enter')
    await waitForDataTableLoad(this.page, query)
  }

  async navigatetoBookingDetail(workshopScheduleName: string) {
    await this.searchBookings(workshopScheduleName)
    await this.dataTableRows.first().getByRole('link').click()
    await waitForDataTableLoad(this.page, workshopScheduleName)
  }
}
