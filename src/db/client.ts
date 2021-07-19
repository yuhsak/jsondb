import { MongoClient } from 'mongodb'
import { DB_HOST, DB_PORT } from '../config'
import type { DB, Collection } from '../schema'

const uri = `mongodb://${DB_HOST}:${DB_PORT}`
const state: { client?: MongoClient } = {}

export const connect = async () => {
  if (!state.client) {
    state.client = await new MongoClient(uri).connect()
  }
  return state.client
}

export const disconnect = async () => {
  if (state.client) {
    return state.client.close()
  }
}

export const getDatabase = async ({ db }: DB) => {
  const client = await connect()
  return client.db(db)
}

export const getCollection = async ({ db, collection }: Collection) => {
  const database = await getDatabase({ db })
  return database.collection(collection)
}
