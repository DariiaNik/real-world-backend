const {findOneUser} = require('../services/user.service')
const {
    createNewArticle,
    getAllTags,
    findManyArticles,
    CountArticles,
    findOneArticlebySlug,
    findOneArticleAndDelete,
    findOneArticleAndUpdate,
} = require('../services/article.service')

const getAllArticles = async (req, res) => {
    try {
        const id = res.locals.token
        const query = {}
        if (req.query.tag && req.query.tag.length > 1) {
            query.tagList = {$in: req.query.tag}
        }
        if (req.query.author && req.query.author.length > 1) {
            query['author.username'] = req.query.author
        }
        if (req.query.favorited && req.query.favorited.length > 1) {
            const user = await findOneUser({username: req.query.favorited})
            query.favoritedBy = user._id.toString()
        }
        let articles = await findManyArticles(query, {_id: 0, __v: 0}, req.query)
        let count = await CountArticles(query)
        let result = articles.map((item) => ({
            ...item._doc,
            favorited: item.favoritedBy.includes(id),
        }))
        res.status(200).send({
            articles: result,
            articlesCount: count,
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const getArticleBySlug = async (req, res) => {
    try {
        let id = res.locals.token
        let article = await findOneArticlebySlug({slug: req.params.slug}, {_id: 0, __v: 0})
        let user = await findOneUser({username: article.author.username})
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
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const getFeedArticles = async (req, res) => {
    try {
        let id = res.locals.token
        let user = await findOneUser({
            followingBy: {$in: id},
        })
        let query = {
            'author.username': user.username,
        }
        let count = await CountArticles(query)
        let articles = await findManyArticles(query, {_id: 0, __v: 0}, req.query)
        let editArticles = articles.map((item) => ({
            ...item._doc,
            favorited: item.favoritedBy.includes(id),
        }))
        res.status(200).send({
            articles: editArticles,
            articlesCount: count,
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const createArticle = async (req, res) => {
    try {
        let id = res.locals.token
        let user = await findOneUser({_id: id})
        let article = await createNewArticle(req.body.article, user)
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
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const deleteArticle = async (req, res) => {
    try {
        await findOneArticleAndDelete({slug: req.params.slug})
        res.status(200).send({message: 'Article was deleted successfuly'})
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const updateArticle = async (req, res) => {
    try {
        let article = await findOneArticleAndUpdate(
            {slug: req.params.slug},
            {
                slug: req.body.article.title.split(' ').join('-'),
                title: req.body.article.title,
                description: req.body.article.description,
                body: req.body.article.body,
                tagList: req.body.article.tagList,
                updatedAt: new Date().toISOString(),
            },
            {new: true}
        )
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
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const favoriteArticle = async (req, res) => {
    try {
        let id = res.locals.token
        let article = await findOneArticleAndUpdate(
            {slug: req.params.slug},
            {
                $push: {favoritedBy: id},
                $inc: {favoritesCount: +1},
            },
            {new: true}
        )
        article.favorited = article.favoritedBy.includes(id)
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
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const unFavoriteArticle = async (req, res) => {
    try {
        let id = res.locals.token
        let article = await findOneArticleAndUpdate(
            {slug: req.params.slug},
            {
                $pull: {favoritedBy: id},
                $inc: {favoritesCount: -1},
            },
            {new: true}
        )
        article.favorited = article.favoritedBy.includes(id)
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
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const getTags = async (req, res) => {
    try {
        let tags = await getAllTags('tagList')
        res.status(200).send({tags})
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
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
