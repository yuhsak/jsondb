import type { FastifyPluginAsync } from 'fastify'
import { validateCollection, validateGeneralRateLimit } from '../../../hooks'
import { get } from './get'
import { post } from './post'
import { delet_ } from './delete'
import { document } from './document'

export const collection: FastifyPluginAsync = async (fastify, opt) => {
  await validateCollection(fastify, opt)
  await validateGeneralRateLimit(fastify, opt)
  await get(fastify, opt)
  await post(fastify, opt)
  await delet_(fastify, opt)
  fastify.register(document, { prefix: '/:id' })
}
