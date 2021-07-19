import type { Document } from 'mongodb'

export const isValidObjectId = (id: string) => /[a-z0-9]*/.test(id) && id.length === 24

export const serialize = (data: Document): Document => {
  return { ...data.data, _id: data._id, _createdAt: data._createdAt, _updatedAt: data._updatedAt }
}

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

export const deserialize = (input: any) => splitMeta(input).data

export const omitToken = (input: any) => {
  const { _token, ...rest } = input
  return rest
}

export const decorateKeyForData = (input: any) => Object.fromEntries(Object.entries(input).map(([k, v]) => [`data.${k}`, v]))

export const createQuery = (input: any) => {
  const v = splitMeta(input)
  return { ...decorateKeyForData(v.data), ...omitToken(v.meta) }
}
