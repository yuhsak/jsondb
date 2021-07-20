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

## Filter documents by query

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

Filter documents which has `_createdAt` to be less than 1600000000000

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

## Sort documents

Sort order can be specified in querystring.

Multiple fields are allowed at same time and the parameter must be a valid JSON string.

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?sort={"_createdAt":"desc"}
GET https://jsondb.app/db-c07f2fd8fe73045a/items?sort={"age":"asc","class":"desc"}
```

## Paging

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

## Bulk creation

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

## Private document

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

## Bulk deletion by query

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

## Authentication

Every database has a special collection named `auth` in which pairs of id and password can be stored.

It's a toy function which is too weak to use as real authentication, but actually useful for prototyping or learning how to create user based apps.

**(Don't use this to store sensitive user information, especially related to real payment or something.)**

### Create or authorize account

To create a record, make PUT request to the collection with id and password.

The id and password must be at least 8 characters.

> `password` will be encryted automatically before save.

Then a response with `token` will be returned. This `token` can be used with `Authorization` header.

If same id and password are specified, always same token will be returned.

#### Request

```
PUT https://jsondb.app/db-c07f2fd8fe73045a/auth
Body: {
  "id": "test1234",
  "password": "test1234"
}
```

#### Response

```json
{
  "statusCode": 200,
  "data": {
    "token": "952d738da7ae6b155b0302ded591123c"
  }
}
```

If a invalid password is specified, response with status 401 will be returned.

#### Request

```
PUT https://jsondb.app/db-c07f2fd8fe73045a/auth
Body: {
  "id": "test1234",
  "password": "invalid-password"
}
```

#### Response

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "PasswordInvalid"
}
```

### Update id, password or create new account based on auth token

To update id, password or create new record based on Authorization token, make PATCH request with payload.

**Update password for id "test"**

#### Request

```
PATCH https://jsondb.app/db-c07f2fd8fe73045a/auth
Headers: {
  "Authorization": "Bearer 952d738da7ae6b155b0302ded591123c"
}
Body: {
  "password": "changed-password"
}
```

#### Response

```json
{
  "statusCode": 200,
  "data": {
    "token": "952d738da7ae6b155b0302ded591123c"
  }
}
```

**Create new record with token "test-token"**

#### Request

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

#### Response

```json
{
  "statusCode": 200,
  "data": {
    "token": "test-token"
  }
}
```

## Protected DB

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

## Limitation

Sorry for unconvenience, but free public instance [`https://jsondb.app`](https://jsondb.app) has some limitations to stay for free as long as possible.

And these limitations will probably be updated in the future.

- Max 50KB of request body
- Max 4096 length of one string field
- Max 1024 length of one array field
- Max 100 items of one time bulk creation
- 10 seconds of one query execution (`GET /:db/:collection`)
- Documents will be regularly deleted after 30 days from creation
- Documents will be randomly deleted during maintenance sometimes

If you want to get rid of those limitations, consider hosting your own instance by yourself.

## Serve own instance with Docker

`jsondb` is registered at [dockerhub](https://hub.docker.com/r/yuhsak/jsondb), so that you can easily serve your own instance with Docker without any limitations like above.

Note that `jsondb` uses `MongoDB` as its backed Database, there must be an accessible mongodb server before starting `jsondb` instance.

While `jsondb` doesn't validate user's input query perfectly, please don't forget to serve mongodb with **--noscripting** option to avoid unexpected script injection.

### With docker run

If a mongodb instance can be accessed at `localhost` and listening on port `27017`, the docker command to run jsondb instance would be something like below.

```sh
docker run -p 8000:8000 -e DB_HOST=localhost -e DB_PORT=27017 -e SERVER_HOST=localhost -e SERVER_PORT=8000 -e ENABLE_CORS=true -e ENABLE_LOGGER=true -e LOGGER_PRETTY_PRINT=true yuhsak/jsondb:latest
```

### With docker-compose including mongodb

```yaml
version: '3.1'
services:
  api:
    image: yuhsak/jsondb:latest
    ports:
      - 8000:8000
    environment:
      DB_HOST: db
      DB_PORT: 27017
      SERVER_HOST: 0.0.0.0
      SERVER_PORT: 8000
      ENABLE_CORS: 'true'
      CORS_ORIGIN: '*'
      ENABLE_LOGGER: 'true'
      LOGGER_LEVEL: info
      LOGGER_PRETTY_PRINT: 'true'
      AES_PASSWORD: your-aes-password
      AES_SALT: your-aes-salt
  db:
    image: mongo:5.0.0
    expose:
      - 27017
    volumes:
      - ./data/db:/data/db
    command: --noscripting
```

### Environment variables

#### DB Connection

- `DB_PROTOCOL`
  - Protocol to communicate with mongodb server.
  - Set this to `mongodb+srv` if the hostname following it corresponds to the DNS SRV record of your instance or deployment.
  - default: `mongodb`
- `DB_HOST`
  - Hostname of mongodb server.
  - default: `localhost`
- `DB_PORT`
  - Listening port of mongodb server.
  - default: `27017`
- `DB_USERNAME`
  - Username for authentication. Will be automatically encoded through `encodeURIComponent()`.
  - Specify only if your mongodb server requires user based authentication, otherwise just leave it unset.
  - Colud be specified with `AWS_ACCESS_KEY_ID` if `DB_AUTH_MECHANISM` is set to be `MONGODB-AWS`.
  - default: `undefined`
- `DB_PASSWORD`
  - Password for authentication. Will be automatically encoded through `encodeURIComponent()`.
  - Specify only if needed, otherwise just leave it unset.
  - Colud be specified with `AWS_SECRET_ACCESS_KEY` if `DB_AUTH_MECHANISM` is set to be `MONGODB-AWS`.
  - default: `undefined`
- `DB_AUTH_MECHANISM`
  - The `authMechanism` config.
  - Example
    - `DEFAULT`
    - `SCRAM-SHA-256`
    - `SCRAM-SHA-1`
    - `MONGODB-AWS`
    - `MONGODB-X509`
  - default: `DEFAULT`
- `DB_CONNECTION_QUERY`
  - Additional connection config as a querystring.
  - TLS related configs also can be specified with in this variable.
  - Examples
    - `tls=true&tlsCertificateKeyFile=tls-key.cer`
    - `poolSize=20&writeConcern=majority`
    - `connectTimeoutMS=20000&socketTimeoutMS=720000`
  - default: `undefined`
- `AWS_SESSION_TOKEN`
  - Effects only if `DB_AUTH_MECHANISM` is set to `MONGODB-AWS` and your aws requires a session token.
  - default: `undefined`

#### HTTP Server

- `SERVER_HOST`
  - Hostname of jsondb server.
  - default: `localhost`
- `SERVER_PORT`
  - Listening port of jsondb server.
  - default: `8000`
- `TRUST_PROXY`
  - Wheather to trust headers from reverse proxy.
  - Set this to `true` if the jsondb server is behind a reverse proxy server (ex. Nginx, LoadBalancer).
  - default: `false`
- `AES_PASSWORD`
  - Internally used password for AES encryption.
  - **Do not leave this as default value in any public environment.**
  - default: `password`
- `AES_SALT`
  - Internally used salt for AES encryption.
  - **Do not leave this as default value in any public environment.**
  - default: `salt`
- `ENABLE_CORS`
  - Wheather to enable headers for Cross Origin Resource Sharing.
  - Set this to `true` if jsondb server will communicate with web-browser based applications
  - default: `false`
- `CORS_ORIGIN`
  - Accepted origins for CORS. Can be specified multiple values with comma separated format.
  - Set this to `*` to accept any origins.
  - example: `*` `example.com,app.example.com`
  - default: `*`

#### Logging

- `ENABLE_LOGGER`
  - Wheather to output access logs into stdout.
  - default: `false`
- `LOGGER_LEVEL`
  - Log level.
  - default: `info`
- `LOGGER_PRETTY_PRINT`
  - Wheather to enable pretty print option for logger.
  - default: `false`

#### Limitation

- `MAX_BODY_SIZE_KB`
  - Maximum size of each request body in KB.
  - default: `50`
- `MAX_PARAM_LENGTH`
  - Maximum length of characters for path parameters such as database names and collection names.
  - default: `128`
- `MAX_STRING_LENGTH`
  - Maximum length of characters for `string` type field value in each document.
  - default: `4096`
- `MAX_ARRAY_LENGTH`
  - Maximum length for `array` type field value in each document.
  - default: `1024`
- `MIN_AUTH_ID_LENGTH`
  - Minimum length of characters for `id` field value in `auth` collection.
  - default: `8`
- `MAX_AUTH_ID_LENGTH`
  - Maximum length of characters for `id` field value in `auth` collection.
  - default: `1024`
- `MIN_AUTH_PASSWORD_LENGTH`
  - Minimum length of characters for `password` field value in `auth` collection.
  - default: `8`
- `MAX_AUTH_PASSWORD_LENGTH`
  - Maximum length of characters for `password` field value in `auth` collection.
  - default: `1024`
- `MIN_API_KEY_LENGTH`
  - Minimum length of characters for `x-api-key` value in request headers.
  - default: `8`
- `MAX_API_KEY_LENGTH`
  - Maximum length of characters for `x-api-key` value in request headers.
  - default: `1024`
- `MAX_BULK_CREATION_LENGTH`
  - Maximum number of items for bulk creation at one time.
  - default: `100`
- `MAX_QUERY_EXECUTION_SEC`
  - Maximum time for waiting query execution in seconds.
  - default: `10`
