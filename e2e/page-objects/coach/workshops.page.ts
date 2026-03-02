import { BasePage } from '../base.page'

export class CoachWorkshopsPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: /workshops/i }) }
  get searchInput() { return this.page.getByRole('textbox', { name: /search/i }).first() }
  get dataTable() { return this.page.getByRole('table') }
}
