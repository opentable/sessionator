# Sessionator (Work In Progress)

Multi-Tenant Redis-Backed Session Store

## Goals

Provide a centralized service within an organization which many disparate teams can track data attached to a particular users Session ID / User ID.

Provide a mechanism to allow teams to insert chaotic data in some namespaces or schema-adhering data in other namespaces.

Reads should happen within ~20ms and writes should happen within ~50ms.

Schemas should use a declarative syntax (e.g. not Joi) and be easy to understand.

## Concepts

A User Session can contain one or many Namespaces.

A Namespace can represent a feature of a team and should contain minimal amount of data.

Multiple namespaces for a single User Session can be read at once, but only one Namespace can be written at once.

Here's a recommended Namespace nomenclature:

```
teamName.featureName.version
restaurants.lastVisited.v1
```

## HTTP Usage

There's a Swagger project at [tlhunter/sessionator](https://app.swaggerhub.com/api/tlhunter/sessionator/0.1.0) but it is incorrect.

### Get Session

#### Request:

Retrieve information about a Session, particularly a list of namespaces associated with the session.

```
GET /v1/sessions/{session_id}
```

#### Response:

```json
{
  "_session": "{session_id}",
  "_namespaces": [
    "lastSeen",
    "favoriteThings"
  ]
}
```

### Delete Session

Deletes a session and all of the namespacecs associated with the session.

#### Request:

```
DELETE /v1/sessions/{session_id}
```

#### Response (200):

```json
{
  "removed": 1
}
```

### Get Namespace

Gets information about a single namespace. Namespace data includes some metadata.

#### Request:

```
GET /v1/sessions/{session_id}/{namespace}
```

#### Response (200):

```json
{
  "_session": "user-1337",
  "_namespace": "favoriteThings",
  "_modified": "2017-03-26T23:14:10.617Z",
  "things": [
    "cats",
    "dogs"
  ]
}
```

### Get Namespaces

Retrieve data from multiple namespaces for the same Session.

#### Request:

```
GET /v1/sessions/{session_id}?namespaces={namespace1}&namespaces={namespace2}
```

#### Response (200):

```json
{
  "_session": "user-1337",
  "_namespaces": [ "favoriteThings", "lastSeen", "somethingElse" ],
  "favoriteThings": {
    "things": [ "cats", "dogs" ],
    "_session": "user-1337",
    "_namespace": "favoriteThings",
    "_modified": "2017-03-26T23:14:10.617Z"
  },
  "lastSeen": {
    "when": "2017-03-26T15:25:25Z",
    "_session": "user-1337",
    "_namespace": "lastSeen",
    "_modified": "2017-03-26T23:13:44.095Z"
  }
}
```

### Set Namespace

Sets (creates or replaces) an entire Session Namespace. (Currently it is not possible to set individual properties)

#### Request:

```
PUT /v1/sessions/{session_id}/{namespace}
```

```json
{
  "things": [
    "cats",
    "dogs"
  ]
}
```

#### Response (200):

```json
{
  "_session": "user-1337",
  "_namespace": "favoriteThings",
  "_modified": "2017-03-26T23:14:10.617Z",
  "things": [
    "cats",
    "dogs"
  ]
}
```

### Delete Namespace

Deletes a single Namespace from a Session.

#### Request:

```
DELETE /v1/sessions/{session_id}/{namespace}
```

#### Response (200):

```json
{
  "success": true
}
```

## Example Schema

Schema names are based on their filenames.
If this file is `schemas/teamName.objectType.v1.yaml` then the schema name is `teamName.objectType.v1`.

```yaml
type: object
allowUnknown: true
properties:
  name:
    type: string
    min: 1
    max: 100
  age:
    type: integer
    min: 0
    max: 120
  height:
    type: number
    min: 0.0
    max: 200.0
  friends:
    type: array
    items:
      type: object
      allowUnknown: false
      properties:
        name:
          type: string
        age:
          type: integer
  cool:
    type: boolean
    optional: true
  language:
    type: string
    enum:
    - en-US
    - en-GB
    - de-DE
  pet:
    type: object
    allowUnknown: false
    properties:
      name:
        type: string
      species:
        type: string
        enum:
        - cat
        - dog
        - fish
```

## Long Term Goals

* Project shouldn't require Schemas to exist within the same repository
* Allow hotloading of new Schemas
* Allow for atomic updates on a per-key basis (would require ReJSON module)
* Port from Node to Go
* Allow refferential schemas (e.g. object of type "User")
