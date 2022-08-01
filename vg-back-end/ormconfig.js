require('dotenv/config');

module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  charset: 'utf8',
  driver: 'mysql',
  synchronize: false,
  entities: process.env.NODE_ENV !== 'production' ? ['**/**.entities.ts'] : ['dist/**/*.entities.js'],
  logging: process.env.NODE_ENV !== 'production' ? 'all' : 'error',
  migrations: ['src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations'
  },
  connectTimeout: 30000,
  acquireTimeout: 30000
};
