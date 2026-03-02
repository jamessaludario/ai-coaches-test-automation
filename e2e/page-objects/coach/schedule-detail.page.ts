import { BasePage } from '../base.page'

export class CoachScheduleDetailPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { level: 1 }) }
  get overviewTab() { return this.page.getByRole('tab', { name: /overview/i }) }
  get bookingsTab() { return this.page.getByRole('tab', { name: /bookings/i }) }
}
