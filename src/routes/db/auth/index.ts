import type { FastifyPluginAsync } from 'fastify'
import { put } from './put'
import { patch } from './patch'
import { validateAuthRateLimit } from '../../../hooks'

export const auth: FastifyPluginAsync = async (fastify, opt) => {
  fastify.all('/:id', async (req, reply) => {
    reply.code(404)
    throw new Error('CollectionNotFound')
  })
  await validateAuthRateLimit(fastify, opt)
  await put(fastify, opt)
  await patch(fastify, opt)
}
