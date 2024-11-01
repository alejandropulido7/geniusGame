const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: process.env.DATABASE_DIALECT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // disable this if the SSL certificate is self-signed
    }
  }
});

module.exports = sequelize;