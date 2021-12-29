const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const db = require('./models/index')
// const passwordCron = require("./utils/passwordCron")
const cron = require("node-cron")
const {cronPassword} = require("./sequelize/Password");

var corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8081", "http://127.0.0.1:8081", "https://sharepassword.quentinvedrenne.fr"],
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(
  session({
    secret: "secret$%^134",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie
      maxAge: 1000 * 60 * 60 * 24 * 360, // session max age in miliseconds
    },
  })
);
require('dotenv').config()

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    db.sequelize.sync({force: false}).then(() => {
      console.log("Syncronisation de la base de données")
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// app.use(passport.session());

console.log("quentin", process.env.HOST )
// CRON WORK
cron.schedule('*/10 * * * * *', function() {
  console.log('runninddg a task every minute');
  cronPassword(Date.now());
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to fastpassword backend." });
});

require('./controllers/passport');

// Routes
require("./routes/auth.routes.js")(app);
require("./routes/password.routes.js")(app);

var publicdir = './utils' + '/';
app.get('/about.json', function (req, res) {  
  let rawdata = fs.readFileSync(path.resolve(publicdir, 'about.json'));
  let about = JSON.parse(rawdata);
  about["client"]["host"] = req.headers.host;
  about["server"]["current_time"] = parseInt(new Date().getTime() / 1000);
  res.status(200).json(about);
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});