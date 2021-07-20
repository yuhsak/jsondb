import { ObjectId } from 'mongodb'
import type { Collection as MongoCollection, Document } from 'mongodb'
import { getCollection } from './client'
import type { Collection } from '../schema'
import { serialize, omitMeta, splitMeta, decorateKeyForData } from '../util'
import { findOneById } from './find'
import { ensureApiKey } from './config'

const ensureIndex = async (collection: MongoCollection<Document>) => {
  try {
    const indexExists = await collection.indexExists('index_token_asc')
    if (!indexExists) {
      collection.createIndex({ _token: 1 }, { name: 'index_token_asc', background: true }).catch(() => {})
      collection.createIndex({ _createdAt: 1 }, { name: 'index_createdAt_asc', background: true }).catch(() => {})
      collection.createIndex({ _updatedAt: 1 }, { name: 'index_updatedAt_asc', background: true }).catch(() => {})
    }
  } catch (e) {}
}

export const insertOne =
  (db: Collection) =>
  async ({ data: _data, token: _token, apiKey }: { data: any; token?: string; apiKey?: string }) => {
    const collection = await getCollection(db)
    const now = new Date().getTime()
    const data = { data: omitMeta(_data), _createdAt: now, _updatedAt: now, ...(_token ? { _token } : {}) }
    await ensureApiKey(db)({ apiKey })
    const { insertedId: _id } = await collection.insertOne(data)
    ensureIndex(collection)
    const document = { _id, ...data }
    return document
  }

export const insertAndSerializeOne = (db: Collection) => async (input: { data: any; token?: string; apiKey?: string }) => insertOne(db)(input).then(serialize)

export const upsertOneById = (db: Collection) => {
  const findOne = findOneById(db)
  return async ({ data: _data, id, token: _token, apiKey, merge = false }: { data: any; id: string | ObjectId; apiKey?: string; token?: string; merge?: boolean }) => {
    const collection = await getCollection(db)
    const now = new Date().getTime()
    const document = await findOne({ query: { id }, apiKey })
    if (document && document._token && document._token !== _token) {
      throw new Error('TokenInvalid')
    }
    const filter = { _id: new ObjectId(id) }
    const data = {
      ...filter,
      data: omitMeta(_data),
      _createdAt: now,
      _updatedAt: now,
      ...(_token ? { _token } : {}),
    }
    if (document) {
      data._createdAt = document._createdAt
      if (!document._token) {
        delete data._token
      }
    }
    await ensureApiKey(db)({ apiKey })
    if (!merge) {
      await collection.replaceOne(filter, data, { upsert: true })
    } else {
      const s = splitMeta(data)
      await collection.updateOne(filter, { $set: { ...s.meta, ...decorateKeyForData(s.data.data) } }, { upsert: true })
    }
    const upserted = await findOne({ query: { id: filter._id }, apiKey })
    if (!upserted) {
      throw new Error('InsertFailed')
    }
    ensureIndex(collection)
    return upserted
  }
}

export const upsertAndSerializeOneById = (db: Collection) => async (input: { data: any; id: string | ObjectId; apiKey?: string; token?: string; merge?: boolean }) =>
  upsertOneById(db)(input).then(serialize)
