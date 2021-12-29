const handleOauthConnection = async (providerName, session, userCreate, accessToken, refreshToken, tokenSecret, profile, done) => {
    // ############################################################
    // Error due to nested import of function db = {} so undefined -> That is a very nasty solution but functionnal 
    const { findOrCreateUser } = require("../../sequelize/User");
    const db = require('../../models/index');
    const User = db.user;
    const Provider = db.provider;
    // ############################################################
    let user;
    let response;
    if (session.scope === "signIn") {
      response = await findOrCreateUser(userCreate, null);
      if (response.error) {
        return done(null, {error: true, message: 'Error during the sign In', err: User.error});
      }
      session.connection = {
        accessToken: response.accessToken,
        id: profile.id,
        provider: providerName,
      },
      user = await User.findByPk(profile.id);
    } else if (session.scope === "service") {
      user = await User.findByPk(session.decoded.sub);
    } else {
      return done(null, {error: true, message: 'Scope Not Found'});
    }
    return done(null, { accessToken, refreshToken, profile, response });
}

module.exports = {handleOauthConnection}