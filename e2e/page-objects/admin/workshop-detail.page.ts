import { BasePage } from '../base.page'

export class AdminWorkshopDetailPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { level: 1 }) }
  get overviewTab() { return this.page.getByRole('tab', { name: /overview/i }) }
  get calendarTab() { return this.page.getByRole('tab', { name: /calendar/i }) }
  get resourcesTab() { return this.page.getByRole('tab', { name: /resources/i }) }
}
