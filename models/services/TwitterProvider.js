const twitterAPI = require("../../api/twitter");
const hmacsha1 = require("hmacsha1")
const config = require("../../config/auth.config");
var Twit = require('twit')
// https://developer.twitter.com/en/docs/authentication/oauth-1-0a/authorizing-a-request


module.exports.createTweet = async function(provider, query) {
  console.log("twitter service post tweet,", provider.scope, query);
  if (provider.scope === 'TWITTER') {
    try {
        var T = new Twit({
          consumer_key:         config.TWITTER.clientID,
          consumer_secret:      config.TWITTER.clientSecret,
          access_token:         await provider.getAccessToken(),
          access_token_secret:  provider.tokenSecret,
          timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
          strictSSL:            true,     // optional - requires SSL certificates to be valid.
        })
        return new Promise(resolve => {T.post('statuses/update', query)
          .then(function (res) {
            resolve(res.data)
          })
          .catch(function (err) {
            resolve({
              error: true,
              message: "Can't post tweet",
              err
            })
          })
        })
      } catch (err) {
        return {
          error: true,
          message: "Can't post tweet",
          err
        };
      }
    } else {
      return {error: true, message: "Invalid Scope !"};
    }
  };
  
  module.exports.getMentions = async function(provider) {
    console.log("twitter service get user mentions,", provider.scope);
    if (provider.scope === 'TWITTER') {
      try {
        var T = new Twit({
          consumer_key:         config.TWITTER.clientID,
          consumer_secret:      config.TWITTER.clientSecret,
          access_token:         await provider.getAccessToken(),
          access_token_secret:  provider.tokenSecret,
          timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
          strictSSL:            true,     // optional - requires SSL certificates to be valid.
        })
        return new Promise(resolve => {T.get('statuses/mentions_timeline', {count: 100})
        .then(function (res) {
          resolve(res.data)
          })
          .catch(function (err) {
            resolve({
              error: true,
              message: "Can't get mentions",
              err
            })
          })
        })
      } catch (err) {
        return {
          error: true,
          message: "Can't get mentions",
          err
        };
      }
    } else {
      return {error: true, message: "Invalid Scope !"};
    }
  };






  // let access_token = await provider.getAccessToken()
  // let nonce = "kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg"
  // let date = Date.now()
  // let string_to_sign = "POST&" + encodeURIComponent(twitterAPI.api.defaults.baseURL + "statuses/update.json") + "&"
  //                + encodeURIComponent("oauth_consumer_key=" + config.TWITTER.clientID +
  //                                     "&oauth_nonce=" + nonce +
  //                                     "&oauth_signature_method=HMAC-SHA1" +
  //                                     "&oauth_token=" + access_token + 
  //                                     "&oauth_timestamp=" + date +
  //                                     "&oauth_version=1.0" +
  //                                     "&status=" + query.status)
  // let signin_key = config.TWITTER.clientSecret + "&" + provider.tokenSecret
  // let signature = hmacsha1(signin_key, string_to_sign)
  // console.log(string_to_sign, signin_key, signature)
  // const { data } = await twitterAPI.api.post(`/statuses/update.json`, {
  //   headers: {
  //     'Authorization': 
  //         'OAuth oauth_consumer_key="' + encodeURIComponent(config.TWITTER.clientID) + '"' +
  //         ', oauth_signature_method="HMAC-SHA1"' +
  //         ', oauth_timestamp="'+ encodeURIComponent(date.toString()) + '"' +
  //         ', oauth_nonce="'+ encodeURIComponent(nonce) + '"' +
  //         ', oauth_version="1.0"' +
  //         ', oauth_token="' + encodeURIComponent(access_token) + '"' +
  //         ', oauth_signature="'+ encodeURIComponent(signature) + '"'
  //   },
  //     params:
  //         query
  //   });
  // return data;