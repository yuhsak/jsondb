import { Static, Type } from '@sinclair/typebox'

export const Query = Type.Object({
  query: Type.Optional(Type.String()),
  mode: Type.Union([Type.Literal('private'), Type.Literal('public'), Type.Literal('all')], { default: 'private' }),
})

export type Query = Static<typeof Query>
