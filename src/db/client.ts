import { MongoClient } from 'mongodb'
import { DB_PROTOCOL, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_AUTH_MECHANISM, DB_CONNECTION_QUERY } from '../config'
import type { DB, Collection } from '../schema'
import { buildUri } from '../util/db'

const uri = buildUri({
  protocol: DB_PROTOCOL,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  authMechanism: DB_AUTH_MECHANISM,
  connectionQuery: DB_CONNECTION_QUERY,
})

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
