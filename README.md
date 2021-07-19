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

### Sort documents

### Pagination

### Bulk create

### Bulk delete

### Private document

### Protected DB

### Limitation

### Serve own instance with Docker
