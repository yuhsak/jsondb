import type { FastifyPluginAsync } from 'fastify'
import { validateDb } from '../../hooks'
import { collection } from './collection'
import { auth } from './auth'

export const db: FastifyPluginAsync = async (fastify, opt) => {
  await validateDb(fastify, opt)
  fastify.register(auth, { prefix: '/auth' })
  fastify.register(collection, { prefix: '/:collection' })
}
