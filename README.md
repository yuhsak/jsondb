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

`https://jsondb.app`

### GET /:db/:collection

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

### POST /:db/:collection

Create new document.

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

### GET /:db/:collection/:id

Get document with specific id.

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

### PUT /:db/:collection/:id

Create or replace document with specific id.

A new document will be created if the given id not exist, otherwise existing document will be replaced by provided body.

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

### PATCH /:db/:collection/:id

Create or patch document with specific id.

A new document will be created if the given id not exist, otherwise existing document will be merged with provided body.

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

### DELETE /:db/:collection/:id

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

> **TODO: Complete below**

### Filter documents by query

Filters can be applied through querystring.

Multiple fields are allowed at same time and the parameter must be a valid JSON string.

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?query={"name":"sample-document"}
```

For advanced filtering, some of the operators from MongoDB are supported.

- $ne
- $exists
- $lt
- $lte
- $gt
- $gte
- $all
- $in

Filter documents which has "name" not equals to "sample-document"

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?query={"name":{"$ne":"sample-document"}}
```

Filter documents which has "\_createdAt" to be less than 1600000000000

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?query={"_createdAt":{"$lt":1600000000000}}
```

Filter documents which doesn't have "name" field

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?query={"name":{"$exists":false}}
```

Filter documents which has "category" to be one of ["game", "entertainment"]

```
GET https://jsondb.app/db-c07f2fd8fe73045a/items?query={"category":{"$in":["game","entertainment"]}}
```

Filter documents which has "categories" to be included all of ["game", "entertainment"]

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

### Bulk create

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

### Bulk delete

### Private document

### Protected DB

### Limitation

### Serve own instance with Docker
