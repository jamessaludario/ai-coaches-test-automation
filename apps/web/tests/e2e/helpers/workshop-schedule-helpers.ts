import type { Locator, Page } from 'playwright'
import type { ScheduleData, ScheduleReference } from '../constants'
import { expect } from '@nuxt/test-utils/playwright'
import { SCHEDULE_EVENT_SELECTOR, timeouts, userRoutes, waitTimeouts } from '../constants'
import { clickRowAction, clickRowLink, comboboxTextMatches, expectToastMessage, inputValueMatches, waitForDataTableLoad } from '../helpers'
import { formatDateTimeLocal, setTime } from '../utils'

export async function openWorkshop(page: Page, workshopName: string): Promise<void> {
  const searchBox = page.getByRole('textbox', { name: /search/i })
  await expect(searchBox).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await searchBox.fill(workshopName)
  await page.keyboard.press('Enter')

  await waitForDataTableLoad(page, workshopName)
  await clickRowAction(page, workshopName, 'manage')
  await page.waitForURL(userRoutes.coach.workshopDetails, { timeout: timeouts.page.navigation })
  await expect(page.getByRole('heading', { name: workshopName, exact: true }).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function openWorkshopViaLink(page: Page, workshopName: string): Promise<void> {
  const searchBox = page.getByRole('textbox', { name: /search/i })
  await expect(searchBox).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await searchBox.fill(workshopName)
  await page.keyboard.press('Enter')

  await waitForDataTableLoad(page, workshopName)
  await clickRowLink(page, workshopName)
  await expect(page.getByRole('heading', { name: workshopName, exact: true }).first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function fillScheduleForm(page: Page, data: ScheduleData) {
  const {
    startDate,
    endDate,
    startTime = '10:00',
    endTime = '11:00',
    country = 'Philippines',
    level = 'Beginner',
    status = 'Published',
    visibility = 'Public',
    mode = 'Online',
  } = data

  const fillDateTimeInput: (labelPattern: RegExp, date: Date, time: string) => Promise<void> = async (labelPattern, date, time) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new TypeError('Invalid Date object provided to fillDateTimeInput')
    }

    const input = page.getByLabel(labelPattern)
    const isVisible = await input.isVisible().catch(() => false)

    if (isVisible) {
      const [hours, minutes] = time.split(':').map(Number)
      if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        throw new TypeError(`Invalid time format provided to fillDateTimeInput: expected HH:MM, got ${time}`)
      }
      const dateWithTime = setTime(date, hours || 0, minutes || 0)
      if (!(dateWithTime instanceof Date) || Number.isNaN(dateWithTime.getTime())) {
        throw new TypeError('Invalid Date object returned from setTime')
      }
      await input.fill(formatDateTimeLocal(dateWithTime))
    }
  }

  const selectDropdownOption = async (labelPattern: RegExp, optionValue: string) => {
    const select = page.getByRole('combobox', { name: labelPattern })
    const isVisible = await select.isVisible({ timeout: timeouts.ui.elementVisible }).catch(() => false)

    if (isVisible) {
      await select.click()
      await expect(page.getByRole('option', { name: new RegExp(optionValue, 'i') })).toBeVisible({ timeout: timeouts.ui.elementVisible })
      await page.getByRole('option', { name: new RegExp(optionValue, 'i') }).click()
    }
  }

  await fillDateTimeInput(/start date|begin date|start time/i, startDate, startTime)
  await fillDateTimeInput(/end date|finish date|end time/i, endDate, endTime)

  await selectDropdownOption(/country|location/i, country)
  await page.waitForTimeout(timeouts.wait.short)
  await selectDropdownOption(/level/i, level)
  await page.waitForTimeout(timeouts.wait.short)
  await selectDropdownOption(/status/i, status)
  await page.waitForTimeout(timeouts.wait.short)
  await selectDropdownOption(/visibility/i, visibility)
  await page.waitForTimeout(timeouts.wait.short)
  await selectDropdownOption(/mode/i, mode) 
  await page.waitForTimeout(timeouts.wait.short)
}

export async function submitScheduleForm(page: Page, buttonName = /schedule|save|create|submit/i) {
  const submitButton = page.getByRole('button', { name: buttonName })
  await expect(submitButton).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await submitButton.click()

  await Promise.race([
    page.getByRole('heading', { name: /schedule|new event|edit|update/i }).waitFor({ state: 'hidden', timeout: timeouts.ui.elementHidden }),
    expectToastMessage(page, /success|created|updated|saved/i),
  ]).catch((err) => {
    throw new Error('Neither dialog closed nor success toast appeared after submission', { cause: err })
  })
}

async function checkEventMatchesCriteria(
  page: Page,
  event: Locator,
  criteria: { status?: string, date?: Date },
): Promise<boolean> {
  const isAttached = await event.isVisible().catch(() => false)
  if (!isAttached) {
    return false
  }

  try {
    await event.click({ force: false, timeout: timeouts.ui.elementVisible })

    const startDateInput = page.locator('input[name="startDate"]')
    const statusCombobox = page.getByRole('combobox', { name: /status/i })

    await expect(startDateInput).toBeVisible({ timeout: timeouts.ui.elementVisible })

    const dateMatches = criteria.date
      ? await inputValueMatches(startDateInput, formatDateTimeLocal(criteria.date))
      : true

    const statusMatches = criteria.status
      ? await comboboxTextMatches(statusCombobox, criteria.status)
      : true

    await page.keyboard.press('Escape')
    await page.locator('[role="dialog"]').waitFor({ state: 'hidden', timeout: timeouts.ui.modalClose }).catch(() => {})

    return dateMatches && statusMatches
  }
  catch (error) {
    console.error('Error checking event criteria:', error)
    await page.keyboard.press('Escape').catch(() => {})
    await page.locator('[role="dialog"]').waitFor({ state: 'hidden', timeout: timeouts.ui.modalClose }).catch(() => {})
    throw error // rethrow to avoid swallowing
  }
}

function isDateInVisibleRange(
  date: Date,
  minDate: Date,
  maxDate: Date,
): boolean {
  return date >= minDate && date <= maxDate
}

async function navigateCalendar(
  page: Page,
  currentMinDate: Date,
  direction: 'left' | 'right' = 'right',
) {
  const iconName = direction === 'left' ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'
  const navButton = page.getByRole('button', { name: iconName })

  await navButton.waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
  await navButton.click()

  try {
    await page.waitForFunction(
      (oldMin) => {
        const firstDatetime = document.querySelector('div[role="button"] time[datetime]')?.getAttribute('datetime')
        return firstDatetime && firstDatetime !== oldMin
      },
      currentMinDate.toISOString(),
      { timeout: timeouts.ui.elementVisible },
    )
  }
  catch {
    // Calendar didn't update, wait briefly and continue
    await page.locator('div[role="button"] time[datetime]').first().waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible }).catch(() => {})
  }
}

export async function findScheduleInCalendar(
  page: Page,
  criteria: { status?: string, date?: Date } = {},
): Promise<{ found: boolean, element?: Locator, reference?: { date: Date } }> {
  const maxAttempts = 12
  const scheduleEvents = page.locator(SCHEDULE_EVENT_SELECTOR)
  const hasCriteria = Object.keys(criteria).length > 0

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const sortedDates = await getDatesInRange(page)
    if (sortedDates.length === 0)
      break

    const [minDate, maxDate] = [sortedDates[0], sortedDates[sortedDates.length - 1]]
    const isInRange = !criteria.date || (minDate && maxDate && isDateInVisibleRange(criteria.date, minDate, maxDate))

    if (isInRange) {
      const eventCount = await scheduleEvents.count()

      for (let i = 0; i < eventCount; i++) {
        const currentEvent = scheduleEvents.nth(i)

        const matches = hasCriteria
          ? await checkEventMatchesCriteria(page, currentEvent, criteria)
          : true

        if (matches) {
          const datetimeAttr = await currentEvent.locator('time[datetime]').first().getAttribute('datetime')

          return {
            found: true,
            element: currentEvent,
            reference: { date: datetimeAttr ? new Date(datetimeAttr) : criteria.date || new Date() },
          }
        }
      }

      if (criteria.date)
        break
    }

    if (!minDate)
      break

    const direction = criteria.date && criteria.date < minDate ? 'left' : 'right'
    await navigateCalendar(page, minDate, direction)
  }

  return { found: false }
}

export async function clickScheduleEvent(page: Page, index: number = 0) {
  const scheduleEvents = page.locator(SCHEDULE_EVENT_SELECTOR)
  const eventCount = await scheduleEvents.count()

  if (eventCount === 0) {
    throw new Error('No schedule events found in calendar')
  }

  await scheduleEvents.nth(index).click()

  try {
    await page.getByRole('heading', { name: /schedule|event|edit/i })
      .or(page.getByRole('dialog'))
      .waitFor({ state: 'visible', timeout: timeouts.ui.elementVisible })
  }
  catch (error) {
    console.error('Failed to wait for schedule event dialog/heading:', error)
    throw new Error(`Schedule event dialog/heading did not appear after clicking event at index ${index}`, { cause: error })
  }
}

export async function updateScheduleStatus(page: Page, newStatus: 'Published' | 'Draft' | 'Archived') {
  const statusSelect = page.getByRole('combobox', { name: /status/i })
  const hasStatus = await statusSelect.isVisible().catch(() => false)

  if (hasStatus) {
    await statusSelect.click()
    await page.getByRole('option', { name: new RegExp(newStatus, 'i') }).click()
  }
}

export async function updateAndConfirmSchedule(page: Page) {
  const updateButton = page.getByRole('button', { name: /update|save/i })
  await expect(updateButton).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await updateButton.click()

  await expectToastMessage(page, /updated|success/i)
}

export async function verifyScheduleNotVisible(page: Page, reference: ScheduleReference) {
  const scheduleCards = page.locator('.card, [role="article"]')
  const cardCount = await scheduleCards.count()

  for (let i = 0; i < cardCount; i++) {
    const card = scheduleCards.nth(i)
    const text = await card.textContent()

    if (text && text.includes(reference.date) && text.includes(reference.time)) {
      throw new Error(`Schedule with date ${reference.date} and time ${reference.time} should not be visible`)
    }
  }
}

export async function captureScheduleDetails(page: Page): Promise<ScheduleReference> {
  const dateElement = page.getByRole('textbox', { name: 'Start Date' })
  const timeElement = page.getByRole('textbox', { name: 'Start Time' })
    .or(page.getByLabel(/start time/i))

  const hasDate = await dateElement.isVisible().catch(() => false)
  const hasTime = await timeElement.isVisible().catch(() => false)

  const date = hasDate ? await dateElement.inputValue().catch(() => '') : ''
  const time = hasTime ? await timeElement.inputValue().catch(() => '') : ''

  return { date, time }
}

export async function extractScheduleDatetimes(
  page: Page,
  cardSelector = '.card',
): Promise<Array<{ start: Date, end?: Date }>> {
  const cards = page.locator(cardSelector).filter({
    has: page.locator('time[datetime]'),
  })

  const cardCount = await cards.count()
  const datetimes: Array<{ start: Date, end?: Date }> = []

  for (let i = 0; i < cardCount; i++) {
    const timeElements = cards.nth(i).locator('time[datetime]')
    const timeCount = await timeElements.count()

    if (timeCount >= 1) {
      const startDatetimeAttr = await timeElements.nth(0).getAttribute('datetime')

      if (startDatetimeAttr) {
        const datetime: { start: Date, end?: Date } = {
          start: new Date(startDatetimeAttr),
        }

        if (timeCount > 1) {
          const endDatetimeAttr = await timeElements.nth(1).getAttribute('datetime')
          if (endDatetimeAttr) {
            datetime.end = new Date(endDatetimeAttr)
          }
        }

        datetimes.push(datetime)
      }
    }
  }

  return datetimes
}

export async function getDatesInRange(page: Page): Promise<Date[]> {
  const isoStrings = await page
    .locator('div[role="button"]:has(time[datetime])')
    .evaluateAll((divs) => {
      return divs
        .map(div => div.querySelector('time[datetime]')?.getAttribute('datetime'))
        .filter(Boolean)
        .sort() as string[]
    })

  return isoStrings.map(iso => new Date(iso))
}
