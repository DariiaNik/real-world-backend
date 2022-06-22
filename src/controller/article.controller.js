const {
    getAllArticlesService,
    getArticleBySlugService,
    getFeedArticlesService,
    createArticleService,
    deleteArticleService,
    updateArticleService,
    favoriteArticleService,
    unFavoriteArticleService,
    getTagsService,
} = require('../services/article.service')

const getAllArticles = async (req, res) => {
    try {
        const id = res.locals.token
        const query = req.query
        const articles = await getAllArticlesService(id, query)
        res.status(200).send(articles)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const getArticleBySlug = async (req, res) => {
    try {
        const id = res.locals.token
        const slug = req.params.slug
        const article = await getArticleBySlugService(slug, id)
        res.status(200).send(article)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const getFeedArticles = async (req, res) => {
    try {
        const id = res.locals.token
        const query = req.query
        const articles = await getFeedArticlesService(id, query)
        res.status(200).send(articles)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const createArticle = async (req, res) => {
    try {
        const id = res.locals.token
        const reqArticle = req.body.article
        const article = await createArticleService(id, reqArticle)
        res.status(200).send(article)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const deleteArticle = async (req, res) => {
    try {
        const slug = req.params.slug
        const message = await deleteArticleService(slug)
        res.status(200).send(message)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const updateArticle = async (req, res) => {
    try {
        const slug = req.params.slug
        const reqArticle = req.body.article
        const article = await updateArticleService(slug, reqArticle)
        res.status(200).send(article)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const favoriteArticle = async (req, res) => {
    try {
        const id = res.locals.token
        const slug = req.params.slug
        const article = await favoriteArticleService(slug, id)
        res.status(200).send(article)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const unFavoriteArticle = async (req, res) => {
    try {
        const id = res.locals.token
        const slug = req.params.slug
        const article = await unFavoriteArticleService(slug, id)
        res.status(200).send(article)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const getTags = async (req, res) => {
    try {
        const tags = await getTagsService()
        res.status(200).send(tags)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports = {
    getAllArticles,
    getArticleBySlug,
    getFeedArticles,
    createArticle,
    deleteArticle,
    updateArticle,
    unFavoriteArticle,
    favoriteArticle,
    getTags,
}
