import fastify from 'fastify'
import cors from 'fastify-cors'
import Ajv from 'ajv'
import { db } from './routes'
import { disconnect } from './db/client'

export type BuildOption = {
  trustProxy?: boolean
  logger?: boolean
  bodyLimit?: number
  maxParamLength?: number
  enableCors?: boolean | string[]
}

export const build = ({ trustProxy = false, logger = false, bodyLimit = 50000, maxParamLength = 128, enableCors = false }: BuildOption = {}) => {
  const server = fastify({
    ignoreTrailingSlash: true,
    keepAliveTimeout: 10000,
    trustProxy,
    maxParamLength,
    bodyLimit,
    logger: logger && {
      level: 'info',
      prettyPrint: true,
    },
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
      origin: enableCors,
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
