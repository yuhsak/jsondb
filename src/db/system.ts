import { getCollection } from './client'
import type { DB } from '../schema'

export type SystemInfo = { apiKey?: string }

export const getOrCreateSystemInfo =
  ({ db }: { db: string }) =>
  async ({ apiKey, create = true }: { apiKey?: string; create?: boolean }) => {
    const system = await getCollection({ db, collection: 'system' })
    const info = await system.findOne()
    const data = { ...(apiKey ? { apiKey } : {}) }
    if (!info && create) {
      await system.insertOne(data)
    }
    return (info || data) as SystemInfo
  }

export const ensureApiKey =
  (db: DB) =>
  async ({ apiKey, create }: { apiKey?: string; create?: boolean }) => {
    const systemInfo = await getOrCreateSystemInfo(db)({ apiKey, create })
    if (systemInfo.apiKey && systemInfo.apiKey !== apiKey) {
      throw new Error('ApiKeyInvalid')
    }
  }
