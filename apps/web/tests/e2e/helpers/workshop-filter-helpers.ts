import type { Locator, Page } from 'playwright'
import { workshopDateFilters } from '../constants'
import { escapeRegExp } from '../utils'
import { getVisibleCards, hasNoWorkshopsFound, waitForCardsToRefresh } from './card-helpers'

/**
 * Workshop Filter Helpers
 *
 * Helpers for testing workshop filtering functionality
 */

export function getDateBoundaries() {
  const today = new Date()
  const firstDayOfWeek = new Date(today)
  firstDayOfWeek.setDate(today.getDate() - today.getDay())
  const lastDayOfWeek = new Date(today)
  lastDayOfWeek.setDate(today.getDate() + (6 - today.getDay()))
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  return {
    today,
    firstDayOfWeek,
    lastDayOfWeek,
    firstDayOfMonth,
    lastDayOfMonth,
  }
}

type WorkshopDateFilter = typeof workshopDateFilters[number]
type WorkshopDateFilterName = WorkshopDateFilter['name']
type WorkshopDateFilterKey = WorkshopDateFilter['filterKey']

function toDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function checkIfToday(date: Date) {
  const { today } = getDateBoundaries()
  return toDateOnly(date).getTime() === toDateOnly(today).getTime()
}

export function checkIfThisWeek(date: Date) {
  const { firstDayOfWeek, lastDayOfWeek } = getDateBoundaries()
  const dateOnly = toDateOnly(date)
  return dateOnly >= toDateOnly(firstDayOfWeek) && dateOnly <= toDateOnly(lastDayOfWeek)
}

export function checkIfThisMonth(date: Date) {
  const { firstDayOfMonth, lastDayOfMonth } = getDateBoundaries()
  const dateOnly = toDateOnly(date)
  return dateOnly >= toDateOnly(firstDayOfMonth) && dateOnly <= toDateOnly(lastDayOfMonth)
}

export function parseWorkshopDates(times: string[]) {
  const monthMap: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  }

  if (times.length < 2) {
    throw new Error(`Expected at least 2 date strings, got ${times.length}`)
  }

  const extractDate = (dateTime: string) => {
    // Expected format: "Jan 15, 2026, 9:00 AM" or similar
    const regex = /^([A-Z][a-z]{2})\s+(\d{1,2}),\s+(\d{2,4})/
    const match = dateTime.match(regex)

    if (!match || !match[1] || !match[2] || !match[3]) {
      throw new Error(`Invalid date format: "${dateTime}". Expected format like "Jan 15, 2026"`)
    }

    const monthStr = match[1]
    const dayStr = match[2]
    const yearStr = match[3]

    const month = monthMap[monthStr]
    if (month === undefined) {
      throw new Error(`Invalid month: "${monthStr}"`)
    }

    const day = Number.parseInt(dayStr, 10)
    let year = Number.parseInt(yearStr, 10)

    // Handle 2-digit years
    if (year < 100) {
      year += 2000
    }

    return new Date(year, month, day)
  }

  return {
    workshopStartDate: extractDate(times[0]!),
    workshopEndDate: extractDate(times[1]!),
  }
}

export function validateFilterDates(
  filterType: WorkshopDateFilterName,
  filterName: string,
  workshopStartDate: Date,
  workshopEndDate: Date,
  startResults: Record<WorkshopDateFilterKey, boolean>,
  endResults: Record<WorkshopDateFilterKey, boolean>,
) {
  const key = workshopDateFilters.find(filter => filter.name === filterType)?.filterKey
  if (!key) {
    throw new Error(`Unknown filter type: ${filterType}`)
  }
  if (!(startResults[key] || endResults[key])) {
    throw new Error(`Card dates for "${filterName}" filter did NOT fall within ${filterType}. Start: ${workshopStartDate.toDateString()}, End: ${workshopEndDate.toDateString()}`)
  }
}

export function checkDateResults(date: Date) {
  return {
    today: checkIfToday(date),
    week: checkIfThisWeek(date),
    month: checkIfThisMonth(date),
  }
}

export async function processCards(
  page: Page,
  filterName: string,
  filterType: WorkshopDateFilterName | 'All',
) {
  if (await hasNoWorkshopsFound(page)) {
    return
  }

  // Wait for cards to be visible instead of arbitrary timeout
  await page.locator('.card.relative').first().waitFor({ state: 'visible', timeout: 5000 })

  if (await hasNoWorkshopsFound(page)) {
    return
  }

  const visibleCards = await getVisibleCards(page, '.card.relative')
  if (visibleCards.length === 0) {
    return
  }

  for (const card of visibleCards) {
    const times = await card.locator('p').locator('time').allInnerTexts()
    if (times.length < 2) {
      console.warn(`Skipping card with insufficient time elements (found ${times.length})`)
      continue
    }

    const { workshopStartDate, workshopEndDate } = parseWorkshopDates(times)
    const startResults = checkDateResults(workshopStartDate)
    const endResults = checkDateResults(workshopEndDate)

    if (filterType !== 'All') {
      validateFilterDates(filterType, filterName, workshopStartDate, workshopEndDate, startResults, endResults)
    }
  }
}

export async function applyFilterAndProcess(
  page: Page,
  filterButtonName: string,
  filterName: string,
  filterType: WorkshopDateFilterName | 'All',
) {
  await page.getByRole('radio', { name: filterButtonName }).click()
  await waitForCardsToRefresh(page, '.card.relative', 10000)
  try {
    await processCards(page, filterName, filterType)
  }
  finally {
    await page.getByRole('radio', { name: 'All', exact: true }).click()
    await waitForCardsToRefresh(page, '.card.relative', 10000)
  }
}

export async function validateModeFilter(page: Page, modeName: string, expectedText: string) {
  const checkbox = page.getByRole('checkbox', { name: modeName })
  await checkbox.check()

  await waitForCardsToRefresh(page, '.card.relative', 10000)

  if (await hasNoWorkshopsFound(page)) {
    await checkbox.uncheck()
    return
  }

  const visibleCards = await getVisibleCards(page, '.card.relative')
  if (visibleCards.length === 0) {
    await checkbox.uncheck()
    return
  }

  const regex = new RegExp(`^${escapeRegExp(expectedText)}$`, 'i')
  for (const [index, card] of visibleCards.entries()) {
    if (await card.locator('span').filter({ hasText: regex }).count() === 0) {
      throw new Error(`Card ${index + 1} does not contain the expected mode "${expectedText}" for "${modeName}" filter`)
    }
  }

  await checkbox.uncheck()
  await waitForCardsToRefresh(page, '.card.relative', 10000)
}

export async function searchWorkshop(page: Page, searchBox: Locator, query: string) {
  await searchBox.fill(query)
  await page.keyboard.press('Enter')
  await waitForCardsToRefresh(page, '.card.relative', 10000)
}
