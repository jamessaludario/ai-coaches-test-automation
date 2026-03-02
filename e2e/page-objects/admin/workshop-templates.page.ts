import { BasePage } from '../base.page'

export class AdminWorkshopTemplatesPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: /workshop.*templates/i }) }
  get dataTable() { return this.page.getByRole('table') }
  get createButton() { return this.page.getByRole('button', { name: /new/i }) }
}
