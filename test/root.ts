import tap from 'tap'
import { build } from '../src/server'

tap.test('"GET /" responds with 200', async (t) => {
  const res = await build().inject({
    method: 'GET',
    path: '/',
  })
  t.equal(res.statusCode, 200)
})
