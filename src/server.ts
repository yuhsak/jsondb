import fastify from 'fastify'
import cors from 'fastify-cors'
import Ajv from 'ajv'
import { db } from './routes'
import { disconnect } from './db/client'
import { JsondbError } from './error'
import type { JsondbErrorCode } from './error'

const errorMap: Record<JsondbErrorCode, number> = {
  Unknown: 500,
  DatabaseInvalid: 400,
  CollectionInvalid: 400,
  DocumentIdInvalid: 400,
  RequestBodyInvalid: 400,
  QuerystringInvalid: 400,
  QueryInvalid: 400,
  SortInvalid: 400,
  HeadersInvalid: 400,
  DatabaseNotFound: 404,
  CollectionNotFound: 404,
  DocumentNotFound: 404,
  ApiKeyInvalid: 401,
  TokenInvalid: 401,
  PasswordInvalid: 401,
  IdNotSpecified: 400,
  PasswordNotSpecified: 400,
  TokenNotSpecified: 400,
  IdDuplicated: 400,
  RateLimitExceeded: 403,
  InsertFailed: 500,
}

export type BuildOption = {
  trustProxy?: boolean
  bodyLimit?: number
  maxParamLength?: number
  enableCors?: boolean
  corsOrigin?: string[]
  enableLogger?: boolean
  loggerLevel?: string
  loggerPrettyPrint?: boolean
}

export const build = ({
  trustProxy = false,
  bodyLimit = 50000,
  maxParamLength = 128,
  enableCors = false,
  corsOrigin = ['*'],
  enableLogger = false,
  loggerLevel = 'info',
  loggerPrettyPrint = false,
}: BuildOption = {}) => {
  const server = fastify({
    ignoreTrailingSlash: true,
    keepAliveTimeout: 10000,
    trustProxy,
    maxParamLength,
    bodyLimit,
    logger: enableLogger
      ? {
          level: loggerLevel,
          prettyPrint: loggerPrettyPrint,
        }
      : false,
  })

  const compiler = (coerceTypes: boolean) =>
    new Ajv({
      coerceTypes,
      useDefaults: true,
      removeAdditional: true,
      nullable: true,
    })

  server.setValidatorCompiler(({ schema }) => {
    // @ts-ignore
    const { $comment, ...rest } = schema
    return compiler($comment !== 'no-coerce').compile(rest)
  })

  server.get('/', async (req, reply) => {
    return { statusCode: 200, message: 'working' }
  })
  server.register(db, { prefix: '/:db' })

  if (enableCors) {
    server.register(cors, {
      origin: corsOrigin.some((origin) => ['*'].includes(origin)) || corsOrigin,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    })
  }

  server.addHook('onRequest', (req, reply, done) => {
    req.headers.authorization = req.headers.authorization?.replace(/^Bearer /, '')
    done()
  })

  server.setSchemaErrorFormatter((errors, dataVar) => {
    if (dataVar === 'body') {
      return new JsondbError('RequestBodyInvalid', errors.map((e) => `body ${e.message}`).join(', '))
    }
    const code =
      dataVar === 'params'
        ? errors[0].dataPath === '.db'
          ? 'DatabaseInvalid'
          : errors[0].dataPath === '.collection'
          ? 'CollectionInvalid'
          : 'DocumentIdInvalid'
        : dataVar === 'querystring'
        ? 'QuerystringInvalid'
        : 'HeadersInvalid'
    return new JsondbError(code, errors.map((e) => `${dataVar}${e.dataPath} ${e.message}`).join(', '))
  })

  server.setErrorHandler(async (error, req, reply) => {
    if (error instanceof JsondbError) {
      const status = errorMap[error.code]
      reply.code(status)
      return { statusCode: status, code: error.code, message: error.message }
    }
    throw error
  })

  server.addHook('onClose', disconnect)

  return server
}
