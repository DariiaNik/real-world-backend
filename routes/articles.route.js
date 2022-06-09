const { getAllArticles } = require('../controller/article.controller');
const { createComment } = require('../controller/comments.controller');
const { checkArticleExist } = require('../middleware/article.middelware');
const { verifyToken } = require('../middleware/token.middelware');

module.exports = (app) => {
  app.get('/articles', getAllArticles);
  app.get('/articles/:slug', getArticleBySlug);
  

  app.post('/articles', [checkArticleExist], createArticle);
  app.delete('/articles/:slug', deleteArticle);
  app.put('/articles/:slug', [checkArticleUpdateExist], updateArticle);

  app.post('/articles/:slug/favorite', [verifyToken], favoriteArticle);
  app.delete('/articles/:slug/favorite', unFavoriteArticle);

  app.get('/articles/:slug/comments', getComments);
  app.post('/articles/:slug/comments', createComment);
  app.delete('/articles/:slug/comments/:id', deleteComment);

  app.get('/tags', getTags);

  app.get('/feed', getFeedArticles);
};
