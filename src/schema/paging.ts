import { Static, Type } from '@sinclair/typebox'

export const Paging = Type.Object({
  limit: Type.Number({ default: 100, minimum: 1, maximum: 1000 }),
  skip: Type.Number({ default: 0, minimum: 0 }),
})

export type Paging = Static<typeof Paging>
