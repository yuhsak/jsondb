import { asInt } from './util'

/** DB */
export const DB_PROTOCOL = process.env.DB_PROTOCOL || 'mongodb'
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_PORT = asInt(process.env.DB_PORT) ?? 27017
export const DB_USERNAME = process.env.DB_USERNAME
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_AUTH_MECHANISM = process.env.DB_AUTH_MECHANISM
export const DB_CONNECTION_QUERY = process.env.DB_CONNECTION_QUERY

/** HTTP Server */
export const SERVER_HOST = process.env.SERVER_HOST || 'localhost'
export const SERVER_PORT = asInt(process.env.SERVER_PORT) ?? 8000
export const TRUST_PROXY = process.env.TRUST_PROXY === 'true'

/** CORS */
export const ENABLE_CORS = process.env.ENABLE_CORS === 'true'
export const CORS_ORIGIN = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['*']

/** Logger */
export const ENABLE_LOGGER = process.env.ENABLE_LOGGER === 'true'
export const LOGGER_LEVEL = process.env.LOGGER_LEVEL || 'info'
export const LOGGER_PRETTY_PRINT = process.env.LOGGER_PRETTY_PRINT === 'true'

/** Password Encryption */
export const AES_PASSWORD = process.env.AES_PASSWORD || 'password'
export const AES_SALT = process.env.AES_SALT || 'salt'

/** Input Limitation */
export const MAX_BODY_SIZE_KB = asInt(process.env.MAX_BODY_SIZE_KB) ?? 50
export const MAX_PARAM_LENGTH = asInt(process.env.MAX_PARAM_LENGTH) ?? 128
export const MAX_STRING_LENGTH = asInt(process.env.MAX_STRING_LENGTH) ?? 4096
export const MAX_ARRAY_LENGTH = asInt(process.env.MAX_ARRAY_LENGTH) ?? 1024
export const MIN_AUTH_ID_LENGTH = asInt(process.env.MIN_AUTH_ID_LENGTH) ?? 8
export const MAX_AUTH_ID_LENGTH = asInt(process.env.MAX_AUTH_ID_LENGTH) ?? 1024
export const MIN_AUTH_PASSWORD_LENGTH = asInt(process.env.MIN_AUTH_PASSWORD_LENGTH) ?? 8
export const MAX_AUTH_PASSWORD_LENGTH = asInt(process.env.MAX_AUTH_PASSWORD_LENGTH) ?? 1024
export const MIN_API_KEY_LENGTH = asInt(process.env.MIN_API_KEY_LENGTH) ?? 8
export const MAX_API_KEY_LENGTH = asInt(process.env.MAX_API_KEY_LENGTH) ?? 1024
export const MAX_BULK_CREATION_LENGTH = asInt(process.env.MAX_BULK_CREATION_LENGTH) ?? 100
export const MAX_QUERY_EXECUTION_SEC = asInt(process.env.MAX_QUERY_EXECUTION_SEC) ?? 10

/** Cleanup */
export const ENABLE_CLEANUP = process.env.ENABLE_CLEANUP === 'true'
export const CLEANUP_EXCLUDE_DB = process.env.CLEANUP_EXCLUDE_DB ? process.env.CLEANUP_EXCLUDE_DB.split(',') : []
export const CLEANUP_THRESHOLD = asInt(process.env.CLEANUP_THRESHOLD) ?? 1000 * 60 * 60 * 24 * 30

/** Rate Limit */
export const ENABLE_IP_RATE_LIMIT = process.env.ENABLE_IP_RATE_LIMIT === 'true'
export const IP_RATE_LIMIT_READ_THRESHOLD = asInt(process.env.IP_RATE_LIMIT_READ_THRESHOLD) ?? 10000
export const IP_RATE_LIMIT_READ_PER_MS = asInt(process.env.IP_RATE_LIMIT_READ_PER_MS) ?? 3600000
export const IP_RATE_LIMIT_WRITE_THRESHOLD = asInt(process.env.IP_RATE_LIMIT_WRITE_THRESHOLD) ?? 1000
export const IP_RATE_LIMIT_WRITE_PER_MS = asInt(process.env.IP_RATE_LIMIT_WRITE_PER_MS) ?? 3600000
export const IP_RATE_LIMIT_AUTH_THRESHOLD = asInt(process.env.IP_RATE_LIMIT_AUTH_THRESHOLD) ?? 100
export const IP_RATE_LIMIT_AUTH_PER_MS = asInt(process.env.IP_RATE_LIMIT_AUTH_PER_MS) ?? 3600000
