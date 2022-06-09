const db = require('../models');
const jwt = require('jsonwebtoken');

verifyToken = async (req, res, next) => {
  try {
    let token = req.headers['x-access-token'];
    if (!token) {
      return res.status(403).send({ error: 'No token provider' });
    }
    jwt.verify(token, process.env.JWT_SECRET, {
      expiresIn: 6000,
    });
  } catch (err) {
    console.error(err);
    res.status(401).send({ error: 'Unauthorize' });
  }
  next();
};

module.exports = {
  verifyToken,
};
