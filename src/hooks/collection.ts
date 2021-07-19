import type { FastifyPluginAsync } from 'fastify'
import { Collection } from '../schema'

export const invalidCollections = ['config', 'system', 'auth', 'token', 'meta', 'hook']

export const validateCollection: FastifyPluginAsync = async (fastify, opt) => {
  fastify.addHook<{ Params: Collection }>('onRequest', async (req, reply) => {
    const { collection } = req.params
    if (invalidCollections.includes(collection.toLowerCase())) {
      reply.code(404)
      throw new Error('CollectionNotFound')
    }
  })
}
