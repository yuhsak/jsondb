import type { FastifyPluginAsync } from 'fastify'
import { findAndSerializeOneById } from '../../../../db'
import { Document, ApiKey } from '../../../../schema'
import { JsondbError } from '../../../../error'

export const get: FastifyPluginAsync = async (fastify, opt) => {
  fastify.get<{ Params: Document; Headers: ApiKey }>('/', { schema: { params: Document, headers: ApiKey } }, async (req, reply) => {
    const { db, collection, id } = req.params
    const apiKey = req.headers['x-api-key']
    const document = await findAndSerializeOneById({ db, collection })({ query: { id }, apiKey })
    if (!document) {
      throw new JsondbError('DocumentNotFound')
    }
    return { statusCode: 200, data: document }
  })
}
