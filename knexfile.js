var config = require("./tools/config");

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host:     config.host,
      database: config.database,
      user:     config.user,
      password: config.password,
      port:     config.port
    },
    pool: {
      min: 1,
      max: 20
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'pg',
    connection: {
      host:     config.host,
      database: config.database,
      user:     config.user,
      password: config.password,
      port:     config.port
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: {
      host:     config.host,
      database: config.database,
      user:     config.user,
      password: config.password,
      port:     config.port
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    },
    useNullAsDefault: true
  }

};
