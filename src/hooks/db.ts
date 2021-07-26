import type { FastifyPluginAsync } from 'fastify'
import { DB } from '../schema'

export const prohibitedDbs = [
  'admin',
  'config',
  'local',
  'system',
  'root',
  'function',
  'cron',
  'hook',
  'worker',
  'user',
  'app',
  'apps',
  'application',
  'meta',
  'info',
  'information',
  'system',
  'setting',
  'global',
  'param',
  'util',
  'auth',
  'authentication',
  'token',
  'key',
  'account',
  'private',
  'userprivate',
  'item',
  'entity',
  'entities',
  'test',
  'sample',
  'permission',
  'log',
  'access',
  'rateLimit',
].flatMap((db) => [db, db + 's'])

export const validateDb: FastifyPluginAsync = async (fastify, opt) => {
  fastify.addHook<{ Params: DB }>('onRequest', async (req, reply) => {
    const { db } = req.params
    if (prohibitedDbs.includes(db.toLowerCase())) {
      reply.code(404)
      throw new Error('DBNotFound')
    }
  })
}
