# ablo-demo-be

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations

Databases that already existed before migrations were included should first run the query from `src/migrations/initial_fake.sql` against the database to create `migrations` table and insert the 'fake run' for Initial migration.

#### Generate one migration:

`npm run migration:generate ./src/db/migrations/NewMigrationName`

#### Run all migrations:

`npm run migration:run`

#### Revert last migration:

`npm run migration:revert`
