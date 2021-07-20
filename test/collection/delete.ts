import tap from 'tap'
import { server } from '../server'
import { generateId } from '../../src/util'

const db = `collection-get-${generateId(32)}`
const path = `/${db}/collection`

tap.teardown(() => {
  server.close()
})

tap.before(async () => {
  await server.inject({
    method: 'POST',
    path,
    payload: { n: 1 },
  })
  await server.inject({
    method: 'POST',
    path,
    payload: { n: 1 },
  })
  await server.inject({
    method: 'POST',
    path,
    payload: { n: 2 },
  })
  await server.inject({
    method: 'POST',
    path,
    payload: { n: 2 },
  })
  await server.inject({
    method: 'POST',
    path,
    payload: { n: 3 },
  })
  await server.inject({
    method: 'POST',
    path,
    payload: { n: 3 },
  })
  await server.inject({
    method: 'POST',
    path,
    headers: { authorization: 'Bearer test1' },
    payload: { n: 3 },
  })
  await server.inject({
    method: 'POST',
    path,
    headers: { authorization: 'Bearer test1' },
    payload: { n: 4 },
  })
  await server.inject({
    method: 'POST',
    path,
    headers: { authorization: 'Bearer test2' },
    payload: { n: 2 },
  })
  await server.inject({
    method: 'POST',
    path,
    headers: { authorization: 'Bearer test3' },
    payload: { n: 3 },
  })
})

tap.test('DELETE /:db/:collection', async (test) => {
  test.test('nothing happen when token and mode both are not specified', async (t) => {
    const res = await server.inject({
      method: 'DELETE',
      path,
    })
    const body = JSON.parse(res.body)
    t.equal(body.data.count, 0)
  })

  test.test('only docs with specified token are deleted', async (t) => {
    const res = await server.inject({
      method: 'DELETE',
      path,
      headers: { authorization: 'Bearer test1' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.data.count, 2)
  })

  test.test('only public docs are deleted when mode = public', async (t) => {
    const res = await server.inject({
      method: 'DELETE',
      path,
      query: { mode: 'public', query: '{"n": 1}' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.data.count, 2)
  })

  test.test('only public docs are deleted when mode = public even if token is specified', async (t) => {
    const res = await server.inject({
      method: 'DELETE',
      path,
      query: { mode: 'public', query: '{"n": 2}' },
      headers: { authorization: 'Bearer test2' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.data.count, 2)
  })

  test.test('only public docs and docs with specified token are deleted when mode = all', async (t) => {
    const res = await server.inject({
      method: 'DELETE',
      path,
      query: { mode: 'all', query: '{"n": 3}' },
      headers: { authorization: 'Bearer test3' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.data.count, 3)
  })

  test.test('query with token not works', async (t) => {
    const res = await server.inject({
      method: 'DELETE',
      path,
      query: { mode: 'all', query: '{"_token": "test2"}' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.data.count, 0)
  })
})
