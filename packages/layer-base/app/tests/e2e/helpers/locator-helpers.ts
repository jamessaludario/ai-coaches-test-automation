import type { Locator } from 'playwright'

export async function selectFirstIfMultiple(locator: Locator): Promise<Locator> {
  const count = await locator.count()
  return count > 1 ? locator.first() : locator
}
