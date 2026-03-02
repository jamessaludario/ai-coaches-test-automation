import { BasePage } from '../base.page'

export class AdminCalendarPage extends BasePage {
  get heading() { return this.page.getByRole('heading', { name: /calendar/i }) }
  get calendarGrid() { return this.page.locator('[data-slot="calendar"]') }
  get previousButton() { return this.page.getByRole('button', { name: /previous/i }) }
  get nextButton() { return this.page.getByRole('button', { name: /next/i }) }
}
