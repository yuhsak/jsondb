import type { Collection as MongoCollection, Document } from 'mongodb'
import { getCollection } from './client'
import { createCipher, generateId } from '../util'
import { AES_PASSWORD, AES_SALT } from '../config'
import { findOneByToken, findOneByDataId } from './find'
import { insertOne } from './insert'
import { ensureApiKey } from './config'

const { encrypt } = createCipher(AES_PASSWORD, AES_SALT)

const ensureIndex = async (collection: MongoCollection<Document>) => {
  try {
    const indexExists = await collection.indexExists('unique_token_asc')
    if (!indexExists) {
      collection.createIndex({ _token: 1 }, { name: 'unique_token_asc', unique: true, background: true }).catch(() => {})
      collection.createIndex({ _createdAt: 1 }, { name: 'index_createdAt_asc', background: true }).catch(() => {})
      collection.createIndex({ _updatedAt: 1 }, { name: 'index_updatedAt_asc', background: true }).catch(() => {})
      collection.createIndex({ 'data.id': 1 }, { name: 'unique_data-id_asc', unique: true, background: true }).catch(() => {})
    }
  } catch (e) {}
}

export const getOrInsertAuth = async ({ db }: { db: string }, { id, password, apiKey }: { id: string; password: string; apiKey?: string }) => {
  const collection = await getCollection({ db, collection: 'auth' })
  const document = await findOneByDataId({ db, collection: 'auth' })({ query: { id }, apiKey })
  if (!document) {
    const token = generateId(32)
    const data = { id, password: encrypt(password) }
    await insertOne({ db, collection: 'auth' })({ data, token, apiKey })
    await ensureIndex(collection)
    return { token }
  }
  if (document.data.password !== encrypt(password)) {
    throw new Error('PasswordInvalid')
  }
  const { _token } = document
  return { token: _token as string }
}

export const upsertAuthByToken = async ({ db }: { db: string }, { id, password, apiKey, token }: { id?: string; password?: string; apiKey?: string; token: string }) => {
  const collection = await getCollection({ db, collection: 'auth' })
  const document = await findOneByToken({ db, collection: 'auth' })({ query: { token }, apiKey })
  const _updatedAt = new Date().getTime()
  if (!document) {
    if (!id) {
      throw new Error('IdNotSpecified')
    }
    if (!password) {
      throw new Error('PasswordNotSpecified')
    }
    try {
      await insertOne({ db, collection: 'auth' })({ data: { id, password: encrypt(password) }, token, apiKey })
    } catch (e) {
      if (e.code === 11000) {
        throw new Error('IdDuplicated')
      }
      throw e
    }
    await ensureIndex(collection)
    return { token }
  }
  await ensureApiKey({ db })({ apiKey })
  try {
    await collection.updateOne(
      { _token: token },
      {
        $set: {
          ...(id ? { 'data.id': id } : {}),
          ...(password ? { 'data.password': encrypt(password) } : {}),
          _updatedAt,
        },
      },
    )
  } catch (e) {
    if (e.code === 11000) {
      throw new Error('IdDuplicated')
    }
    throw e
  }
  return { token }
}
