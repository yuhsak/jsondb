import { Static, Type } from '@sinclair/typebox'
import { MAX_API_KEY_LENGTH } from '../config'

export const ApiKey = Type.Object({
  'x-api-key': Type.Optional(Type.String({ minLength: 8, maxLength: MAX_API_KEY_LENGTH })),
})

export type ApiKey = Static<typeof ApiKey>
