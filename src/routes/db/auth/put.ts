import type { FastifyPluginAsync } from 'fastify'
import { getOrInsertAuth } from '../../../db'
import { DB, Auth, ApiKey } from '../../../schema'

export const put: FastifyPluginAsync = async (fastify, opt) => {
  fastify.put<{ Params: DB; Body: Auth; Headers: ApiKey }>('/', { schema: { params: DB, body: Auth, headers: ApiKey } }, async (req, reply) => {
    const { db } = req.params
    const { id, password } = req.body
    const apiKey = req.headers['x-api-key']
    try {
      const data = await getOrInsertAuth({ db }, { id, password, apiKey })
      return { statusCode: 200, data }
    } catch (e) {
      reply.code(401)
      throw e
    }
  })
}
