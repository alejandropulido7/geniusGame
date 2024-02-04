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
  },
  gameStarted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  turnOf: {
    type: DataTypes.TEXT
  },
  json_boardPositions: {
    type: DataTypes.TEXT
  }
});

module.exports = Session;