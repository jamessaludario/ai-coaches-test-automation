import { BasePage } from '../base.page'

export class CoachBookingsPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: /bookings/i }) }
  get dataTable() { return this.page.getByRole('table') }
  get searchInput() { return this.page.getByRole('textbox', { name: /search/i }).first() }
}
