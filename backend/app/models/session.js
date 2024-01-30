const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.TEXT,
    primaryKey: true,
  },
  idHost: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  min_to_answer: {
    type: DataTypes.INTEGER
  }
});

module.exports = Session;