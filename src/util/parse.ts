import { isObject } from 'what-is-that'

export const asInt = (value?: string) => {
  if (value === void 0) return null
  const n = parseInt(value)
  return isNaN(n) ? null : n
}

export const parseAsObject = (value: string) => {
  try {
    const data = JSON.parse(value)
    if (!isObject(data)) {
      return null
    }
    return data
  } catch (e) {
    return null
  }
}
