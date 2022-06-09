const db = require('../models');
const jwt = require('jsonwebtoken');
const Comment = db.comments;
const User = db.user;

getComments = async (req, res) => {
  try {
    let comments = await Comment.find({ slug: req.params.slug }, { _id: 0, slug: 0, __v: 0 }).exec();
    res.status(200).send({ comments: comments });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

createComment = async (req, res) => {
  try {
    let token = req.headers['x-access-token'];
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({ _id: decoded.id }).exec();
    let newComment = await new Comment({
      id: null,
      slug: req.params.slug,
      body: req.body.comment.body,
      createdAt: new Date().toISOString(),
    }).save();

    newComment.id = newComment._id;
    newComment.author = {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: user.following,
    };
    await newComment.save();

    res.status(200).send({ newComment });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

deleteComment = async (req, res) => {
  try {
    await Comment.findOneAndDelete({ slug: req.params.slug, id: req.params.id }).exec();
    res.status(200).send({ message: 'Comment was deleted successfuly' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
};
