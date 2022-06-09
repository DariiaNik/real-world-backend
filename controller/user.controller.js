const db = require('../models');
const jwt = require('jsonwebtoken');
const User = db.user;
const Article = db.article;
const Comment = db.comments;

updateUser = async (req, res) => {
  try {
    let token = req.headers['x-access-token'];
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({ _id: decoded.id });
    await Article.updateMany(
      { 'author.username': user.username },
      {
        'author.username': req.body.user.username,
        'author.bio': req.body.user.bio,
        'author.image': req.body.user.image,
      },
      { new: true }
    );
    await Comment.updateMany(
      { 'author.username': user.username },
      {
        'author.username': req.body.user.username,
        'author.bio': req.body.user.bio,
        'author.image': req.body.user.image,
      }
    );
    let updateUser = await User.findOneAndUpdate(
      { _id: decoded.id },
      {
        email: req.body.user.email,
        username: req.body.user.username,
        image: req.body.user.image,
        bio: req.body.user.bio,
      },
      { new: true }
    );
    res.status(200).send({
      user: {
        username: updateUser.username,
        email: updateUser.email,
        bio: updateUser.bio,
        image: updateUser.image,
        token: token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

getUser = async (req, res) => {
  try {
    let token = req.headers['x-access-token'];
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({ _id: decoded.id });
    res.status(200).send({
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        image: user.image,
        token: token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

getProfile = async (req, res) => {
  try {
    let token = req.headers['x-access-token'];
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({ username: req.params.username });
    res.status(200).send({
      profile: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: user.followingBy.includes(decoded.id),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

followProfile = async (req, res) => {
  try {
    let token = req.headers['x-access-token'];
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOneAndUpdate(
      { username: req.params.username },
      {
        $push: { followingBy: decoded.id },
      },
      { new: true }
    );
    if (user) {
      res.status(200).send({
        profile: {
          username: user.username,
          bio: user.bio,
          image: user.image,
          following: user.following,
        },
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

unFollowProfile = async (req, res) => {
  try {
    let token = req.headers['x-access-token'];
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOneAndUpdate(
      { username: req.params.username },
      {
        $pull: { followingBy: decoded.id },
      },
      { new: true }
    );
    if (user) {
      res.status(200).send({
        profile: {
          username: user.username,
          bio: user.bio,
          image: user.image,
          following: user.following,
        },
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

module.exports = {
  updateUser,
  getUser,
  getProfile,
  followProfile,
  unFollowProfile,
};
