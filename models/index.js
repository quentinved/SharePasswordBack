'use strict';
const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const { ForeignKeyConstraintError } = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.user = require("./User")(sequelize, Sequelize);
db.password = require("./Password")(sequelize, Sequelize);

const User = db.user;
const Password = db.password;

module.exports = db;
