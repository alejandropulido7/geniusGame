const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Session = require('./session');

const Team = sequelize.define('Team', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name_team: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    avatar: {
        type: DataTypes.TEXT
    },
    players: {
        type: DataTypes.TEXT
    },
    flag_active: {
        type: DataTypes.TEXT
    },
    flags_obtained: {
        type: DataTypes.TEXT
    },
    prev_position: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    position_active: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    score_game: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.BOOLEAN
    }
});

Team.belongsTo(Session, {foreignKey: 'id_session'});

module.exports = Team;