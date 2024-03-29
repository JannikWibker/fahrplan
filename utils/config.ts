import { DAYS_OF_THE_WEEK, type DaysOfTheWeek } from '@/utils/date'

export const getConfig = () => {
  const settings = {
    // server only
    icalUrl: process.env.ICAL_URL,

    // client and server
    clampCurrentYear: process.env.NEXT_PUBLIC_DATE_RANGE_CLAMP_CURRENT_YEAR === 'true',
    clampStart: new Date(process.env.NEXT_PUBLIC_DATE_RANGE_CLAMP_START || ''),
    clampEnd: new Date(process.env.NEXT_PUBLIC_DATE_RANGE_CLAMP_END || ''),
    startOfWeek: process.env.NEXT_PUBLIC_START_OF_WEEK || 'monday'
  }

  if (!(DAYS_OF_THE_WEEK as unknown as string[]).includes(settings.startOfWeek)) {
    throw new Error(`Invalid start of week: ${settings.startOfWeek}`)
  }

  return {
    icalUrl: settings.icalUrl,
    clampCurrentYear: settings.clampCurrentYear,
    clampStart: Number.isNaN(settings.clampStart.getTime()) ? undefined : settings.clampStart,
    clampEnd: Number.isNaN(settings.clampEnd.getTime()) ? undefined : settings.clampEnd,
    startOfWeek: settings.startOfWeek as DaysOfTheWeek
  }
}

export const computeDateRangeClamp = (date = new Date()) => {
  const { clampCurrentYear, clampStart, clampEnd } = getConfig()

  if (clampCurrentYear) {
    return {
      min: new Date(date.getFullYear(), 0, 0),
      max: new Date(date.getFullYear(), 11, 31)
    }
  }

  if (clampStart === undefined || clampEnd === undefined) {
    return { min: undefined, max: undefined }
  } else {
    return { min: clampStart, max: clampEnd }
  }
}
