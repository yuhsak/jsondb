# jsondb.app

Simple, easy, out-of-the-box HTTP based JSON store designed for tiny applications.

## Motivation

There are a lot of free or paid services to store data as backend, and they are typically little bit complicated.

You probably have to manage credentials, authorizations and have to learn about the SDK/Library in a provided way.

Especially for the developer who just started to learn web frontend (like Vue and React), sometimes it'd be too much to work with.

To keep in focus on learning things of frontend developping, it's better to work with really simple HTTP based backend API.

`jsondb` is designed to be ideal for such beginners who wants to learn managing asynchronous http requests between frontend app and backend api, but also useful for prototyping and hackathons.

(Heavily inspired from [`jsonbox.io`](https://github.com/vasanthv/jsonbox))

## Usage

### Base URL

[`https://jsondb.app`](https://jsondb.app)

### Get list of documents

`GET /:db/:collection`

List all documents stored in collection.

#### Request

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items
```

#### Response

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "32d1c08cdcb91da4f5255fb4",
      "_createdAt": 1626699085422,
      "_updatedAt": 1626699085422,
      "title": "sample document 2"
    },
    {
      "_id": "b7f71f6e222fc0e852b92d0e",
      "_createdAt": 1626699054438,
      "_updatedAt": 1626699054438,
      "title": "sample document 1"
    }
  ]
}
```

### Create single document

`POST /:db/:collection`

Create a new document.

#### Request

```
POST https://jsondb.app/db-c07f2fd8fe73045a/items
Headers: {
  "Content-Type": "application/json"
}
Body: {
  "title": "sample document"
}
```

#### Response

```json
{
  "statusCode": 200,
  "data": {
    "_id": "32d1c08cdcb91da4f5255fb4",
    "_createdAt": 1626699085422,
    "_updatedAt": 1626699085422,
    "title": "sample document"
  }
}
```

### Get single document

`GET /:db/:collection/:id`

Get single document with specific id.

Returns 404 if given id doesn't exist.

`:id` must be 24 length of lowercase alphanumeric characters.

#### Request

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items/551f225bb77ea84b91a1bfaa
```

#### Response

```json
{
  "statusCode": 200,
  "data": {
    "_id": "551f225bb77ea84b91a1bfaa",
    "_createdAt": 1626699085422,
    "_updatedAt": 1626699085422,
    "title": "sample document"
  }
}
```

### Create or replace single document

`PUT /:db/:collection/:id`

Create or replace document with specific id.

A new document will be created if the given id doesn't exist, otherwise existing document will be replaced by provided body.

`:id` must be 24 length of lowercase alphanumeric characters.

#### Request

```
PUT https://jsondb.app/db-c07f2fd8fe73045a/items/551f225bb77ea84b91a1bfaa
Headers: {
  "Content-Type": "application/json"
}
Body: {
  "title": "sample document"
}
```

#### Response

```json
{
  "statusCode": 200,
  "data": {
    "_id": "551f225bb77ea84b91a1bfaa",
    "_createdAt": 1626699085422,
    "_updatedAt": 1626699085422,
    "title": "sample document"
  }
}
```

### Create or merge single document

`PATCH /:db/:collection/:id`

Create or merge document with specific id.

A new document will be created if the given id doesn't exist, otherwise existing document will be merged with provided body.

`:id` must be 24 length of lowercase alphanumeric characters.

#### Request

```
PUT https://jsondb.app/db-c07f2fd8fe73045a/items/551f225bb77ea84b91a1bfaa
Headers: {
  "Content-Type": "application/json"
}
Body: {
  "title": "sample document"
}
```

#### Response

```json
{
  "statusCode": 200,
  "data": {
    "_id": "551f225bb77ea84b91a1bfaa",
    "_createdAt": 1626699085422,
    "_updatedAt": 1626699085422,
    "title": "sample document"
  }
}
```

### Delete single document

`DELETE /:db/:collection/:id`

Delete document with specific id.

`:id` must be 24 length of lowercase alphanumeric characters.

Returns number of documents deleted by this operation.

#### Request

```
DELETE https://jsondb.app/db-c07f2fd8fe73045a/items/551f225bb77ea84b91a1bfaa
```

#### Response

```json
{
  "statusCode": 200,
  "data": {
    "count": 1
  }
}
```

### Filter documents by query

Filters can be applied through querystring.

Multiple fields are allowed at same time and the parameter must be a valid JSON string.

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?query={"name":"sample-document"}
```

For advanced filtering, some of the operators from MongoDB are supported.

- `$ne`
- `$exists`
- `$lt`
- `$lte`
- `$gt`
- `$gte`
- `$all`
- `$in`

Filter documents whose `name` is not equals to `sample-document`

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?query={"name":{"$ne":"sample-document"}}
```

Filter documents which has `\_createdAt` to be less than 1600000000000

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?query={"_createdAt":{"$lt":1600000000000}}
```

Filter documents which doesn't have `name` field

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?query={"name":{"$exists":false}}
```

Filter documents which has `category` to be one of [`game`, `entertainment`]

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?query={"category":{"$in":["game","entertainment"]}}
```

Filter documents which has an array field `categories` including all of [`game`, `entertainment`]

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?query={"categories":{"$all":["game","entertainment"]}}
```

### Sort documents

Sort order can be specified in querystring.

Multiple fields are allowed at same time and the parameter must be a valid JSON string.

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?sort={"_createdAt":"desc"}
GET https://jsondb.app/db-c07f2fd8fe73045a/items?sort={"age":"asc","class":"desc"}
```

### Paging

Pagination can be controlled with `limit` and `skip` parameters specified as querystring.

- limit
  - default: `100`
  - min: `1`
  - max: `1000`
- skip
  - default: `0`
  - min: `0`
  - max: `inf`

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?limit=10&skip=2
```

### Bulk creation

To create multiple documents at once, simply post an array of objects.

```
POST https://jsondb.app/db-c07f2fd8fe73045a/items
Headers: {
  "Content-Type": "application/json"
}
Body: [
  {
    "title": "sample document 1"
  },
  {
    "title": "sample document 2"
  }
]
```

### Private document

To make document private, `Authorization` header can be specified with bearer token.

Private document can't be modified and deleted without the token which was specified when the document is created.

For example, `Authorization` header with `Bearer test-token` must be always specified to make any modification to this document below.

**Create a private document**

```
POST https://jsondb.app/db-c07f2fd8fe73045a/items
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer test-token"
}
Body: {
  "title": "sample document"
}
```

When token is specified in header, `GET /:db/:collection` will return the documents only with specific token.

**Get list of private documents**

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items
Headers: {
  "Authorization": "Bearer test-token"
}
```

To prevent this behavior, `mode` parameter can be set in querystring.

**Get all documents**

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?mode=all
Headers: {
  "Authorization": "Bearer test-token"
}
```

### Bulk deletion by query

To delete all of private documents, `DELETE /:db/:collection` can be requested with token.

**Delete all of private documents**

```
DELETE https://jsondb.app/db-c07f2fd8fe73045a/items
Headers: {
  "Authorization": "Bearer test-token"
}
```

To include non-private documents into deletion, "mode" parameter can be set to "all".

**Delete all of private and non-private documents**

```
DELETE https://jsondb.app/db-c07f2fd8fe73045a/items?mode=all
Headers: {
  "Authorization": "Bearer test-token"
}
```

This bulk delete operation also can be filtered like `GET` operation.

**Delete all of private documents which has "name" to be "sample"**

```
DELETE https://jsondb.app/db-c07f2fd8fe73045a/items?query={"name":"sample"}
Headers: {
  "Authorization": "Bearer test-token"
}
```

### Authentication

Every database has a special collection named `auth` in which pairs of id and password can be stored.

It's a toy function which is too weak to use as real authentication, but actually useful for prototyping or learning how to create user based apps.

**(Don't use this to store sensitive user information, especially related to real payment or something.)**

#### Create or authorize account

To create a record, make PUT request to the collection with id and password.

The id and password must be at least 8 characters.

> `password` will be encryted automatically before save.

Then a response with `token` will be returned. This `token` can be used with `Authorization` header.

If same id and password are specified, always same token will be returned.

##### Request

```
PUT https://jsondb.app/db-c07f2fd8fe73045a/auth
Body: {
  "id": "test1234",
  "password": "test1234"
}
```

##### Response

```json
{
  "statusCode": 200,
  "data": {
    "token": "952d738da7ae6b155b0302ded591123c"
  }
}
```

If a invalid password is specified, response with status 401 will be returned.

##### Request

```
PUT https://jsondb.app/db-c07f2fd8fe73045a/auth
Body: {
  "id": "test1234",
  "password": "invalid-password"
}
```

##### Response

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "PasswordInvalid"
}
```

#### Update id, password or create new account based on auth token

To update id, password or create new record based on Authorization token, make PATCH request with payload.

**Update password for id "test"**

##### Request

```
PATCH https://jsondb.app/db-c07f2fd8fe73045a/auth
Headers: {
  "Authorization": "Bearer 952d738da7ae6b155b0302ded591123c"
}
Body: {
  "password": "changed-password"
}
```

##### Response

```json
{
  "statusCode": 200,
  "data": {
    "token": "952d738da7ae6b155b0302ded591123c"
  }
}
```

**Create new record with token "test-token"**

##### Request

```
PATCH https://jsondb.app/db-c07f2fd8fe73045a/auth
Headers: {
  "Authorization": "Bearer test-token"
}
Body: {
  "id": "newly-created-id",
  "password": "newly-created-password"
}
```

##### Response

```json
{
  "statusCode": 200,
  "data": {
    "token": "test-token"
  }
}
```

### Protected DB

To make database protected, `x-api-key` header can be specified when a very first document is created.

Protected database can't be accessed without this `x-api-key`, even for "GET" request.

The `x-api-key` must have at least 8 characters of length.

```
POST https://jsondb.app/db-c07f2fd8fe73045a/items
Headers: {
  "Content-Type": "application/json",
  "x-api-key": "test-api-key"
}
Body: {
  "title": "sample document"
}
```

Making db protected with `x-api-key` works only for first time of document creation for each db.

This means that when any document has already been created without `x-api-key` into a db, then this db never can be turned into a protected one.

### Limitation

- Max 50KB of request body
- Max 4096 length of one string field
- Max 1024 length of one array field
- Max 100 items of one time bulk creation
- Documents will be deleted after 30 days from creation
- 10 seconds of one query execution (`GET,DELETE /:db/:collection`)

### Serve own instance with Docker

> **TODO: Complete this**
