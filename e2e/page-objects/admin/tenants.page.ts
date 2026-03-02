import { BasePage } from '../base.page'

export class AdminTenantsPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: /tenants/i }) }
  get dataTable() { return this.page.getByRole('table') }
  get createButton() { return this.page.getByRole('button', { name: /new/i }) }
}
