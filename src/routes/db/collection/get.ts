import type { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import { Collection, Paging, Sort, Query, ApiKey } from '../../../schema'
import { parseAsObject } from '../../../util'
import { findAndSerializeByQuery } from '../../../db'
import { JsondbError } from '../../../error'

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
        throw new JsondbError('QueryInvalid')
      }
      const sort = _sort ? parseAsObject(_sort) : {}
      if (sort === null) {
        throw new JsondbError('SortInvalid')
      }
      const documents = await findAndSerializeByQuery({ db, collection })({ skip, limit, sort, query, mode, token, apiKey })
      return { statusCode: 200, data: documents }
    },
  )
}
