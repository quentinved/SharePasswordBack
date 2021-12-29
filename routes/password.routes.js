
module.exports = (app) => {
  const password = require('../controllers/password.controller')
  var router = require("express").Router({mergeParams: true});

  // Route not secured
  router.post("/create", password.create);
  router.get("/:uuid", password.get);

  app.use("/password", router);
};
