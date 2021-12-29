const { create, getPassword } = require("../sequelize/Password");

let user = {};

module.exports.create = async (req, res) => {
  const resp = await create(req.body, null);
  const { userData: userData, ...response } = resp;
  if (response.error) {
    res.status(400).json(response);
  } else {
    // req.session.connection = {
    //   accessToken: response.accessToken,
    //   id: userData.userId,
    //   provider: "none",
    // }
    res.status(200).json(response);
  }
};

module.exports.get = async (req, res) => {
  
  const resp = await getPassword(req.params.uuid, null);
  const { userData: userData, ...response } = resp;
  console.log(response)
  if (response.error) {
    res.status(400).json(response);
  } else {
    res.status(200).json(response);
  }
}
