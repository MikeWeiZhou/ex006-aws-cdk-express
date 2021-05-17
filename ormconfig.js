// Glob pattern of entities
let entitiesPath = `${__dirname}/dist/modules/*/*.model.js`;
if (process.env.NODE_ENV !== 'production') {
  entitiesPath = `${__dirname}/src/modules/*/*.model.ts`;
}

/**
 * TypeORM configuration.
 */
module.exports = {
  // Database
  type: 'mysql',
  host: process.env.EAR_DB_HOST,
  port: Number.parseInt(process.env.EAR_DB_PORT, 10),
  database: process.env.EAR_DB_NAME,
  username: process.env.EAR_DB_USER,
  password: process.env.EAR_DB_PASSWORD,
  charset: 'utf8mb4_unicode_ci',
  extra: {
    connectionLimit: 5,
  },

  entities: [entitiesPath],
};
