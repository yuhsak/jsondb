import tap from 'tap'
import { build } from '../../src/server'
import { generateId } from '../../src/util'

const server = build()

const db = `auth-put-${generateId(32)}`
const path = `/${db}/auth`

tap.teardown(() => {
  server.close()
})

tap.before(async () => {
  await server.inject({
    method: 'PUT',
    path,
    payload: { id: 'test', password: 'test' },
  })
})

tap.test('PUT /:db/auth', async (test) => {
  test.test('responds with 200', async (t) => {
    const res = await server.inject({
      method: 'PUT',
      path,
      payload: { id: 'test', password: 'test' },
    })
    t.equal(res.statusCode, 200)
  })

  test.test('responds with token', async (t) => {
    const res = await server.inject({
      method: 'PUT',
      path,
      payload: { id: 'test', password: 'test' },
    })
    const body = JSON.parse(res.body)
    t.type(body.data.token, 'string')
  })

  test.test('responds with same token', async (t) => {
    const res = await server.inject({
      method: 'PUT',
      path,
      payload: { id: 'test', password: 'test' },
    })
    const body = JSON.parse(res.body)
    const res2 = await server.inject({
      method: 'PUT',
      path,
      payload: { id: 'test', password: 'test' },
    })
    const body2 = JSON.parse(res2.body)
    t.equal(body.data.token, body2.data.token)
  })

  test.test('responds 401 when password is invalid', async (t) => {
    const res = await server.inject({
      method: 'PUT',
      path,
      payload: { id: 'test', password: 'test2' },
    })
    const body = JSON.parse(res.body)
    t.equal(res.statusCode, 401)
    t.equal(body.message, 'PasswordInvalid')
  })
})
