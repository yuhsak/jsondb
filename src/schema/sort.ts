import { Static, Type } from '@sinclair/typebox'

export const Sort = Type.Object({
  sort: Type.String({ default: '{"_createdAt": -1}' }),
})

export type Sort = Static<typeof Sort>
