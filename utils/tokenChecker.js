const jwt = require('jsonwebtoken')
const config = require('../config/auth.config');
const db = require('../models/index');
const User = db.user;

const tokenChecker = async (req,res,next) => {
  let token = req.body.token || req.query.token || req.headers['authorization']
  // decode token
  if (token) {
    splitToken = token.split(" ");
    if (splitToken[0] === "Bearer") {
      token = splitToken[1];
      // verifies secret and checks exp
      jwt.verify(token, config.secret, function(err, decoded) {
          if (err) {
              return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
          }
        req.session.decoded = decoded;
        next();
      });
    } else {
        return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
    }
  } else {
    // if there is no token
    // return an error
    if (process.env.TEST === "true") {
      let decoded = {
        sub: "100789466124934033903",
        email: "quentin.vedrenne74@gmail.com",
        username: "Quentin Vedrenne",
        provider: "google",
      }
      req.session.decoded = decoded
      next();
    } else {
      return res.status(401).send({
          "error": true,
          "message": 'No token provided.'
      });
    }
  
  }
}

const tokenCheckerUrl = async (req, res, next) => {
  try {
    if (req.params && req.params.token) {
      jwt.verify(req.params.token, config.secret, function(err, decoded) {
        if (err)
          return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        req.session.decoded = decoded;
        next();
      });
    } else {
      return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
    }
  } catch (err) {
    return res.status(401).send({
      "error": true,
      "message": 'No token provided.'
    });
  }
}

module.exports = {tokenChecker, tokenCheckerUrl}