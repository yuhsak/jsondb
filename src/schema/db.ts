import { Static, Type } from '@sinclair/typebox'

export const DB = Type.Object({
  db: Type.String({ pattern: '^[-a-zA-Z0-9_]+$' }),
})

export type DB = Static<typeof DB>

export const Collection = Type.Intersect([
  DB,
  Type.Object({
    collection: Type.String({ pattern: '^(?!\\.)(?!.*\\.$)[-a-zA-Z0-9_.]+$' }),
  }),
])

export type Collection = Static<typeof Collection>

export const Document = Type.Intersect([
  Collection,
  Type.Object({
    id: Type.String({ pattern: '^[a-z0-9]{24}$' }),
  }),
])

export type Document = Static<typeof Document>
