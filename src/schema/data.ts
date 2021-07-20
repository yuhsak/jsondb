import { Static, Type, TAny } from '@sinclair/typebox'
import { MAX_STRING_LENGTH, MAX_ARRAY_LENGTH, MAX_BULK_CREATION_LENGTH } from '../config'

const Item = Type.Union([Type.Number(), Type.String({ maxLength: MAX_STRING_LENGTH }), Type.Boolean(), Type.Null()])

const data = (self: TAny) => {
  const Arr1 = Type.Array(Type.Union([Item, self]), { maxItems: MAX_ARRAY_LENGTH })
  const Arr2 = Type.Array(Arr1, { maxItems: MAX_ARRAY_LENGTH })
  const Arr3 = Type.Array(Arr2, { maxItems: MAX_ARRAY_LENGTH })
  return Type.Dict(Type.Union([Item, self, Arr1, Arr2, Arr3]))
}

export const Data = Type.Rec(data)

export type Data = Static<typeof Data>

export const multipleData = (self: TAny) => Type.Array(data(self), { maxItems: MAX_BULK_CREATION_LENGTH })

export const SingleOrMultipleData = Type.Rec((self) => Type.Union([data(self), multipleData(self)]))

export type SingleOrMultipleData = Static<typeof SingleOrMultipleData>
