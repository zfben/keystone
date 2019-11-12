<!--[meta]
section: guides
title: Relationship Migration Guide
[meta]-->

# Relationship Migration Guide

In the 7.0.0 (FIXME) release of `@keystonejs/keystone`, `@keystonejs/adapter-knex` and `@keystone/adapter-mongoose` we [changed the database schema](/docs/discussions/new-data-schema.md) which Keystone uses to store its data.
This means that if you are upgrading to these new packages you will need to perform a migration on your database in order for it to continue working.

This document will help you understand the changes to the database schema, which will help you understand the migrations you need to perform.

We recommend familiarising yourself with the [relationships](/docs/discussions/relationships.md) documentation to make sure you understand the terminology used in this document.

## Overview

There are three steps to updating your database

1. Take a backup of your production database.
2. Identify the changes required for your system.
3. Apply the changes to your database.

The specifics of how to do each of these steps will depend on the particulars of your deployment.

## Database backup

It is vitally important that you take a backup of your database before performing any changes.
It is also crucial that you are able to restore your database if need be.

If you are managing your own database, please consult the documentation for your database.
If you are using a managed database, you should consult the documentation for your service, as they likely already provide systems for backing up and restoring your database.

### MongoDB

The [official MongoDB documentation](https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/) prodives details on how to use `mongodump` and `mongorestore` to backup and restore your database.

### PostgreSQL

The [official PostgreSQL documentation](https://www.postgresql.org/docs/12/backup.html) provides a number of different techniques for backing up and restoring your database.

## Identify required changes

The next step is to identify the changes you need to make to your database.
To assist with this you can use the command `keystone upgrade-relationships`
This tool will analyse your relationships and generate a summary of the changes you need to make in your database.

```bash
keystone upgrade-relationships
```

### MongoDB

```shell title=Output showLanguage=false allowCopy=false
ℹ Command: keystone upgrade-relationships
⠙  One-sided: one to many
  Todo.author -> User
    * No action required
One-sided: mamny to many
  Todo.reviewers -> User
    * Create a collection todo_reviewers_manies with fields Todo_left_id and User_right_id
    * Move the data from todos.reviewers into todo_reviewers_manies
    * Delete todos.reviewers
Two-sided: one to one
  Todo.leadAuthor -> User.leadPost
    * Delete users.leadPost
Two-sided: one to many
  Todo.publisher -> User.published
    * Remove users.published
Two-sided: many to many
  Todo.readers -> User.readPosts
    * Create a collection todo_readers_user_readposts with fields Todo_left_id and User_right_id
    * Move the data from todos.readers into todo_readers_user_readposts
    * Delete todos.readers
    * Delete users.readPosts
```

### PostgreSQL

```shell title=Output showLanguage=false allowCopy=false
ℹ Command: keystone upgrade-relationships
⠙  One-sided: one to many
  Todo.author -> User
    * No action required
One-sided: mamny to many
  Todo.reviewers -> User
    * Rename table Todo_reviewers to Todo_reviewers_many
    * Rename column Todo_id to Todo_left_id
    * Rename column User_id to User_right_id
Two-sided: one to one
  Todo.leadAuthor -> User.leadPost
    * Delete column User.leadPost
Two-sided: one to many
  Todo.publisher -> User.published
    * Drop table User_published
Two-sided: many to many
  Todo.readers -> User.readPosts
    * Drop table User_readPosts
    * Rename table Todo_readers to Todo_readers_User_readPosts
    * Rename column Todo_id to Todo_left_id
    * Rename column User_id to User_right_id
```

### Cheatsheet

If you want a handy reference to consult without needing to execute scripts then please consult the [new schema cheatsheet](/docs/guides/new-schema-cheatsheet.md).

## Apply changes

### MongoDB

### PostgreSQL
