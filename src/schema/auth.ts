import { Static, Type } from '@sinclair/typebox'
import { MAX_AUTH_ID_LENGTH, MAX_AUTH_PASSWORD_LENGTH } from '../config'

export const Auth = Type.Object({
  id: Type.String({ minLength: 8, maxLength: MAX_AUTH_ID_LENGTH }),
  password: Type.String({ minLength: 8, maxLength: MAX_AUTH_PASSWORD_LENGTH }),
})

export type Auth = Static<typeof Auth>

export const AuthOption = Type.Partial(Auth)

export type AuthOption = Static<typeof AuthOption>
