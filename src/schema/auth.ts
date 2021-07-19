import { Static, Type } from '@sinclair/typebox'

export const Auth = Type.Object({
  id: Type.String({ maxLength: 256 }),
  password: Type.String({ maxLength: 256 }),
})

export type Auth = Static<typeof Auth>

export const AuthOption = Type.Partial(Auth)

export type AuthOption = Static<typeof AuthOption>
