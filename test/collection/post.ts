import tap from 'tap'
import { build } from '../../src/server'

tap.test('POST /:db/:collection', async (test) => {
  const server = build()

  test.teardown(() => {
    server.close()
  })

  test.test('must have request body', async (t) => {
    const res = await server.inject({
      method: 'POST',
      path: '/db/collection',
    })
    t.equal(res.statusCode, 400)
  })

  test.test('request body can be an object', async (t) => {
    const res = await server.inject({
      method: 'POST',
      path: '/db/collection',
      headers: { 'content-type': 'application/json' },
      payload: { test: true },
    })
    t.equal(res.statusCode, 200)
  })

  test.test('request body can be an array of objects', async (t) => {
    const res = await server.inject({
      method: 'POST',
      path: '/db/collection',
      headers: { 'content-type': 'application/json' },
      payload: [{ test: true }, { test: true }],
    })
    t.equal(res.statusCode, 200)
  })

  test.test("request body can't be a string", async (t) => {
    const res = await server.inject({
      method: 'POST',
      path: '/db/collection',
      headers: { 'content-type': 'application/json' },
      payload: JSON.stringify('string'),
    })
    t.equal(res.statusCode, 400)
  })

  test.test("request body can't be a number", async (t) => {
    const res = await server.inject({
      method: 'POST',
      path: '/db/collection',
      headers: { 'content-type': 'application/json' },
      payload: JSON.stringify(10),
    })
    t.equal(res.statusCode, 400)
  })

  test.test("request body can't be a boolean", async (t) => {
    const res = await server.inject({
      method: 'POST',
      path: '/db/collection',
      headers: { 'content-type': 'application/json' },
      payload: JSON.stringify(true),
    })
    t.equal(res.statusCode, 400)
  })

  test.test("request body can't be a null", async (t) => {
    const res = await server.inject({
      method: 'POST',
      path: '/db/collection',
      headers: { 'content-type': 'application/json' },
      payload: JSON.stringify(null),
    })
    t.equal(res.statusCode, 400)
  })

  test.test('response body includes input data', async (t) => {
    const res = await server.inject({
      method: 'POST',
      path: '/db/collection',
      headers: { 'content-type': 'application/json' },
      payload: { true: true, false: false, n0: 0, n1: 1, null: null, str: 'string', obj: { test: true }, arr: [1, 2, false, { test: true }] },
    })
    const body = JSON.parse(res.body)
    t.equal(res.statusCode, 200)
    t.equal(body.statusCode, 200)
    t.equal(body.data.true, true)
    t.equal(body.data.false, false)
    t.equal(body.data.n0, 0)
    t.equal(body.data.n1, 1)
    t.equal(body.data.null, null)
    t.equal(body.data.str, 'string')
    t.strictSame(body.data.obj, { test: true })
    t.strictSame(body.data.arr, [1, 2, false, { test: true }])
    t.type(body.data._id, 'string')
    t.type(body.data._createdAt, 'number')
    t.type(body.data._updatedAt, 'number')
  })

  test.test("input data can't overwrite _id, _createdAt, _updatedAt", async (t) => {
    const res = await server.inject({
      method: 'POST',
      path: '/db/collection',
      headers: { 'content-type': 'application/json' },
      payload: { test: true, _id: 'abcde', _createdAt: 10, _updatedAt: 10 },
    })
    const body = JSON.parse(res.body)
    t.equal(body.data.test, true)
    t.not(body.data._id, 'abcde')
    t.not(body.data._createdAt, 10)
    t.not(body.data._updatedAt, 10)
  })
})
