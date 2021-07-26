import type { FastifyPluginAsync } from 'fastify'
import { deleteOneById } from '../../../../db'
import { Document, ApiKey } from '../../../../schema'

export const delet_: FastifyPluginAsync = async (fastify, opt) => {
  fastify.delete<{ Params: Document; Headers: ApiKey }>('/', { schema: { params: Document, headers: ApiKey } }, async (req, reply) => {
    const { db, collection, id } = req.params
    const token = req.headers.authorization
    const apiKey = req.headers['x-api-key']
    const data = await deleteOneById({ db, collection })({ id, token, apiKey })
    return { statusCode: 200, data }
  })
}
