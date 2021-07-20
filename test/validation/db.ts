import tap from 'tap'
import type { HTTPMethods } from 'fastify'
import { build } from '../../src/server'
import { prohibitedDbs } from '../../src/hooks'

const server = build()

prohibitedDbs.forEach((db) =>
  (['GET', 'POST'] as HTTPMethods[]).forEach((method) =>
    tap.test(`${method} /${db}/:collection responds with 404`, async (t) => {
      const res = await server.inject({
        method,
        path: `/${db}/collection`,
      })
      t.equal(res.statusCode, 404)
      t.equal(JSON.parse(res.body).message, 'DBNotFound')
    }),
  ),
)

prohibitedDbs.forEach((db) =>
  (['GET', 'PUT', 'PATCH', 'DELETE'] as HTTPMethods[]).forEach((method) =>
    tap.test(`${method} /${db}/:collection/:id responds with 404`, async (t) => {
      const res = await server.inject({
        method,
        path: `/${db}/collection/ffffffffffffffffffffffff`,
      })
      t.equal(res.statusCode, 404)
      t.equal(JSON.parse(res.body).message, 'DBNotFound')
    }),
  ),
)
