const {generateToken} = require('../utils/token');
const uuid = require('uuid');
const bcrypt = require("bcrypt");
const User = require('../models/index').user;

module.exports.findOrCreateUser = async (user, res) => {
  return await User.findOrCreate({
    where: {
      uuid: user.userId,
      provider: user.provider,
    },
    defaults: {
      uuid: user.userId,
      email: user.email,
      username: user.username,
      provider: user.provider,
      avatarUrl: user.avatarUrl,
    },
  })
    .then(async (userF, created) => {
      let response = generateToken(userF[0].dataValues);
      if (created && res) {
        return res.status(201).json(response);
      } else if (res) {
        return res.status(200).json(response);
      } else {
        console.log('Response Find or create: ', response);
        return response;
      }
    })
    .catch((err) => {
      if (res) {
        return res.status(400).json({error: true, message: "The user can't be added", err });
      } else {
        return { error: true, message: "The user can't be added" };
      }
    });
};

module.exports.findById = async (user, res) => {
  return await User.findOnce({
    where: {
      uuid: user.userId
    },
  })
    .then((user) => {
      if (user && res) {
        return res.status(200).json(user);
      } else {
        return user;
      }
    })
    .catch((err) => {
      if (res) {
        return res.status(400).json({ error: true, message: "The user can't be added", err });
      } else {
        return { error: true, message: "The user can't be added" };
      }
    });
};

module.exports.findByEmail = async (user, res) => {
  return await User.findOnce({
    where: {
      email: user.email
    }
  })
    .then((user) => {
      if (user && res) {
        return res.status(200).json(user);
      } else if (user && !res) {
        return user;
      } else if (!user && res) {
        return res.status(400).json({ error: true, message: "User not found !" });
      } else {
        return { error: true, message: "User not found !" };
      }
    })
    .catch((err) => {
      if (res) {
        return res.status(400).json({ error: true, message: "The user can't be added", err });
      } else {
        return { error: true, message: "The user can't be added" };
      }
    });
};

module.exports.register = async (data, res) => {
  const postData = data;
  const userData = {
    username: postData.username,
    email: postData.email,
    password: postData.password,
    provider: postData.provider,
  };

  return await User.findOne({
    where: {
      email: postData.email,
      provider: userData.provider,
    },
  })
  .then(async (user) => {
    if (!user) {
      const hash = bcrypt.hashSync(userData.password, 10);
      userData.password = hash;
      userData.uuid = uuid.v1();
      return await User.create(userData)
        .then((newUser) => {
          let response = generateToken(userData);
          if (res) {
            return res.status(201).json({...response, userData});
          } else {
            return {...response, userData};
          }
        })
        .catch((err) => {
          if (res) {
            return res.status(400).json({error: true, message: "Your account can't be created !", err});
          } else {
            return {error: true, message: "Your account can't be created !", err};
          }
        });
    } else {
      if (res) {
        return res.status(400).json({error: true, message: "User already exists !", err});
      } else {
        return {error: true, message: "User already exists !", err};
      }
    }
  })
  .catch((err) => {
    if (res) {
      return res.status(400).json({error: true, message: "User already exists !", err});
    } else {
      return {error: true, message: "User already exists !", err};
    }
  });
};

module.exports.login = async (data, res) => {
  const postData = data;
  const userData = {
    email: postData.email,
    password: postData.password,
    provider: postData.provider,
  };

  return await User.findOne({
    where: {
      email: userData.email,
      provider: userData.provider
    },
  }).then((user) => {
    if (user) {
      if (bcrypt.compareSync(userData.password, user.password)) {
        let response = generateToken(user);
        if (res) {
          return res.status(201).json({...response, userData: user});
        } else {
          return {...response, userData: user};
        }
      } else {
        if (res) {
          return res.status(400).json({error: true, message: "The password or the email is incorrect"});
        } else {
          return {error: true, message: "The password or the email is incorrect"};
        }
      }
    } else {
      if (res) {
        return res.status(400).json({error: true, message: "Error during your sign in !"});
      } else {
        return {error: true, message: "Error during your sign in !"};
      }   
    }
  }).catch((err) => {
    if (res) {
      return res.status(400).json({error: true, message: "Error was occured !", err});
    } else {
      return {error: true, message: "Error was occured !", err};
    }
  });
}
