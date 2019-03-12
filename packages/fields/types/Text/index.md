import { TheThing } from './thing';

# `Text` Field Type

## GraphQL

### Input Fields

`Password` fields at a `String` field to both create and update GraphQL Input types.

| Field name | Type     | Description            |
| ---------- | -------- | ---------------------- |
| `${path}`  | `String` | The value to be hashed |

### Output Fields

In normal usage, hash values should not be externally accessible.
As such `Password` fields do _not_ add a `String` output field.

| Field name       | Type      | Description                    |
| ---------------- | --------- | ------------------------------ |
| `${path}_is_set` | `Boolean` | Does this field contain a hash |

### Filters

| Field name       | Type      | Description                    |
| ---------------- | --------- | ------------------------------ |
| `${path}_is_set` | `Boolean` | Does this field contain a hash |

## Storage

<TheThing />
