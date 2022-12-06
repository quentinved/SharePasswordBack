const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require('express-session');
const db = require('./models/index')
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

// CRON WORK
cron.schedule('*/1 * * * * *', function() {
  console.log('//CRON// CLEAN PASSWORDS');
  cronPassword(Date.now());
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to fastpassword backend." });
});

// Routes
require("./routes/password.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});