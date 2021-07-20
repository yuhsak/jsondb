import tap from 'tap'
import { server } from '../server'
import { generateId } from '../../src/util'

const db = `auth-patch-${generateId(32)}`
const path = `/${db}/auth`

tap.teardown(() => {
  server.close()
})

tap.before(async () => {
  await server.inject({
    method: 'PATCH',
    path,
    headers: { authorization: 'Bearer test1' },
    payload: { id: 'test1234', password: 'test1234' },
  })
  await server.inject({
    method: 'PATCH',
    path,
    headers: { authorization: 'Bearer test2' },
    payload: { id: 'test2345', password: 'test2345' },
  })
})

tap.test('PATCH /:db/auth', async (test) => {
  test.test('responds with 200 when auth for token exists', async (t) => {
    const res = await server.inject({
      method: 'PATCH',
      path,
      payload: {},
      headers: { authorization: 'Bearer test1' },
    })
    t.equal(res.statusCode, 200)
    const body = JSON.parse(res.body)
    t.type(body.data.token, 'string')
  })

  test.test('responds with 200 when auth for token exists and id is pecified', async (t) => {
    const res = await server.inject({
      method: 'PATCH',
      path,
      payload: { id: 'test1234' },
      headers: { authorization: 'Bearer test1' },
    })
    t.equal(res.statusCode, 200)
    const body = JSON.parse(res.body)
    t.type(body.data.token, 'string')
  })

  test.test('responds with 200 when auth for token exists and password is pecified', async (t) => {
    const res = await server.inject({
      method: 'PATCH',
      path,
      payload: { password: 'test1234' },
      headers: { authorization: 'Bearer test1' },
    })
    t.equal(res.statusCode, 200)
    const body = JSON.parse(res.body)
    t.type(body.data.token, 'string')
  })

  test.test('responds with 200 when auth for token not exists and id, password both are specified ', async (t) => {
    const res = await server.inject({
      method: 'PATCH',
      path,
      payload: { id: 'test-ne-1', password: 'test-ne-1' },
      headers: { authorization: 'Bearer not-exist-1' },
    })
    t.equal(res.statusCode, 200)
    const body = JSON.parse(res.body)
    t.type(body.data.token, 'string')
  })

  test.test('responds with 400 when auth for token not exists and id is not specified ', async (t) => {
    const res = await server.inject({
      method: 'PATCH',
      path,
      payload: { password: 'test1234' },
      headers: { authorization: 'Bearer not-exist-2' },
    })
    t.equal(res.statusCode, 400)
    const body = JSON.parse(res.body)
    t.equal(body.message, 'IdNotSpecified')
  })

  test.test('responds with 400 when auth for token not exists and password is not specified ', async (t) => {
    const res = await server.inject({
      method: 'PATCH',
      path,
      payload: { id: 'test1234' },
      headers: { authorization: 'Bearer not-exist-3' },
    })
    t.equal(res.statusCode, 400)
    const body = JSON.parse(res.body)
    t.equal(body.message, 'PasswordNotSpecified')
  })

  test.test('responds with 400 when id duplicates', async (t) => {
    const res = await server.inject({
      method: 'PATCH',
      path,
      payload: { id: 'test1234', password: 'test1234' },
      headers: { authorization: 'Bearer not-exist-4' },
    })
    t.equal(res.statusCode, 400)
    const body = JSON.parse(res.body)
    t.equal(body.message, 'IdDuplicated')
  })

  test.test('responds with 400 when id duplicates', async (t) => {
    const res = await server.inject({
      method: 'PATCH',
      path,
      payload: { id: 'test1234' },
      headers: { authorization: 'Bearer test2' },
    })
    t.equal(res.statusCode, 400)
    const body = JSON.parse(res.body)
    t.equal(body.message, 'IdDuplicated')
  })
})
