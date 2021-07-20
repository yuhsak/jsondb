import { connect } from '../db/client'
import { CLEANUP_EXCLUDE_DB, CLEANUP_THRESHOLD } from '../config'
import { prohibitedDbs, prohibitedCollections } from '../hooks'

const getAllCollections = async () => {
  const client = await connect()
  const admin = client.db('test').admin()
  const arr: { db: string; collection: string }[] = []
  // @ts-ignore
  const { databases } = await admin.listDatabases()
  for (const db of databases.filter((db: any) => ![...prohibitedDbs, ...CLEANUP_EXCLUDE_DB].includes(db.name)).map((db: any) => db.name)) {
    if (typeof db === 'string') {
      const collections = await client.db(db).listCollections().toArray()
      for (const collection of collections.filter((c: any) => ![...prohibitedCollections.filter((c) => c !== 'auth')].includes(c.name)).map((c: any) => c.name)) {
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
  const period = now - CLEANUP_THRESHOLD
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
