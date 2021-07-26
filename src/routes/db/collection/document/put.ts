import type { FastifyPluginAsync } from 'fastify'
import { upsertAndSerializeOneById } from '../../../../db'
import { Document, Data, ApiKey } from '../../../../schema'

export const put: FastifyPluginAsync = async (fastify, opt) => {
  fastify.put<{ Params: Document; Body: Data; Headers: ApiKey }>(
    '/',
    { schema: { params: Document, body: { ...Data, $comment: 'no-coerce' }, headers: ApiKey } },
    async (req, reply) => {
      const { db, collection, id } = req.params
      const data = req.body
      const token = req.headers.authorization
      const apiKey = req.headers['x-api-key']
      const document = await upsertAndSerializeOneById({ db, collection })({ data, id, token, apiKey, merge: false })
      return { statusCode: 200, data: document }
    },
  )
}
