import { getCollection } from './client'
import type { DB } from '../schema'
import { JsondbError } from '../error'

export type Config = { apiKey?: string }

export const getOrCreateConfig =
  ({ db }: { db: string }) =>
  async ({ apiKey, create = true }: { apiKey?: string; create?: boolean }) => {
    const system = await getCollection({ db, collection: 'config' })
    const info = await system.findOne()
    const data = { ...(apiKey ? { apiKey } : {}) }
    if (!info && create) {
      await system.insertOne(data)
    }
    return (info || data) as Config
  }

export const ensureApiKey =
  (db: DB) =>
  async ({ apiKey, create }: { apiKey?: string; create?: boolean }) => {
    const systemInfo = await getOrCreateConfig(db)({ apiKey, create })
    if (systemInfo.apiKey && systemInfo.apiKey !== apiKey) {
      throw new JsondbError('ApiKeyInvalid')
    }
  }
