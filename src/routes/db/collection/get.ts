import type { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import { Collection, Paging, Sort, Query, ApiKey } from '../../../schema'
import { parseAsObject } from '../../../util'
import { findAndSerializeByQuery } from '../../../db'

export const get: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Params: Collection; Querystring: Paging & Sort & Query; Headers: ApiKey }>(
    '/',
    {
      schema: { params: Collection, querystring: Type.Intersect([Paging, Sort, Query]), headers: ApiKey },
    },
    async (req, reply) => {
      const { skip, limit, sort: _sort, query: _query, mode } = req.query
      const { db, collection } = req.params
      const token = req.headers.authorization
      const apiKey = req.headers['x-api-key']
      const query = _query ? parseAsObject(_query) : {}
      if (query === null) {
        reply.code(400)
        throw new Error('QueryInvalid')
      }
      const sort = _sort ? parseAsObject(_sort) : {}
      if (sort === null) {
        reply.code(400)
        throw new Error('SortInvalid')
      }
      try {
        const documents = await findAndSerializeByQuery({ db, collection })({ skip, limit, sort, query, mode, token, apiKey })
        return { statusCode: 200, data: documents }
      } catch (e) {
        reply.code(401)
        throw e
      }
    }
  )
}
