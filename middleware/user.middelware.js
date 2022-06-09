const db = require('../models');
const jwt = require('jsonwebtoken');
const User = db.user;

checkUserUpdateExist = async (req, res, next) => {
  try {
    let token = req.headers['x-access-token'];
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(decoded.id);
    if (user) {
      let email = await User.findOne({ email: req.body.user.email });
      let username = await User.findOne({ username: req.body.user.username });
      if (email) {
        if (decoded.id !== email._id.toString()) {
          res.status(400).send({ error: 'Failed, email already exists' });
          return;
        }
      }
      if (username) {
        if (decoded.id !== username._id.toString()) {
          res.status(400).send({ error: 'Failed, username already exists' });
          return;
        }
      }
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: new Error(err) });
  }
};

module.exports = { checkUserUpdateExist };
