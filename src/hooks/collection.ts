import type { FastifyPluginAsync } from 'fastify'
import { Collection } from '../schema'
import { JsondbError } from '../error'

export const prohibitedCollections = ['config', 'system', 'auth', 'permission', 'account', 'credential', 'token', 'meta', 'info', 'hook'].flatMap((c) => [c, c + 's'])

export const validateCollection: FastifyPluginAsync = async (fastify, opt) => {
  fastify.addHook<{ Params: Collection }>('onRequest', async (req, reply) => {
    const { collection } = req.params
    if (prohibitedCollections.includes(collection.toLowerCase()) || collection.toLowerCase().startsWith('system')) {
      throw new JsondbError('CollectionNotFound')
    }
  })
}
