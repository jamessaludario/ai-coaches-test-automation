import { BasePage } from '../base.page'

export class AdminScheduleDetailPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { level: 1 }) }
  get overviewTab() { return this.page.getByRole('tab', { name: /overview/i }) }
  get bookingsTab() { return this.page.getByRole('tab', { name: /bookings/i }) }
  get resourcesTab() { return this.page.getByRole('tab', { name: /resources/i }) }
}
