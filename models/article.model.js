const mongoose = require('mongoose');

const Article = mongoose.model(
  'Article',
  new mongoose.Schema({
    slug: String,
    title: String,
    description: String,
    body: String,
    tagList: [String],
    createdAt: String,
    updatedAt: String,
    favoritedBy: [String],
    favoritesCount: Number,
    author: {
      username: String,
      bio: String,
      image: String,
    },
  })
);

module.exports = Article;
