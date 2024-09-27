const sequelize = require('./db');
const Session = require('../models/session');
const Player = require('../models/player');
const Team = require('../models/team');
const User = require('../models/user');

async function syncDatabase() {
    try {
      await sequelize.sync({
        // force: true, 
        logging: false}); // Usa force: true para recrear las tablas en cada reinicio (¡ten cuidado en producción!)
      console.log('Tables sync successfully');
    } catch (error) {
      console.error('Error to sync tables:', error);
    }
  }

module.exports = syncDatabase;