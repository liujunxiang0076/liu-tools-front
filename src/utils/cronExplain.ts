export type CronFieldType = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'week'

type ParsedFieldToken =
  | { kind: 'any' }
  | { kind: 'value'; value: string }
  | { kind: 'list'; values: string[] }
  | { kind: 'range'; start: string; end: string }
  | { kind: 'step'; start: string; step: string }
  | { kind: 'range-step'; start: string; end: string; step: string }

const unitMap: Record<CronFieldType, string> = {
  second: '秒',
  minute: '分钟',
  hour: '小时',
  day: '日',
  month: '月',
  week: '周'
}

const weekNameMap: Record<string, string> = {
  '0': '周日',
  '1': '周一',
  '2': '周二',
  '3': '周三',
  '4': '周四',
  '5': '周五',
  '6': '周六',
  '7': '周日'
}

const toWeekName = (value: string): string => {
  return weekNameMap[value] || `周${value}`
}

const isWorkdaySet = (weekValues: string[]): boolean => {
  const normalized = new Set(
    weekValues.map((value) => (value === '7' ? '0' : value))
  )

  if (normalized.size !== 5) {
    return false
  }

  return ['1', '2', '3', '4', '5'].every((value) => normalized.has(value))
}

export const parseFieldToken = (value: string, _fieldType: CronFieldType): ParsedFieldToken => {
  const token = value.trim()

  if (token === '*') {
    return { kind: 'any' }
  }

  if (token.includes(',')) {
    return {
      kind: 'list',
      values: token
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }

  if (token.includes('/')) {
    const [left, step] = token.split('/')
    if (left?.includes('-')) {
      const [start, end] = left.split('-')
      return { kind: 'range-step', start, end, step }
    }

    return { kind: 'step', start: left || '*', step }
  }

  if (token.includes('-')) {
    const [start, end] = token.split('-')
    return { kind: 'range', start, end }
  }

  return { kind: 'value', value: token }
}

export const describeField = (parsed: ParsedFieldToken, fieldType: CronFieldType): string => {
  const unit = unitMap[fieldType]

  if (fieldType === 'week') {
    if (parsed.kind === 'any') {
      return '每天'
    }

    if (parsed.kind === 'value') {
      return toWeekName(parsed.value)
    }

    if (parsed.kind === 'list') {
      if (isWorkdaySet(parsed.values)) {
        return '工作日'
      }

      return parsed.values.map(toWeekName).join('、')
    }

    if (parsed.kind === 'range') {
      if (parsed.start === '1' && parsed.end === '5') {
        return '工作日'
      }

      return `${toWeekName(parsed.start)}至${toWeekName(parsed.end)}`
    }

    if (parsed.kind === 'step') {
      if (parsed.start === '*') {
        return `每${parsed.step}天`
      }

      return `从${toWeekName(parsed.start)}开始每${parsed.step}天`
    }

    return `${toWeekName(parsed.start)}至${toWeekName(parsed.end)}每${parsed.step}天`
  }

  if (parsed.kind === 'any') {
    return `每${unit}`
  }

  if (parsed.kind === 'value') {
    if (fieldType === 'hour') {
      return `${parsed.value}点`
    }

    if (fieldType === 'day') {
      return `每月${parsed.value}日`
    }

    if (fieldType === 'month') {
      return `${parsed.value}月`
    }

    return `第${parsed.value}${unit}`
  }

  if (parsed.kind === 'list') {
    if (fieldType === 'day') {
      return `每月${parsed.values.join('、')}日`
    }

    if (fieldType === 'month') {
      return `${parsed.values.join('、')}月`
    }

    if (fieldType === 'hour') {
      return `${parsed.values.join('、')}点`
    }

    return `${parsed.values.join('、')}${unit}`
  }

  if (parsed.kind === 'range') {
    if (fieldType === 'day') {
      return `每月${parsed.start}-${parsed.end}日`
    }

    if (fieldType === 'month') {
      return `${parsed.start}-${parsed.end}月`
    }

    if (fieldType === 'hour') {
      return `${parsed.start}-${parsed.end}点`
    }

    return `${parsed.start}-${parsed.end}${unit}`
  }

  if (parsed.kind === 'step') {
    const prefix = parsed.start === '*' ? '每' : `从${parsed.start}${unit}开始每`

    if (fieldType === 'day') {
      return `${prefix}${parsed.step}日`
    }

    return `${prefix}${parsed.step}${unit}`
  }

  const rangeText = `${parsed.start}-${parsed.end}`
  const prefix = fieldType === 'day' ? `每月${rangeText}` : `${rangeText}`
  return `${prefix}${unit}每${parsed.step}${unit}`
}

export const describeCronExpression = (fields: string[]): string => {
  if (fields.length !== 6) {
    return '请配置执行时间'
  }

  const fieldTypes: CronFieldType[] = ['second', 'minute', 'hour', 'day', 'month', 'week']

  const segments = fields
    .map((value, index) => describeField(parseFieldToken(value, fieldTypes[index]), fieldTypes[index]))
    .filter(Boolean)

  return segments.length > 0 ? `${segments.join('，')}执行` : '请配置执行时间'
}
