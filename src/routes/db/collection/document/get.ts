import type { FastifyPluginAsync } from 'fastify'
import { findAndSerializeOneById } from '../../../../db'
import { Document, ApiKey } from '../../../../schema'

export const get: FastifyPluginAsync = async (fastify, opt) => {
  fastify.get<{ Params: Document; Headers: ApiKey }>('/', { schema: { params: Document, headers: ApiKey } }, async (req, reply) => {
    const { db, collection, id } = req.params
    const apiKey = req.headers['x-api-key']
    try {
      const document = await findAndSerializeOneById({ db, collection })({ query: { id }, apiKey })
      if (!document) {
        throw new Error('IdNotFound')
      }
      return { statusCode: 200, data: document }
    } catch (e) {
      if (e.message === 'ApiKeyInvalid') {
        reply.code(401)
      } else {
        reply.code(404)
      }
      throw e
    }
  })
}
