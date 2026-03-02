import { BasePage } from '../base.page'

export class AdminUserDetailPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { level: 1 }) }
  get detailsTab() { return this.page.getByRole('tab', { name: /details/i }) }
  get coachProfileTab() { return this.page.getByRole('tab', { name: /coach.*profile/i }) }
  get workshopsTab() { return this.page.getByRole('tab', { name: /workshops/i }) }
  get payoutsTab() { return this.page.getByRole('tab', { name: /payouts/i }) }
  get editTab() { return this.page.getByRole('tab', { name: /edit/i }) }
}
