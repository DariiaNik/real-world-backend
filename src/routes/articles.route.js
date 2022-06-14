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
const {checkArticleExist, checkArticleUpdateExist} = require('../middleware/article.middelware')
const {verifyToken} = require('../middleware/token.middelware')
const {decodedToken} = require('../middleware/decoded.middelware')

module.exports = (app) => {
    app.get('/articles', [decodedToken], getAllArticles)
    app.get('/articles/:slug', [decodedToken], getArticleBySlug)

    app.post('/articles', [verifyToken, decodedToken, checkArticleExist], createArticle)
    app.delete('/articles/:slug', [verifyToken], deleteArticle)
    app.put('/articles/:slug', [verifyToken, checkArticleUpdateExist], updateArticle)

    app.post('/articles/:slug/favorite', [verifyToken, decodedToken], favoriteArticle)
    app.delete('/articles/:slug/favorite', [verifyToken, decodedToken], unFavoriteArticle)

    app.get('/articles/:slug/comments', getComments)
    app.post('/articles/:slug/comments', [verifyToken, decodedToken], createComment)
    app.delete('/articles/:slug/comments/:id', [verifyToken], deleteComment)

    app.get('/tags', getTags)

    app.get('/feed', [verifyToken, decodedToken], getFeedArticles)
}
