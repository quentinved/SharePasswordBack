'use strict';
module.exports = (sequelize, Sequelize) => {
  const Password = sequelize.define("password", {
    uuid: {
      type: Sequelize.UUID,
      primaryKey: true,
      unique: true,
    },
    password: {
      type: Sequelize.JSON,
      defaultValue: null,
    },
    expire: {
      type: Sequelize.BIGINT(20),
      defaultValue: null,
    },
  });

  return Password;
};
