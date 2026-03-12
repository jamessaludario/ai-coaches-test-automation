import type { Page } from 'playwright'
import { sharedAdminSelectors, timeouts } from '../constants'
import { expect } from '@playwright/test'
import { escapeRegExp } from './date.helper'

export async function waitForDataTableLoad(page: Page, searchQuery?: string) {
  const table = page.getByRole('table')
  await table.waitFor({ state: 'visible', timeout: timeouts.api.dataTableLoad })
  if (searchQuery) {
    await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: timeouts.api.dataTableLoad })
  }
}

export async function searchDataTable(page: Page, query: string) {
  const searchInput = page.getByRole('textbox', { name: sharedAdminSelectors.dataTable.searchInput })
  await searchInput.fill(query)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(timeouts.wait.medium)
}

export async function getFirstDataTableCellText(page: Page, columnIndex: number): Promise<string | null> {
  const emptyRow = page.getByRole('heading', { name: /No bookings found/i })
  if (await emptyRow.isVisible()) return null
  const firstRow = page.locator('tbody tr').first()
  const cell = firstRow.locator('td').nth(columnIndex)
  return await cell.textContent()
}

export async function clickRowAction(
  page: Page,
  identifier: string | RegExp,
  action: 'view' | 'edit' | 'delete' | 'manage',
) {
  const row = page.getByRole('row').filter({ hasText: identifier })
  const actionButton = row.getByRole('button').first()
  await actionButton.click()

  const menuItem = page.getByRole('menuitem', { name: new RegExp(action, 'i') })
  const isMenuItem = await menuItem.isVisible().catch(() => false)
  if (isMenuItem) {
    await menuItem.click()
  }
}

export async function clickRowLink(page: Page, identifier: string | RegExp) {
  const link = page.getByRole('link', { name: identifier }).first()
  await link.click()
}

export async function getTableRowCount(page: Page): Promise<number> {
  return await page.locator('tbody tr').count()
}

export async function goToPage(page: Page, pageNumber: number) {
  const pageButton = page.getByRole('button', { name: String(pageNumber) })
  await pageButton.click()
  await page.waitForTimeout(timeouts.wait.medium)
}

export async function sortByColumn(page: Page, columnName: string) {
  const header = page.getByRole('columnheader', { name: columnName })
  await header.click()
  await page.waitForTimeout(timeouts.wait.medium)
}

export async function isTableEmpty(page: Page): Promise<boolean> {
  const rowCount = await page.locator('tbody tr').count()
  return rowCount === 0
}

export async function navigateToFirstTableRow(
  page: Page,
  urlPattern: string | RegExp,
): Promise<string | null> {
  const dataTable = page.getByRole('table')
  const hasTable = await dataTable.isVisible().catch(() => false)
  if (!hasTable) return null

  const rows = dataTable.locator('tbody tr')
  const rowCount = await rows.count()
  if (rowCount === 0) return null

  const firstRowText = await getFirstDataTableCellText(page, 1)
  if (!firstRowText) throw new Error('No row text found')

  await page.getByRole('link', { name: new RegExp(escapeRegExp(firstRowText), 'i') }).first().click()
  await page.waitForURL(urlPattern, { timeout: timeouts.page.navigation })

  const url = page.url()
  const match = url.match(urlPattern)
  return match?.[1] ?? null
}

export async function clickFirstTableRowAction(
  page: Page,
  actionName: 'view' | 'edit' | 'delete' | 'manage',
  urlPattern: string | RegExp,
): Promise<string | null> {
  const firstRowText = await getFirstDataTableCellText(page, 1)
  if (!firstRowText) throw new Error('No row text found')

  await clickRowAction(page, new RegExp(escapeRegExp(firstRowText), 'i'), actionName)
  await page.waitForURL(urlPattern, { timeout: timeouts.page.navigation })

  const url = page.url()
  const match = url.match(urlPattern)
  return match?.[1] ?? null
}
