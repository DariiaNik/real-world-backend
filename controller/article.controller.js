const db = require('../models');
const jwt = require('jsonwebtoken');
const Article = db.article;
const User = db.user;

async function getAuthor(token) {
  if (token) {
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.id;
    } catch (err) {
      console.error(err);
      res.status(401).send({ error: 'Unauthorized' });
    }
  }
}

getAllArticles = async (req, res) => {
  try {
    let token = req.headers['x-access-token'];
    let id = await getAuthor(token);
    let query = {};
    if (req.query.tag && req.query.tag.length > 1) {
      query.tagList = { $in: req.query.tag };
    }
    if (req.query.author && req.query.author.length > 1) {
      query['author.username'] = req.query.author;
    }
    if (req.query.favorited && req.query.favorited.length > 1) {
      let user = await User.findOne({ username: req.query.favorited });
      query.favoritedBy = user._id.toString();
    }
    let articles = await Article.find(query, { _id: 0, __v: 0 }).skip(req.query.offset).limit(req.query.limit);
    let count = await Article.find(query).count();
    let result = articles.map((item) => ({ ...item._doc, favorited: item.favoritedBy.includes(id) }));
    res.status(200).send({
      articles: result,
      articlesCount: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

getArticleBySlug = async (req, res) => {
  try {
    let token = req.headers['x-access-token'];
    let id = await getAuthor(token);
    let article = await Article.findOne({ slug: req.params.slug }, { _id: 0, __v: 0 });
    let user = await User.findOne({ username: article.author.username });
    res.status(200).send({
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: article.favoritedBy.includes(id),
        favoritesCount: article.favoritesCount,
        author: {
          username: user.username,
          bio: user.bio,
          image: user.image,
          following: user.followingBy.includes(id),
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

getFeedArticles = async (req, res) => {
  try {
    let token = req.headers['x-access-token'];
    let id = await getAuthor(token);
    let user = await User.findOne({
      followingBy: { $in: id },
    });
    let count = await Article.find(
      {
        'author.username': user.username,
      },
      { _id: 0, __v: 0 }
    ).count();
    let articles = await Article.find(
      {
        'author.username': user.username,
      },
      { _id: 0, __v: 0 }
    )
      .skip(req.query.offset)
      .limit(req.query.limit);
    let editArticles = articles.map((item) => ({ ...item._doc, favorited: item.favoritedBy.includes(id) }));

    res.status(200).send({
      articles: editArticles,
      articlesCount: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

createArticle = async (req, res) => {
  try {
    let token = req.headers['x-access-token'];
    let id = await getAuthor(token);
    let user = await User.findById(id);
    let article = await new Article({
      slug: req.body.article.title.split(' ').join('-'),
      title: req.body.article.title,
      description: req.body.article.description,
      body: req.body.article.body,
      tagList: req.body.article.tagList,
      favorited: false,
      favoritedBy: [],
      favoritesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        username: user.username,
        bio: user.bio,
        image: user.image,
      },
    }).save();
    res.status(200).send({
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: article.favorited,
        favoritesCount: article.favoritesCount,
        author: article.author,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

deleteArticle = async (req, res) => {
  try {
    await Article.findOneAndDelete({ slug: req.params.slug });
    res.status(200).send({ message: 'Article was deleted successfuly' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

updateArticle = async (req, res) => {
  try {
    let article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      {
        slug: req.body.article.title.split(' ').join('-'),
        title: req.body.article.title,
        description: req.body.article.description,
        body: req.body.article.body,
        tagList: req.body.article.tagList,
        updatedAt: new Date().toISOString(),
      },
      { new: true }
    );
    res.status(200).send({
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: article.favorited,
        favoritesCount: article.favoritesCount,
        author: article.author,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

favoriteArticle = async (req, res) => {
  try {
    let token = req.headers['x-access-token'];
    let id = await getAuthor(token);
    let article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      {
        $push: { favoritedBy: id },
        $inc: { favoritesCount: +1 },
      },
      { new: true }
    );
    article.favorited = article.favoritedBy.includes(id);
    res.status(200).send({
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: article.favorited,
        favoritesCount: article.favoritesCount,
        author: article.author,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

unFavoriteArticle = async (req, res) => {
  try {
    let token = req.headers['x-access-token'];
    let id = await getAuthor(token);
    let article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      {
        $pull: { favoritedBy: id },
        $inc: { favoritesCount: -1 },
      },
      { new: true }
    );
    article.favorited = article.favoritedBy.includes(id);
    res.status(200).send({
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: article.favorited,
        favoritesCount: article.favoritesCount,
        author: article.author,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

getTags = async (req, res) => {
  try {
    let tags = await Article.distinct('tagList');
    res.status(200).send({ tags });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
};

module.exports = {
  getAllArticles,
  getFeedArticles,
  createArticle,
  deleteArticle,
  updateArticle,
  unFavoriteArticle,
  favoriteArticle,
  getTags,
};
