import tap from 'tap'
import { server } from './server'

tap.test('"GET /" responds with 200', async (t) => {
  const res = await server.inject({
    method: 'GET',
    path: '/',
  })
  t.equal(res.statusCode, 200)
})
