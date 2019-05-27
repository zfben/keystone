<!--[meta]
section: field-types
title: Relationship
[meta]-->

# Relationship

## Nested Mutations

Nested Mutations allow you to manage relationships and related items within a
single mutation, enabling very powerful single-request mutations with a logical
nested syntax.

Let's say you've got these lists:

```javascript
keystone.createList('User', {
  fields: {
    name: { type: Text },
    posts: { type: Relationship, ref: 'Post', many: true },
    company: { type: Relationship, ref: 'Org' },
  },
});

keystone.createList('Post', {
  fields: {
    title: { type: Text },
  },
});

keystone.createList('Org', {
  fields: {
    name: { type: Text },
  },
});
```

The to-many (`User.posts`) and to-single (`User.company`) relationships can be
mutated as part of a mutation on items in the parent list (eg; during a
`createUser`, or `updateUser` mutation, etc).

The available nested mutations:

| Nested Mutation | to-single relationship                                                                                                                                 | to-many relationship                                                                                                                                      |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `create`        | Create a new item, and set it as the relation. The inverse of `delete`.<br/>_Note: the previously set item (if any) is **not** deleted._               | Create 1 or more new items, and append them to the list of related items.                                                                                 |
| `delete`        | Delete the related item, and set the relationship to `null` (if it matches the given filter). The inverse of `create`._                                | Filter for one or more items, delete them and remove them from the list of related items.                                                                 |
| `deleteAll`     | Delete the related item, and set the relationship to `null`. The inverse of `create`._                                                                 | Delete all related items and unset the list of related items (if any).                                                                                    |
| `connect`       | Filter for an item, and set it as the relation. The inverse of `disconnect`. <br/>_Note: the previously set item (if any) is **not** deleted._         | Filter for one or more items, and append them to the list of related items.                                                                               |
| `disconnect`    | Unset the relation (if any) if it matches the given filter. The inverse of `connect`.<br/>_Note: the previously set item (if any) is **not** deleted._ | Filter for one or more items, and unset them from the list of related items (if any). <br/>_Note: the previously set items (if any) are **not** deleted._ |
| `disconnectAll` | Unset the relation (if any). <br/>_Note: the previously set item (if any) is **not** deleted._                                                         | Unset the list of related items (if any). <br/>_Note: the previously set items (if any) are **not** deleted._                                             |

### Order of execution

Nested mutations are executed in the following order:

1. `deleteAll`
2. `delete`
1. `disconnectAll`
2. `disconnect`
3. `create`
4. `connect`

### Examples

#### Create and append a related item

Use the `create` nested mutation to create and append an item to a to-many
relationship:

<!-- prettier-ignore -->

```graphql
# Replace all posts of a given User
query replaceAllPosts {
  updateUser(
    where: { id: "abc123" },
    data: {
      posts: {
        create: { title: "Hello World" },
      }
    }
  ) {
    # Now has a new post appended with the title "Hello World"
    posts {
      id
    }
  }
}
```

#### Append an existing item

Use the `connect` nested mutation to append an existing item to a to-many
relationship:

<!-- prettier-ignore -->

```graphql
# Replace the company of a given User
query replaceAllPosts {
  updateUser(
    where: { id: "abc123" },
    data: {
      posts: {
        connect: { id: "def345" },
      }
    }
  ) {
    # Now has an existing post appended with the id "def345"
    posts {
      id
    }
  }
}
```

#### Overriding a to-single relationship

Using either `create` or `connect` nested mutations is sufficient to override
the value of a to-single relationship (it's not necessary to use `disconnectAll`
as is the case for [to-many relationships](#overriding-a-to-many-relationship)).

_NOTE: This **will not** delete the previously set item. See below for an example
which also deletes the item._

<!-- prettier-ignore -->

```graphql
# Replace the company of a given User
query replaceAllPosts {
  updateUser(
    where: { id: "abc123" },
    data: {
      company: {
        connect: { id: "def345" },
      }
    }
  ) {
    # Will now be the company with id "def345"
    company {
      id
    }
  }
}
```

To override _and delete_ the related item, use a combination of `deleteAll`
followed by `create` or `connect`:

<!-- prettier-ignore -->

```graphql
# Replace the company of a given User
query deleteAndReplaceAllPosts {
  updateUser(
    where: { id: "abc123" },
    data: {
      company: {
        deleteAll: true,
        connect: { id: "def345" },
      }
    }
  ) {
    # Will now be the company with id "def345"
    company {
      id
    }
  }
}
```

#### Overriding a to-many relationship

To completely replace the related items in a to-many list, you can perform a
`disconnectAll` nested mutation followed by a `create` or `connect` nested
mutation (thanks to the [order of execution](#order-of-execution)).

_NOTE: This **will not** delete the previously set items. See below for an example
which also deletes the items._

<!-- prettier-ignore -->

```graphql
# Replace all posts related to a given User
query replaceAllPosts {
  updateUser(
    where: { id: "abc123" },
    data: {
      posts: {
        disconnectAll: true,
        connect: [{ id: "def345" }, { id: "xyz789" }],
      }
    }
  ) {
    # Will now only contain posts with ids "def345" & "xyz789"
    posts {
      id
    }
  }
}
```

To override _and delete_ all related items, use a combination of `deleteAll`
followed by `create` or `connect`:

<!-- prettier-ignore -->

```graphql
# Replace all posts related to a given User
query deleteAndReplaceAllPosts {
  updateUser(
    where: { id: "abc123" },
    data: {
      posts: {
        deleteAll: true,
        connect: [{ id: "def345" }, { id: "xyz789" }],
      }
    }
  ) {
    # Will now only contain posts with ids "def345" & "xyz789"
    posts {
      id
    }
  }
}
```
