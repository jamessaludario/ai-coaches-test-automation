import { BasePage } from '../base.page'

export class AdminBookingDetailPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { level: 1 }) }
  get detailsTab() { return this.page.getByRole('tab', { name: /details/i }) }
  get seatsTab() { return this.page.getByRole('tab', { name: /seats/i }) }
  get paymentsTab() { return this.page.getByRole('tab', { name: /payments/i }) }
}
