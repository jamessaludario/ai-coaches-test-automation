import { BasePage } from '../base.page'

export class CoachAccountPayoutsPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: /payouts/i }) }
  get dataTable() { return this.page.getByRole('table') }
  get emptyState() { return this.page.getByText(/No.*payouts|No results/i) }
}
