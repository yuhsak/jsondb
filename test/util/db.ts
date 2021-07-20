import tap from 'tap'
import { buildUri, serialize, splitMeta, decorateKeyForData, omitMeta, omitToken, createQuery } from '../../src/util/db'

tap.test('util/db', async (suite) => {
  suite.test('buildUri', async (t) => {
    t.test('works with basic param', async (t) => {
      t.equal(buildUri({ protocol: 'mongodb', host: '0.0.0.0', port: 27017 }), 'mongodb://0.0.0.0:27017')
    })
    t.test('works with protocol', async (t) => {
      t.equal(buildUri({ protocol: 'mongodb+srv', host: '0.0.0.0', port: 27017 }), 'mongodb+srv://0.0.0.0:27017')
    })
    t.test('works with username', async (t) => {
      t.equal(buildUri({ protocol: 'mongodb', host: '0.0.0.0', port: 27017, username: 'test' }), 'mongodb://test@0.0.0.0:27017')
    })
    t.test('works with username and password', async (t) => {
      t.equal(buildUri({ protocol: 'mongodb', host: '0.0.0.0', port: 27017, username: 'test', password: 'test' }), 'mongodb://test:test@0.0.0.0:27017')
    })
    t.test('username and password are encoded', async (t) => {
      t.equal(buildUri({ protocol: 'mongodb', host: '0.0.0.0', port: 27017, username: 'test+', password: 'test=' }), 'mongodb://test%2B:test%3D@0.0.0.0:27017')
    })
    t.test('works with authMechanism', async (t) => {
      t.equal(buildUri({ protocol: 'mongodb', host: '0.0.0.0', port: 27017, authMechanism: 'DEFAULT' }), 'mongodb://0.0.0.0:27017/?authMechanism=DEFAULT')
    })
    t.test('works with connectionQuery', async (t) => {
      t.equal(buildUri({ protocol: 'mongodb', host: '0.0.0.0', port: 27017, connectionQuery: 'tls=true&poolSize=20' }), 'mongodb://0.0.0.0:27017/?tls=true&poolSize=20')
    })
    t.test('works with authMechanism and connectionQuery', async (t) => {
      t.equal(
        buildUri({ protocol: 'mongodb', host: '0.0.0.0', port: 27017, authMechanism: 'DEFAULT', connectionQuery: 'tls=true&poolSize=20' }),
        'mongodb://0.0.0.0:27017/?authMechanism=DEFAULT&tls=true&poolSize=20',
      )
    })
  })

  suite.test('serialize', async (t) => {
    t.test('userdata is unwrapped', async (t) => {
      t.strictSame(serialize({ _id: 'a', _createdAt: 10, _updatedAt: 20, _token: 'abc', data: { a: 1, b: 2 } }), { _id: 'a', _createdAt: 10, _updatedAt: 20, a: 1, b: 2 })
    })
    t.test("userdata can't overwrite system meta", async (t) => {
      t.strictSame(serialize({ _id: 'a', _createdAt: 10, _updatedAt: 20, data: { _id: 'b', _createdAt: 30, _updatedAt: 40, a: 1, b: 2 } }), {
        _id: 'a',
        _createdAt: 10,
        _updatedAt: 20,
        a: 1,
        b: 2,
      })
    })
  })

  suite.test('splitMeta', async (t) => {
    t.test('userdata and sysytem meta are splitted', async (t) => {
      t.strictSame(
        splitMeta({
          _id: 'a',
          _createdAt: 10,
          _updatedAt: 20,
          _token: 'b',
          a: 1,
          b: 2,
        }),
        { data: { a: 1, b: 2 }, meta: { _id: 'a', _createdAt: 10, _updatedAt: 20, _token: 'b' } },
      )
    })
  })

  suite.test('omitMeta', async (t) => {
    t.test('system meta removed', async (t) => {
      t.strictSame(
        omitMeta({
          _id: 'a',
          _createdAt: 10,
          _updatedAt: 20,
          _token: 'b',
          a: 1,
          b: 2,
        }),
        { a: 1, b: 2 },
      )
    })
  })

  suite.test('omitToken', async (t) => {
    t.test('_token removed', async (t) => {
      t.strictSame(
        omitToken({
          _token: 'b',
          a: 1,
          b: 2,
        }),
        { a: 1, b: 2 },
      )
    })
  })

  suite.test('decorateKeyForData', async (t) => {
    t.test('keys are decorated', async (t) => {
      t.strictSame(
        decorateKeyForData({
          a: 1,
          b: 2,
        }),
        { 'data.a': 1, 'data.b': 2 },
      )
    })
  })

  suite.test('createQuery', async (t) => {
    t.test('userdata are decorated and system meta remains except _token', async (t) => {
      t.strictSame(
        createQuery({
          _id: 'a',
          _createdAt: 10,
          _updatedAt: 20,
          _token: 'b',
          a: 1,
          b: 2,
        }),
        { 'data.a': 1, 'data.b': 2, _id: 'a', _createdAt: 10, _updatedAt: 20 },
      )
    })
  })
})
