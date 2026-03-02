import { BasePage } from '../base.page'

export class ClientPaymentsPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: /payments/i }) }
  get dataTable() { return this.page.getByRole('table') }
  get emptyState() { return this.page.getByText(/No.*payments|No results/i) }
}
