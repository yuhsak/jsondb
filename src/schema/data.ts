import { Static, Type, TAny } from '@sinclair/typebox'

const Item = Type.Union([Type.Number(), Type.String({ maxLength: 4096 }), Type.Boolean(), Type.Null()])

const data = (self: TAny) => {
  const Arr1 = Type.Array(Type.Union([Item, self]), { maxItems: 1024 })
  const Arr2 = Type.Array(Arr1, { maxItems: 1024 })
  const Arr3 = Type.Array(Arr2, { maxItems: 1024 })
  return Type.Dict(Type.Union([Item, self, Arr1, Arr2, Arr3]))
}

export const Data = Type.Rec(data)

export type Data = Static<typeof Data>

export const multipleData = (self: TAny) => Type.Array(data(self), { maxItems: 100 })

export const SingleOrMultipleData = Type.Rec((self) => Type.Union([data(self), multipleData(self)]))

export type SingleOrMultipleData = Static<typeof SingleOrMultipleData>
