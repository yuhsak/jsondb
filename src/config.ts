import { asInt } from './util'

export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_PORT = asInt(process.env.DB_PORT) ?? 27017
export const SERVER_HOST = process.env.SERVER_HOST || 'localhost'
export const SERVER_PORT = asInt(process.env.SERVER_PORT) ?? 8000
export const AES_PASSWORD = process.env.AES_PASSWORD || 'password'
export const AES_SALT = process.env.AES_SALT || 'salt'
export const TRUST_PROXY = process.env.TRUST_PROXY === 'true'
export const LOGGER = process.env.LOGGER === 'true'
export const BODY_LIMIT = asInt(process.env.BODY_LIMIT) ?? 50000
export const MAX_PARAM_LENGTH = asInt(process.env.MAX_PARAM_LENGTH) ?? 128
export const ENABLE_CORS = process.env.ENABLE_CORS ? process.env.ENABLE_CORS === 'true' || (process.env.ENABLE_CORS !== 'false' && process.env.ENABLE_CORS?.split(',')) : false
