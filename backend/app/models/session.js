const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

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
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lenght_board: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount_challenges: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  },
  challenge_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  challenge_name: {
    type: DataTypes.TEXT
  },
  challenge_participants: {
    type: DataTypes.TEXT
  },
  challenge_passed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

Session.belongsTo(User, {foreignKey: 'id_user'})

module.exports = Session;