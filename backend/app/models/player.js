const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Team = require('./team');

const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_player: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Player.belongsTo(Team, {foreignKey: 'id_team'});

module.exports = Player;