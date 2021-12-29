const getUserUuidByProvider = async function(providerId) {
    const db = require('../models/index');
    const Provider = db.provider;

   let provider = await Provider.findOne({where: {id: providerId}})
   return provider.userUuid;
}

module.exports = {getUserUuidByProvider};