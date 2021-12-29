const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const modelUserToken = (user) => {
  let newObject = {
    sub: user.uuid,
    email: user.email,
    username: user.username,
    provider: user.provider,
  };
  return newObject;
};

const generateToken = (user) => {
  console.log("generate token user: ", user);
  const userToken = modelUserToken(user);
  const token = jwt.sign(userToken, config.secret, {
    expiresIn: config.tokenLife,
  });
  const response = {
    status: "Logged in",
    accessToken: token,
  };
  return response;
};

module.exports = { generateToken, modelUserToken };
