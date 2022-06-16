const {
    getAllArticles,
    getArticleBySlug,
    createArticle,
    deleteArticle,
    updateArticle,
    favoriteArticle,
    unFavoriteArticle,
    getFeedArticles,
    getTags,
} = require('../controller/article.controller')
const {createComment, getComments, deleteComment} = require('../controller/comments.controller')
const {checkArticleTitleExist} = require('../middleware/article.middelware')
const {verifyToken} = require('../middleware/token.middelware')
const {decodedToken} = require('../middleware/decoded.middelware')

module.exports = (app) => {
    app.get('/articles', [decodedToken], getAllArticles)
    app.get('/articles/:slug', [decodedToken], getArticleBySlug)

    app.post('/articles', [verifyToken, checkArticleTitleExist], createArticle)
    app.delete('/articles/:slug', [verifyToken], deleteArticle)
    app.put('/articles/:slug', [verifyToken, checkArticleTitleExist], updateArticle)

    app.post('/articles/:slug/favorite', [verifyToken], favoriteArticle)
    app.delete('/articles/:slug/favorite', [verifyToken], unFavoriteArticle)

    app.get('/articles/:slug/comments', [verifyToken], getComments)
    app.post('/articles/:slug/comments', [verifyToken], createComment)
    app.delete('/articles/:slug/comments/:id', [verifyToken], deleteComment)

    app.get('/tags', getTags)

    app.get('/feed', [verifyToken], getFeedArticles)
}
