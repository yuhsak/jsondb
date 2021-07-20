import type { Document } from 'mongodb'

export type BuildUriParam = {
  protocol: string
  host: string
  port: number
  authMechanism?: string
  username?: string
  password?: string
  connectionQuery?: string
}

export const buildUri = ({ protocol, host, port, authMechanism, username, password, connectionQuery }: BuildUriParam) => {
  const auth = username && password ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` : username ? `${encodeURIComponent(username)}@` : ''
  const url = `${host}:${port}`
  const query = [authMechanism && `authMechanism=${authMechanism}`, connectionQuery].filter((item): item is string => !!item).join('&')
  return `${protocol}://${auth}${url}${query ? `/?${query}` : ''}`
}

export const isValidObjectId = (id: string) => /[a-z0-9]*/.test(id) && id.length === 24

export const splitMeta = (input: any) => {
  const { _createdAt, _updatedAt, _id, _token, ...data } = input
  return {
    data,
    meta: {
      ...(_createdAt ? { _createdAt } : {}),
      ...(_updatedAt ? { _updatedAt } : {}),
      ...(_id ? { _id } : {}),
      ...(_token ? { _token } : {}),
    },
  }
}

export const omitToken = (input: any) => {
  const { _token, ...rest } = input
  return rest
}

export const omitMeta = (input: any) => splitMeta(input).data

export const serialize = (data: Document): Document => {
  const d = splitMeta(data)
  return { ...d.data.data, ...omitToken(d.meta) }
}

export const decorateKeyForData = (input: any) => Object.fromEntries(Object.entries(input).map(([k, v]) => [`data.${k}`, v]))

export const createQuery = (input: any) => {
  const v = splitMeta(input)
  return { ...decorateKeyForData(v.data), ...omitToken(v.meta) }
}
