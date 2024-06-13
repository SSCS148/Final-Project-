const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mydatabaseProject', 'myuser', 'sacha1234', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false // Désactivez la journalisation SQL si nécessaire
});

module.exports = sequelize;