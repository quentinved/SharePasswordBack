const passport = require('passport');
const { tokenChecker } = require('../utils/tokenChecker.js');

module.exports = (app) => {
  const auth = require('../controllers/auth.controller')
  var router = require("express").Router({mergeParams: true});

  // // Route not secured
  router.post("/login", auth.login);
  router.post("/register", auth.register);

  router.get("/testConnected", tokenChecker, (req, res) => {
    res.status(200).json({message: 'se genre de conexion'})
  })

  router.get("/google", (req, res, next) => {
    req.session.scope = 'signIn';
    req.session.provider = 'GOOGLE';
    next();
  }, passport.authenticate("google",
    {
      accessType: 'offline',
      prompt: 'consent',
      scope: ["profile", "email"]
    }
  ));

  router.get("/google/callback", passport.authenticate("google"), auth.callback);

  router.get("/facebook", (req, res, next) => {
    req.session.scope = 'signIn';
    req.session.provider = 'FACEBOOK';
    next();
  }, passport.authenticate("facebook"));
  router.get("/facebook/callback", passport.authenticate("facebook"), auth.callback);

  router.get('/github', (req, res, next) => {
    req.session.scope = 'signIn';
    req.session.provider = 'GITHUB';
    next();
  },  passport.authenticate('github', { scope: [ 'user:email', 'repo' ] }));
  router.get('/github/callback', passport.authenticate('github', { failureRedirect: `${process.env.HOST_CLIENT}/`}), auth.callback);

  router.get('/twitter', (req, res, next) => {
    req.session.scope = 'signIn';
    req.session.provider = 'TWITTER';
    next();
  },  passport.authenticate('twitter'));
  router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: `${process.env.HOST_CLIENT}/`}), auth.callback);

  router.get("/logout", auth.logout)
  router.get("/is-connected", auth.isConnected);
  router.get("/user", tokenChecker, auth.user);

  app.use("/auth", router);
};
