import tap from 'tap'
import { server } from '../server'
import { generateId } from '../../src/util'

const db = `document-patch-${generateId(32)}`
const id = `ffffffffffffffffffffffff`
const path = `/${db}/collection/${id}`

tap.teardown(() => {
  server.close()
})

tap.before(async () => {
  await server.inject({
    method: 'PUT',
    path,
    payload: { flag: true, order: 1 },
  })
})

tap.test('PATCH /:db/:collection/:id', async (test) => {
  test.test('responds with 200', async (t) => {
    const res = await server.inject({
      method: 'PATCH',
      path,
      headers: { 'content-type': 'application/json' },
      payload: { flag: true },
    })
    t.equal(res.statusCode, 200)
  })

  test.test('responds with 200 even if id not exists', async (t) => {
    const res = await server.inject({
      method: 'PATCH',
      path: `/${db}/collection/${id.replace(/f/, 'a')}`,
      headers: { 'content-type': 'application/json' },
      payload: { flag: true },
    })
    t.equal(res.statusCode, 200)
  })

  test.test('data is merged', async (t) => {
    await server.inject({
      method: 'PATCH',
      path,
      headers: { 'content-type': 'application/json' },
      payload: { flag: true },
    })
    const res1 = await server.inject({
      method: 'GET',
      path,
    })
    t.equal(res1.statusCode, 200)
    t.equal(JSON.parse(res1.body).data.flag, true)
    await server.inject({
      method: 'PATCH',
      path,
      headers: { 'content-type': 'application/json' },
      payload: { order: 1 },
    })
    const res2 = await server.inject({
      method: 'GET',
      path,
    })
    t.equal(res2.statusCode, 200)
    t.equal(JSON.parse(res2.body).data.flag, true)
    t.equal(JSON.parse(res2.body).data.order, 1)
  })

  test.test('responds with data', async (t) => {
    const res = await server.inject({
      method: 'PATCH',
      path,
      headers: { 'content-type': 'application/json' },
      payload: { flag: true },
    })
    const body = JSON.parse(res.body)
    t.equal(body.statusCode, 200)
    t.equal(body.data.flag, true)
    t.type(body.data._id, 'string')
    t.type(body.data._createdAt, 'number')
    t.type(body.data._updatedAt, 'number')
  })
})
