import { BasePage } from '../base.page'

export class ClientScheduleRequestsPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: /schedule.*requests/i }) }
  get dataTable() { return this.page.getByRole('table') }
  get emptyState() { return this.page.getByText(/No.*requests|No results/i) }
}
