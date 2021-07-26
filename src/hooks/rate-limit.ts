import type { FastifyPluginAsync } from 'fastify'
import { ensureRateLimit } from '../db/rate-limit'

const validateRateLimit =
  ({ type: _type }: { type: 'general' | 'auth' }): FastifyPluginAsync =>
  async (fastify, opt) => {
    fastify.addHook('onRequest', async (req, reply) => {
      const ipAddress = req.ip
      const type = _type === 'auth' ? 'auth' : req.method === 'GET' ? 'read' : 'write'
      try {
        await ensureRateLimit({ type })({ ipAddress })
      } catch (e) {
        reply.code(400)
        throw e
      }
    })
  }

export const validateGeneralRateLimit = validateRateLimit({ type: 'general' })
export const validateAuthRateLimit = validateRateLimit({ type: 'auth' })
