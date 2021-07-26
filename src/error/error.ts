export type JsondbErrorCode =
  | 'Unknown'
  | 'DatabaseNotFound'
  | 'CollectionNotFound'
  | 'DocumentNotFound'
  | 'DatabaseInvalid'
  | 'CollectionInvalid'
  | 'DocumentIdInvalid'
  | 'QuerystringInvalid'
  | 'QueryInvalid'
  | 'SortInvalid'
  | 'RequestBodyInvalid'
  | 'HeadersInvalid'
  | 'ApiKeyInvalid'
  | 'TokenInvalid'
  | 'PasswordInvalid'
  | 'IdDuplicated'
  | 'IdNotSpecified'
  | 'PasswordNotSpecified'
  | 'TokenNotSpecified'
  | 'RateLimitExceeded'
  | 'InsertFailed'

export class JsondbError extends Error {
  constructor(public code: JsondbErrorCode, message?: string) {
    super(
      message === void 0
        ? code === 'Unknown'
          ? 'An unknown error occured'
          : code === 'DatabaseNotFound'
          ? 'Database not found on server'
          : code === 'CollectionNotFound'
          ? 'Collection not found on server'
          : code === 'DocumentNotFound'
          ? 'Document for specified id not found on server'
          : code === 'QueryInvalid'
          ? 'Query must be a valid JSON string'
          : code === 'SortInvalid'
          ? 'Sort must be a valid JSON string'
          : code === 'ApiKeyInvalid'
          ? 'Correct x-api-key header must be specified'
          : code === 'TokenInvalid'
          ? 'Correct authorization header must be specified'
          : code === 'PasswordInvalid'
          ? "Password doesn't match for id"
          : code === 'IdDuplicated'
          ? 'Specified id already exists'
          : code === 'IdNotSpecified'
          ? 'Id must be specified'
          : code === 'PasswordNotSpecified'
          ? 'Password must be specified'
          : code === 'TokenNotSpecified'
          ? 'Token must be specified with authorization header'
          : code === 'RateLimitExceeded'
          ? 'Per ip rate limit exceeded'
          : void 0
        : message,
    )
    this.name = 'JsondbError'
  }
}
