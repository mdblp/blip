import WeekDays from './enum/weekdays.enum'

type WeekDaysFilter = {
  [key in WeekDays]: boolean
}

const defaultWeekDaysFilter: WeekDaysFilter = {
  [WeekDays.Monday]: true,
  [WeekDays.Tuesday]: true,
  [WeekDays.Wednesday]: true,
  [WeekDays.Thursday]: true,
  [WeekDays.Friday]: true,
  [WeekDays.Saturday]: true,
  [WeekDays.Sunday]: true
}

interface DateFilter {
  start: number
  end: number
  weekDays?: WeekDaysFilter
}

export default DateFilter
export { type WeekDaysFilter, defaultWeekDaysFilter }
