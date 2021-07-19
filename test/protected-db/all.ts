import tap from 'tap'
import { build } from '../../src/server'
import { generateId } from '../../src/util'

const server = build()

const db1 = `protected-db-${generateId(32)}`
const db2 = `protected-db-${generateId(32)}`

const _protected = {
  db: db1,
  collection: `/${db1}/collection`,
  document: `/${db1}/collection/ffffffffffffffffffffffff`,
}

const _public = {
  db: db2,
  collection: `/${db2}/collection`,
  document: `/${db2}/collection/ffffffffffffffffffffffff`,
}

tap.teardown(() => {
  server.close()
})

tap.before(async () => {
  await server.inject({
    method: 'POST',
    path: _protected.collection,
    payload: { test: true },
    headers: { 'x-api-key': 'test' },
  })
  await server.inject({
    method: 'POST',
    path: _public.collection,
    payload: { test: true },
  })
})

tap.test('protected-db', async (test) => {
  test.test("can't get documents", async (t) => {
    const res = await server.inject({
      method: 'GET',
      path: _protected.collection,
    })
    const body = JSON.parse(res.body)
    t.equal(res.statusCode, 401)
    t.equal(body.message, 'ApiKeyInvalid')
  })

  test.test("can't delete documents", async (t) => {
    const res = await server.inject({
      method: 'DELETE',
      path: _protected.collection,
    })
    const body = JSON.parse(res.body)
    t.equal(res.statusCode, 401)
    t.equal(body.message, 'ApiKeyInvalid')
  })

  test.test("can't post documents", async (t) => {
    const res = await server.inject({
      method: 'POST',
      path: _protected.collection,
      payload: { test: true },
    })
    const body = JSON.parse(res.body)
    t.equal(res.statusCode, 401)
    t.equal(body.message, 'ApiKeyInvalid')
  })

  test.test("can't get document", async (t) => {
    const res = await server.inject({
      method: 'GET',
      path: _protected.document,
    })
    const body = JSON.parse(res.body)
    t.equal(res.statusCode, 401)
    t.equal(body.message, 'ApiKeyInvalid')
  })

  test.test("can't put document", async (t) => {
    const res = await server.inject({
      method: 'PUT',
      path: _protected.document,
      payload: { test: true },
    })
    const body = JSON.parse(res.body)
    t.equal(res.statusCode, 401)
    t.equal(body.message, 'ApiKeyInvalid')
  })

  test.test("can't patch document", async (t) => {
    const res = await server.inject({
      method: 'PATCH',
      path: _protected.document,
      payload: { test: true },
    })
    const body = JSON.parse(res.body)
    t.equal(res.statusCode, 401)
    t.equal(body.message, 'ApiKeyInvalid')
  })

  test.test("can't delete document", async (t) => {
    const res = await server.inject({
      method: 'DELETE',
      path: _protected.document,
    })
    const body = JSON.parse(res.body)
    t.equal(res.statusCode, 401)
    t.equal(body.message, 'ApiKeyInvalid')
  })

  test.test("can't make public collection to be protected one later", async (t) => {
    const res = await server.inject({
      method: 'GET',
      path: _public.collection,
    })
    t.equal(res.statusCode, 200)
    await server.inject({
      method: 'POST',
      path: _public.collection,
      payload: { test: true },
    })
    const res2 = await server.inject({
      method: 'GET',
      path: _public.collection,
    })
    t.equal(res2.statusCode, 200)
  })
})
