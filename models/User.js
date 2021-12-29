'use strict';
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    uuid: {
      type: Sequelize.UUID,
      primaryKey: true,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    provider: {
      type: Sequelize.STRING,
      defaultValue: "none",
    },
    avatarUrl: {
      type: Sequelize.STRING,
      defaultValue:
        "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png",
    },
  });

  return User;
};
