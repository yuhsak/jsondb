import { ObjectId } from 'mongodb'
import type { Document } from 'mongodb'
import { getCollection } from './client'
import type { Collection } from '../schema'
import { serialize, createQuery } from '../util'
import { ensureApiKey } from './system'

const findOneBy =
  <Key extends string, V>(resolver: (query: Record<Key, V>) => Record<string, any>) =>
  (db: Collection) =>
  async ({ query, apiKey }: { query: Record<Key, V>; apiKey?: string }) => {
    await ensureApiKey(db)({ apiKey, create: false })
    const collection = await getCollection(db)
    const document = await collection.findOne(resolver(query))
    return document
  }

export const findOneById = findOneBy<'id', string | ObjectId>(({ id }) => ({ _id: new ObjectId(id) }))
export const findOneByToken = findOneBy<'token', string>(({ token }) => ({ _token: token }))
export const findOneByDataId = findOneBy<'id', string>(({ id }) => ({ 'data.id': id }))

const serialify = <T>(fn: (db: Collection) => (arg: T) => Promise<Document | undefined>) => {
  return (db: Collection) => (arg: T) => fn(db)(arg).then((doc) => doc && serialize(doc))
}

export const findAndSerializeOneById = serialify(findOneById)
export const findAndSerializeOneByToken = serialify(findOneByToken)
export const findAndSerializeOneByDataId = serialify(findOneByDataId)

export type FindParam = {
  skip: number
  limit: number
  sort?: any
  query?: any
  apiKey?: string
}

export const findByQuery =
  (db: Collection) =>
  async ({ skip, limit, sort, apiKey, query = {} }: FindParam) => {
    await ensureApiKey(db)({ apiKey, create: false })
    const collection = await getCollection(db)
    let cursor = collection.find(query)
    if (sort) {
      cursor = cursor.sort(sort)
    }
    cursor = cursor.skip(limit * skip).limit(limit)
    return cursor.maxTimeMS(1000 * 10).toArray()
  }

export const findAndSerializeByQuery = (db: Collection) => {
  const find = findByQuery(db)
  return async ({ skip, limit, sort: _sort, token: _token, apiKey, mode, query: _query = {} }: FindParam & { token?: string; mode: 'private' | 'public' | 'all' }) => {
    const _public = { _token: { $exists: false } }
    const modeQuery = mode === 'all' ? {} : mode === 'public' ? _public : _token ? { _token } : {}
    const sort = createQuery(_sort)
    const query = { ...createQuery(_query), ...modeQuery }
    return find({ skip, limit, sort, query, apiKey }).then((data) => data.map(serialize))
  }
}
