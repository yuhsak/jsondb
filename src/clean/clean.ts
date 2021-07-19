import { connect } from '../db/client'
import { EXCLUDE_DB_FROM_CLEANER } from '../config'

const getAllCollections = async () => {
  const client = await connect()
  const admin = client.db('test').admin()
  const arr: { db: string; collection: string }[] = []
  // @ts-ignore
  const { databases } = await admin.listDatabases()
  for (const db of databases.filter((db: any) => !['admin', 'local', 'config', 'system', 'meta', ...EXCLUDE_DB_FROM_CLEANER].includes(db.name)).map((db: any) => db.name)) {
    if (typeof db === 'string') {
      const collections = await client.db(db).listCollections().toArray()
      for (const collection of collections.filter((c: any) => !['config', 'system', 'meta'].includes(c.name)).map((c: any) => c.name)) {
        if (typeof collection === 'string') {
          arr.push({ db, collection })
        }
      }
    }
  }
  return arr
}

export const clean = async () => {
  const client = await connect()
  const collections = await getAllCollections()
  const now = new Date().getTime()
  const period = now - 1000 * 60 * 60 * 24 * 30
  for (const dist of collections) {
    const collection = client.db(dist.db).collection(dist.collection)
    let targets = [...Array(100)].fill(0)
    while (targets.length >= 100) {
      targets = await collection
        .find({ _createdAt: { $lt: period } })
        .limit(100)
        .toArray()
      await collection.deleteMany({ _id: { $in: targets.map((t) => t._id) } })
    }
  }
}
