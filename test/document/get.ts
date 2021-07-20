import tap from 'tap'
import { server } from '../server'
import { generateId } from '../../src/util'

const db = `document-get-${generateId(32)}`
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

tap.test('GET /:db/:collection/:id', async (test) => {
  test.test('responds with 200 if id exists', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
    })
    t.equal(res.statusCode, 200)
  })

  test.test('responds with 400 if id is not a valid ObjectId', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path: `/${db}/collection/test`,
    })
    t.equal(res.statusCode, 400)
  })

  test.test('responds with 404 if id not exists', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path: `/${db}/collection/${id.replace(/f/, 'a')}`,
    })
    t.equal(res.statusCode, 404)
  })

  test.test('responds with data', async (t) => {
    const res = await server.inject({
      method: 'GET',
      path,
    })
    const body = JSON.parse(res.body)
    t.equal(body.statusCode, 200)
    t.equal(body.data.flag, true)
    t.equal(body.data.order, 1)
    t.type(body.data._id, 'string')
    t.type(body.data._createdAt, 'number')
    t.type(body.data._updatedAt, 'number')
  })
})
