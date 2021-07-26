import type { FastifyPluginAsync } from 'fastify'
import { get } from './get'
import { put } from './put'
import { patch } from './patch'
import { delet_ } from './delete'
import { validateGeneralRateLimit } from '../../../../hooks'

export const document: FastifyPluginAsync = async (fastify, opt) => {
  await validateGeneralRateLimit(fastify, opt)
  await get(fastify, opt)
  await put(fastify, opt)
  await patch(fastify, opt)
  await delet_(fastify, opt)
}
