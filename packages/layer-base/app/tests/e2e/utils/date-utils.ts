export function getTimestamp(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}${month}${day}_${hours}${minutes}${seconds}`
}

export function getMonthYear(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function getFutureDate(daysFromNow: number): Date {
  return addDays(new Date(), daysFromNow)
}

export function getPastDate(daysAgo: number): Date {
  return subtractDays(new Date(), daysAgo)
}

export function addDays(date: Date, days: number): Date {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

export function subtractDays(date: Date, days: number): Date {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() - days)
  return newDate
}

export function formatDateToISO(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function setTime(date: Date, hours: number, minutes: number = 0): Date {
  const newDate = new Date(date)
  newDate.setHours(hours, minutes, 0, 0)
  return newDate
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDisplayTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export interface ScheduleDatetime {
  start: Date
  end?: Date
}

export function validateScheduleDatetime(
  datetime: ScheduleDatetime,
  now: Date = new Date(),
): { valid: boolean, errors: string[] } {
  const errors: string[] = []

  if (datetime.start.getTime() < now.getTime()) {
    errors.push(`Start time ${datetime.start.toISOString()} is in the past`)
  }

  if (datetime.end && datetime.end.getTime() <= datetime.start.getTime()) {
    errors.push(`End time ${datetime.end.toISOString()} is before or equal to start time`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
