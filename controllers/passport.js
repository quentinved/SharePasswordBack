const config = require("../config/auth.config");
const passport = require("passport");
const refresh = require("passport-oauth2-refresh");

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;

const {handleOauthConnection} = require('../process/Oauth/index');

// Google Strategy
const googleStrategy = new GoogleStrategy(
  {
    clientID: config.GOOGLE.clientID,
    clientSecret: config.GOOGLE.clientSecret,
    callbackURL: config.GOOGLE.callbackURL,
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const userCreate = {
      userId: profile.id,
      email: profile._json.email,
      username: profile.displayName,
      provider: profile.provider,
      avatarUrl: profile._json.picture,
    };
    console.log("GOOGLE CO: ", accessToken, refreshToken, profile);
    return await handleOauthConnection("google", req.session, userCreate, accessToken, refreshToken, null, profile, done);
  }
);
passport.use(googleStrategy);
refresh.use(googleStrategy);

const facebookStrategy = new FacebookStrategy(
  {
    clientID: config.FACEBOOK.clientID,
    clientSecret: config.FACEBOOK.clientSecret,
    callbackURL: config.FACEBOOK.callbackURL,
    profileFields: ["id", "displayName", "photos", "email"],
    passReqToCallback: true,
    enableProof: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const userCreate = {
      userId: profile.id,
      email: profile._json.email,
      username: profile._json.name,
      provider: profile.provider,
      avatarUrl: profile._json.picture.data.url,
    };
    return await handleOauthConnection("facebook", req.session, userCreate, accessToken, refreshToken, null, profile, done);
  }
);
passport.use(facebookStrategy);
refresh.use(facebookStrategy);

const gitHubStrategy = new GitHubStrategy(
  {
    clientID: config.GITHUB.clientID,
    clientSecret: config.GITHUB.clientSecret,
    callbackURL: config.GITHUB.callbackUrl,
    scope: ["user:email"],
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const userCreate = {
      userId: profile.id,
      email: profile._json.email,
      username: profile.username,
      provider: profile.provider,
      avatarUrl: profile._json.avatar_url,
    };
    return await handleOauthConnection("github", req.session, userCreate, accessToken, refreshToken, null, profile, done);
  }
);
passport.use(gitHubStrategy)
refresh.use(gitHubStrategy);

const twitterStrategy = new TwitterStrategy(
  {
    consumerKey: config.TWITTER.clientID,
    consumerSecret: config.TWITTER.clientSecret,
    callbackURL: config.TWITTER.callbackUrl,
    passReqToCallback: true,
  },
  async (req, token, tokenSecret, profile, cb) => {
    const userCreate = {
      userId: profile._json.id_str,
      email: profile._json.email,
      username: profile.username,
      provider: profile.provider,
      avatarUrl: profile._json.profile_image_url,
    }
    return await handleOauthConnection("twitter", req.session, userCreate, token, null, tokenSecret, profile, cb)
  }
)

passport.use(twitterStrategy)

module.exports.refreshAccessToken = (context, provider) => {
  return new Promise(resolve => {
    refresh.requestNewAccessToken(provider, context.refreshToken, async (err, accessToken, refreshToken) => {
        console.log("access token: ", accessToken, " err: ", err, " refresh token: ", refreshToken);
        if (!err && accessToken) {
            newAccessToken = accessToken;
            await context.update({accessToken: accessToken});
            resolve(newAccessToken);
        } else {
            console.log("getAccessToken: error: ", err);
            resolve({error: true, message: "Error access token refresh", err});
        }
    })
  });
}