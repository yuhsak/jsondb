import { Static, Type } from '@sinclair/typebox'

export const ApiKey = Type.Object({
  'x-api-key': Type.Optional(Type.String({ maxLength: 256 })),
})

export type ApiKey = Static<typeof ApiKey>
