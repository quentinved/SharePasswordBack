require('dotenv').config()
module.exports = {
  HOST: process.env.HOST,
  USER: process.env.NAME,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DATABASE,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
