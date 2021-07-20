import fastify from 'fastify'
import cors from 'fastify-cors'
import Ajv from 'ajv'
import { db } from './routes'
import { disconnect } from './db/client'

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

  server.addHook('onClose', disconnect)

  return server
}
