import { ObjectId } from 'mongodb'
import { getCollection } from './client'
import type { Collection } from '../schema'
import { findOneById } from './find'
import { ensureApiKey } from './config'
import { createQuery } from '../util'
import { JsondbError } from '../error'

export const deleteOneById =
  (db: Collection) =>
  async ({ id, token, apiKey }: { id: string; token?: string; apiKey?: string }) => {
    const collection = await getCollection(db)
    const document = await findOneById(db)({ query: { id }, apiKey })
    if (document && document._token && document._token !== token) {
      throw new JsondbError('TokenInvalid')
    }
    const { deletedCount } = await collection.deleteOne({ _id: new ObjectId(id) })
    return { count: deletedCount }
  }

export const deleteByQuery =
  (db: Collection) =>
  async ({ query: _query = {}, mode, token, apiKey }: { query?: any; mode: string; token?: string; apiKey?: string }) => {
    await ensureApiKey(db)({ apiKey })
    const collection = await getCollection(db)
    const _public = { _token: { $exists: false } }
    const _private = token ? { _token: token } : {}
    const _all = token ? { $or: [_public, _private] } : _public
    if (mode === 'private' && !token) {
      return { count: 0 }
    }
    const query = {
      ...createQuery(_query),
      ...(mode === 'public' ? _public : mode === 'all' ? _all : _private),
    }
    const { deletedCount } = await collection.deleteMany(query)
    return { count: deletedCount }
  }
