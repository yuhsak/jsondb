import type { FastifyPluginAsync } from 'fastify'
import { DB } from '../schema'

export const invalidDbs = [
  'admin',
  'config',
  'local',
  'system',
  'root',
  'function',
  'functions',
  'cron',
  'crons',
  'hook',
  'hooks',
  'worker',
  'workers',
  'user',
  'users',
  'app',
  'apps',
  'application',
  'applications',
  'meta',
  'info',
  'information',
  'system',
  'setting',
  'global',
  'param',
  'params',
  'util',
  'utils',
  'auth',
  'auths',
  'authentication',
  'authentications',
  'token',
  'tokens',
  'key',
  'keys',
  'account',
  'accounts',
  'private',
  'privates',
  'userprivate',
  'userprivates',
  'item',
  'items',
  'entity',
  'entities',
  'test',
  'tests',
  'sample',
  'samples',
]

export const validateDb: FastifyPluginAsync = async (fastify, opt) => {
  fastify.addHook<{ Params: DB }>('onRequest', async (req, reply) => {
    const { db } = req.params
    if (invalidDbs.includes(db.toLowerCase())) {
      reply.code(404)
      throw new Error('DBNotFound')
    }
  })
}
