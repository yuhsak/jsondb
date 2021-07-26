import type { FastifyPluginAsync } from 'fastify'
import { Collection, SingleOrMultipleData, ApiKey } from '../../../schema'
import { insertAndSerializeOne } from '../../../db'

export const post: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Params: Collection; Body: SingleOrMultipleData; Headers: ApiKey }>(
    '/',
    { schema: { params: Collection, body: { ...SingleOrMultipleData, $comment: 'no-coerce' }, headers: ApiKey } },
    async (req, reply) => {
      const { db, collection } = req.params
      const data = req.body
      const token = req.headers.authorization
      const apiKey = req.headers['x-api-key']
      const insert = insertAndSerializeOne({ db, collection })
      if (Array.isArray(data)) {
        const documents = await Promise.all(data.map((data) => insert({ data, token, apiKey })))
        return { statusCode: 200, data: documents }
      }
      const document = await insert({ data, token, apiKey })
      return { statusCode: 200, data: document }
    },
  )
}
