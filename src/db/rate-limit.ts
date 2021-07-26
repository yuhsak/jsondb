import type { Collection, Document } from 'mongodb'
import { getCollection } from './client'
import {
  ENABLE_IP_RATE_LIMIT,
  IP_RATE_LIMIT_READ_PER_MS,
  IP_RATE_LIMIT_READ_THRESHOLD,
  IP_RATE_LIMIT_WRITE_PER_MS,
  IP_RATE_LIMIT_WRITE_THRESHOLD,
  IP_RATE_LIMIT_AUTH_PER_MS,
  IP_RATE_LIMIT_AUTH_THRESHOLD,
} from '../config'

const ensureIndex = async (collection: Collection<Document>) => {
  try {
    const indexExists = await collection.indexExists('index_ipAddress_asc')
    if (!indexExists) {
      collection.createIndex({ ipAddress: 1 }, { name: 'index_ipAddress_asc', background: true }).catch(() => {})
    }
  } catch (e) {}
}

export const getOrCreateRateLimit =
  ({ type, threshold, perMs }: { type: 'read' | 'write' | 'auth'; threshold: number; perMs: number }) =>
  async ({ ipAddress }: { ipAddress: string }) => {
    const log = await getCollection({ db: 'rateLimit', collection: type })
    const access = await log.findOne({ ipAddress })
    const now = new Date().getTime()
    const data = { ipAddress, since: now, n: 1 }
    if (!access) {
      await log.insertOne(data)
    } else if (now - access.since < perMs) {
      data.since = access.since
      data.n = access.n + 1
      if (access.n < threshold) {
        await log.updateOne({ _id: access._id }, { $set: { n: access.n + 1 } })
      }
    } else {
      data.since = now
      data.n = 1
      await log.updateOne({ _id: access._id }, { $set: { since: now, n: 1 } })
    }
    await ensureIndex(log)
    return data
  }

export const ensureRateLimit =
  ({ type }: { type: 'read' | 'write' | 'auth' }) =>
  async ({ ipAddress }: { ipAddress: string }) => {
    if (!ENABLE_IP_RATE_LIMIT) return
    const perMs = type === 'read' ? IP_RATE_LIMIT_READ_PER_MS : type === 'write' ? IP_RATE_LIMIT_WRITE_PER_MS : IP_RATE_LIMIT_AUTH_PER_MS
    const threshold = type === 'read' ? IP_RATE_LIMIT_READ_THRESHOLD : type === 'write' ? IP_RATE_LIMIT_WRITE_THRESHOLD : IP_RATE_LIMIT_AUTH_THRESHOLD
    const access = await getOrCreateRateLimit({ type, perMs, threshold })({ ipAddress })
    if (access.n > threshold) {
      throw new Error('RateLimitExceeded')
    }
  }
