const sequelize = require('./db');
const Session = require('../data-models/session');
const Player = require('../data-models/player');
const Team = require('../data-models/team');

async function syncDatabase() {
    try {
      await sequelize.sync(); // Usa force: true para recrear las tablas en cada reinicio (¡ten cuidado en producción!)
      console.log('Tables sync successfully');
    } catch (error) {
      console.error('Error to sync tables:', error);
    }
  }

module.exports = syncDatabase;