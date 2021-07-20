import tap from 'tap'
import { server } from '../server'
import { generateId } from '../../src/util'

const db = `document-delete-${generateId(32)}`
const id = `ffffffffffffffffffffffff`
const path = `/${db}/collection/${id}`

tap.teardown(() => {
  server.close()
})

tap.test('DELETE /:db/:collection/:id', async (test) => {
  test.test('responds with 200', async (t) => {
    await server.inject({
      method: 'PUT',
      path,
      payload: { flag: true, order: 1 },
    })
    const res = await server.inject({
      method: 'DELETE',
      path,
    })
    t.equal(res.statusCode, 200)
  })

  test.test('responds with 200 even if id not exists', async (t) => {
    const res = await server.inject({
      method: 'DELETE',
      path: `/${db}/collection/${id.replace(/f/, 'a')}`,
    })
    t.equal(res.statusCode, 200)
  })

  test.test('data is deleted', async (t) => {
    await server.inject({
      method: 'PUT',
      path,
      headers: { 'content-type': 'application/json' },
      payload: { flag: true },
    })
    const res1 = await server.inject({
      method: 'GET',
      path,
    })
    t.equal(res1.statusCode, 200)
    const res2 = await server.inject({
      method: 'DELETE',
      path,
    })
    t.equal(JSON.parse(res2.body).data.count, 1)
    const res3 = await server.inject({
      method: 'GET',
      path,
    })
    t.equal(res3.statusCode, 404)
    const res4 = await server.inject({
      method: 'DELETE',
      path,
    })
    t.equal(JSON.parse(res4.body).data.count, 0)
  })

  test.test('responds with data', async (t) => {
    const res = await server.inject({
      method: 'DELETE',
      path,
    })
    const body = JSON.parse(res.body)
    t.equal(body.statusCode, 200)
    t.type(body.data.count, 'number')
  })
})
