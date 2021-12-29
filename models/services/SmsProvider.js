const smsAPI = require("../../api/sms");
const config = require("../../config/auth.config")
var messagebird = require('messagebird')(config.SMS.clientID);


module.exports.sendSms = async function (scope, number, message) {
  if (scope === "SMS") {
    try {
        var params = {
            'originator': number,
            'recipients': [
              number
            ],
            'body': message
          };
        return new Promise(resolve => {messagebird.messages.create(params, function (err, response) {
            if (err) {
              resolve(err)
            }
            resolve(response);
          });
        })
    } catch (err) {
      return { error: true, message: "Can't send sms", err };
    }
  } else {
    return { error: true, message: "Invalid Scope !" };
  }
};