const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres', // Puedes cambiarlo según tu base de datos
  username: 'admin',
  password: 'pass123',
  database: 'geniusGame',
  host: 'localhost', // Puedes cambiarlo según tu configuración
  port: 5430, // Puedes cambiarlo según tu configuración
});

module.exports = sequelize;