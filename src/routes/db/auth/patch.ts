import type { FastifyPluginAsync } from 'fastify'
import { upsertAuthByToken } from '../../../db'
import { DB, AuthOption, ApiKey } from '../../../schema'
import { JsondbError } from '../../../error'

export const patch: FastifyPluginAsync = async (fastify, opt) => {
  fastify.patch<{ Params: DB; Body: AuthOption; Headers: ApiKey }>('/', { schema: { params: DB, body: AuthOption, headers: ApiKey } }, async (req, reply) => {
    const { db } = req.params
    const { id, password } = req.body
    const token = req.headers.authorization
    const apiKey = req.headers['x-api-key']
    if (!token) {
      throw new JsondbError('TokenNotSpecified')
    }
    const data = await upsertAuthByToken({ db }, { id, password, token, apiKey })
    return { statusCode: 200, data }
  })
}
