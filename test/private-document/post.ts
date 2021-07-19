import tap from 'tap'
import { build } from '../../src/server'

tap.test('POST with token /:db/:collection', async (test) => {
  const server = build()

  test.teardown(() => {
    server.close()
  })

  test.test('only with specified token can modify item', async (t) => {
    const res = await server.inject({
      method: 'POST',
      path: '/db/collection',
      headers: { 'content-type': 'application/json', authorization: 'Bearer test' },
      payload: { modified: false },
    })
    const {
      data: { _id },
    } = JSON.parse(res.body)

    // No token
    const res2 = await server.inject({
      method: 'PUT',
      path: `/db/collection/${_id}`,
      headers: { 'content-type': 'application/json' },
      payload: { modified: true },
    })
    t.equal(res2.statusCode, 401)
    const body2 = JSON.parse(res2.body)
    t.equal(body2.message, 'TokenInvalid')

    // Invalid token
    const res3 = await server.inject({
      method: 'PUT',
      path: `/db/collection/${_id}`,
      headers: { 'content-type': 'application/json' },
      payload: { modified: true },
    })
    t.equal(res3.statusCode, 401)
    const body3 = JSON.parse(res3.body)
    t.equal(body3.message, 'TokenInvalid')

    // Correct token
    const res4 = await server.inject({
      method: 'PUT',
      path: `/db/collection/${_id}`,
      headers: { 'content-type': 'application/json', authorization: 'Bearer test' },
      payload: { modified: true },
    })
    t.equal(res4.statusCode, 200)
    const body4 = JSON.parse(res4.body)
    t.equal(body4.data.modified, true)
  })
})
