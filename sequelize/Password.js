const uuid = require('uuid');
const Password = require('../models/index').password;
const Crypto = require('../utils/crypto');

module.exports.cronPassword = async (time) => {
  const password = await Password.findAll();
  password.map(data => {
    if (data.expire <= time)
      Password.destroy({
        where: {
          uuid: data.uuid,
        }
      })
    console.log("data", data.expire)
  })
  // console.log("ok", password);
}

module.exports.create = async (data, res) => {
  const postData = data;
  const hash = Crypto.encrypt(postData.password);
  const time = Date.now() + (data.time * 60000);
  const passwordData = {
    password: hash,
    expire: time,
  };
  passwordData.uuid = uuid.v1();
  return await Password.create(passwordData)
    .then((result) => {
      if (res) {
        return res.status(201).json({ passwordData });
      } else {
        return { passwordData };
      }
    })
    .catch((err) => {
      if (res) {
        return res.status(400).json({ error: true, message: "Your password can't be share !", err });
      } else {
        return { error: true, message: "Your password can't be share !", err };
      }
    });
};

module.exports.getPassword = async (data, res) => {
  const uuid = data;
  return await Password.findOne({
    where: {
      uuid: uuid
    },
  })
    .then((result) => {
      if (result && res) {
        return res.status(200).json(result);
    } else {
      return { result };
    }
  })
    .catch((err) => {
      if (res) {
        return res.status(400).json({ error: true, message: "The Password can't be find", err });
      } else {
        return { error: true, message: "The Password can't be find" };
      }
    });
  // console.log("oui", passwordData)
};