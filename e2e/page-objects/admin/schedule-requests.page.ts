import { BasePage } from '../base.page'

export class AdminScheduleRequestsPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: /schedule.*requests/i }) }
  get dataTable() { return this.page.getByRole('table') }
}
