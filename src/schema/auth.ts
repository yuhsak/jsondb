import { Static, Type } from '@sinclair/typebox'
import { MIN_AUTH_ID_LENGTH, MAX_AUTH_ID_LENGTH, MIN_AUTH_PASSWORD_LENGTH, MAX_AUTH_PASSWORD_LENGTH } from '../config'

export const Auth = Type.Object({
  id: Type.String({ minLength: MIN_AUTH_ID_LENGTH, maxLength: MAX_AUTH_ID_LENGTH }),
  password: Type.String({ minLength: MIN_AUTH_PASSWORD_LENGTH, maxLength: MAX_AUTH_PASSWORD_LENGTH }),
})

export type Auth = Static<typeof Auth>

export const AuthOption = Type.Partial(Auth)

export type AuthOption = Static<typeof AuthOption>
