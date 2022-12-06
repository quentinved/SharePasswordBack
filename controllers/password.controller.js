const { create, getPassword } = require("../sequelize/Password");

module.exports.create = async (req, res) => {
  const resp = await create(req.body, null);
  const { userData: userData, ...response } = resp;
  if (response.error) {
    res.status(400).json(response);
  } else {
    res.status(200).json(response);
  }
};

module.exports.get = async (req, res) => {
  
  const resp = await getPassword(req.params.uuid, null);
  const { userData: userData, ...response } = resp;
  if (response.error) {
    res.status(400).json(response);
  } else {
    res.status(200).json(response);
  }
}
