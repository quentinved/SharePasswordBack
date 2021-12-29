const passport = require("passport");
const { login, register } = require("../sequelize/User");
const db = require('../models/index');
const User = db.user;

let user = {};

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

module.exports.callback = async (req, res) => {
  // console.log("data: ", req.user);
  console.log("req headers: ", req.headers);
  let url;
  if (req.headers['user-agent'].indexOf('Mobile') !== -1) {
    console.log("Is mobile: ", process.env.HOST_MOBILE);
    if (req.session.scope === "service") {
      if (req.user.error) {
        url = `myapp://myapp.io/service?ok=false`;
      } else {
        url = `myapp://myapp.io/service?ok=true`;
      }
    } else if (req.session.scope === "signIn") {
      console.log("Connection: ", req.session.connection);
      if (req.user.error) {
        url = `myapp://myapp.io/signIn?token=null`;
      } else {
        url = `myapp://myapp.io/signIn?token=${req.session.connection.accessToken}`;
      }
    } else {
      url = `myapp://myapp.io/error`;
    }
    res.send(`
    <!DOCTYPE html> 
      <html> 
            
      <head> 
          <title> 
              Redirect Link
          </title> 
      </head> 
        
      <body>                 
          <a style="font-size:50px;" id="btn1" href="${url}">Redirect to app</a>
          <script type="text/javascript"> 
              // Simulate click function 
              function clickButton() {
                console.log("querySelector: ", document.querySelector('#btn1'));
                document.querySelector('#btn1').click(); 
              } 
              // Simulate a click every second 
              setTimeout(clickButton, 500); 
          </script> 
      </body><html>`)
  } else {
    console.log("bite", process.env.HOST_CLIENT)
    if (req.session.scope === "service") {
      if (req.user.error) {
        res.redirect(`${process.env.HOST_CLIENT}/services?ok=false`);
      } else {
        res.redirect(`${process.env.HOST_CLIENT}/services?ok=true`);
      }
    } else if (req.session.scope === "signIn") {
      if (req.user.error) {
        res.redirect(`${process.env.HOST_CLIENT}/login?token=null`);
      } else {
        res.redirect(`${process.env.HOST_CLIENT}/login?token=${req.session.connection.accessToken}`);
      }
    } else {
      res.redirect(`${process.env.HOST_CLIENT}/error`);
    }
  }
};

module.exports.login = async (req, res) => {
  const resp = await login(req.body, null);
  const { userData: userData, ...response } = resp;

  console.log("LOGIN LOGIN LOGIN LOGIN");
  if (response.error) {
    res.status(400).json(response);
  } else {
    req.session.connection = {
      accessToken: response.accessToken,
      id: userData.userId,
      provider: "none",
    }
    res.status(200).json(response);
  }
}

module.exports.register = async (req, res) => {
  const resp = await register(req.body, null);
  const { userData: userData, ...response } = resp;

  if (response.error) {
    return res.status(400).json(response);
  } else {
    req.session.connection = {
      accessToken: response.accessToken,
      id: userData.userId,
      provider: "none",
    }
    return res.status(200).json(response);
  }
}

module.exports.user = async (req, res) => {
  if (req.session.decoded) {
    let user = await User.findByPk(req.session.decoded.sub, {attributes: {exclude: ['password']}});
    return res.status(200).json(user.dataValues);
  }
  res.status(400).json({error: true, messge: "User not reachable"});
};

module.exports.isConnected = (req, res) => {
  let sess = req.session.connection;
  console.log("Session Is connected ? : ", req.session);
  if (req.session && req.session.connection) {
    if (sess.id && sess.accessToken && sess.provider) {
      return res.json({ connect: true, accessToken: sess.accessToken, provider: sess.provider });
    }
  }
  res.json({ connect: false });
};

module.exports.logout = (req, res) => {
  console.log("logging out!");
  user = {};
  let bool = req.session.decoded.provider === "none";
  if (req.session) {
    console.log("Destroy Session");
    req.session.destroy();
  }
  if (!bool)
    res.redirect(`${process.env.HOST_CLIENT}/`);
  else
    res.status(200).json({data: 'User is deconnected'});
};
