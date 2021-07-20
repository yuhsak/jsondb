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
    payload: { flag: true, order: 1 },
  })
  await server.inject({
    method: 'POST',
    path,
    payload: { flag: true, order: 3 },
  })
  await server.inject({
    method: 'POST',
    path,
    payload: { flag: false, order: 2 },
  })
  await server.inject({
    method: 'POST',
    path,
    payload: { flag: false, order: 4 },
  })
  await server.inject({
    method: 'POST',
    path,
    headers: { authorization: 'Bearer test' },
    payload: { flag: false, order: 5 },
  })
})

tap.test('GET /:db/:collection', async (test) => {
  test.test('responds with 200', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
    })
    t.equal(res.statusCode, 200)
  })

  test.test('responds with items', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
    })
    const body = JSON.parse(res.body)
    t.equal(body.statusCode, 200)
    t.equal(body.data.length, 5)
    body.data.forEach((item: any) => {
      t.type(item._id, 'string')
      t.type(item._createdAt, 'number')
      t.type(item._updatedAt, 'number')
    })
  })

  test.test('response data is sorted in order asc', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
      query: { sort: '{"order": 1}' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.statusCode, 200)
    t.strictSame(
      body.data.map((item: any) => item.order),
      [1, 2, 3, 4, 5],
    )
  })

  test.test('response data is sorted in order desc', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
      query: { sort: '{"order": -1}' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.statusCode, 200)
    t.strictSame(
      body.data.map((item: any) => item.order),
      [5, 4, 3, 2, 1],
    )
  })

  test.test('response data is filtered', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
      query: { query: '{"flag": true}' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.statusCode, 200)
    t.strictSame(
      body.data.map((item: any) => item.flag),
      [true, true],
    )
  })

  test.test('response data is limitted', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
      query: { limit: '2' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.statusCode, 200)
    t.equal(body.data.length, 2)
  })

  test.test('response data is skipped', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
      query: { skip: '1', limit: '2', sort: '{"_createdAt": -1}' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.statusCode, 200)
    t.strictSame(
      body.data.map((item: any) => item.flag),
      [false, true],
    )
  })

  test.test('only items with specified tokens are included in response', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
      headers: { authorization: 'Bearer test' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.data.length, 1)
  })

  test.test('all items are included in response even if a token is specified when set mode = all', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
      query: { mode: 'all' },
      headers: { authorization: 'Bearer test' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.data.length, 5)
  })

  test.test('only public items are included in response when set mode = public', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
      query: { mode: 'public' },
      headers: { authorization: 'Bearer test' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.data.length, 4)
  })

  test.test('filter by _token not works', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
      query: { query: '{"_token": "test"}' },
    })
    const body = JSON.parse(res.body)
    t.equal(body.data.length, 5)
  })

  test.test('sort by _token not works', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
      query: { sort: '{"_token": -1}' },
    })
    const body = JSON.parse(res.body)
    t.strictSame(
      body.data.map((item: any) => item.order),
      [1, 3, 2, 4, 5],
    )
  })
})
