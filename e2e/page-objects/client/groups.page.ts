import { BasePage } from '../base.page'

export class ClientGroupsPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: /groups/i }) }
  get dataTable() { return this.page.getByRole('table') }
  get emptyState() { return this.page.getByText(/No.*groups|No results/i) }
}
