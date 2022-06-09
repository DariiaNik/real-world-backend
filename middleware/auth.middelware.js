const db = require('../models');
const User = db.user;

checkUserExist = async (req, res, next) => {
  try {
    let email = await User.findOne({ email: req.body.user.email });
    let username = await User.findOne({ username: req.body.user.username });
    if (email || username) {
      res.status(409).send({ message: `Failed, ${username ? 'username' : 'email'} already exists` });
      return;
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

module.exports = { checkUserExist };
