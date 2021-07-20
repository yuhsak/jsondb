import { Static, Type } from '@sinclair/typebox'
import { MIN_API_KEY_LENGTH, MAX_API_KEY_LENGTH } from '../config'

export const ApiKey = Type.Object({
  'x-api-key': Type.Optional(Type.String({ minLength: MIN_API_KEY_LENGTH, maxLength: MAX_API_KEY_LENGTH })),
})

export type ApiKey = Static<typeof ApiKey>
