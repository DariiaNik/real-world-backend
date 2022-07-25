const {findOneUser, findUsers} = require('../repositories/user.repository')
const {
    createNewArticle,
    getAllTags,
    findManyArticles,
    CountArticles,
    findOneArticlebySlug,
    findOneArticleAndDelete,
    findOneArticleAndUpdate,
} = require('../repositories/article.repository')

const getAllArticlesService = async (id, reqQuery) => {
    try {
        const query = {}
        if (reqQuery.tag && reqQuery.tag.length > 1) {
            query.tagList = {$in: reqQuery.tag}
        }
        if (reqQuery.author && reqQuery.author.length > 1) {
            query['author.username'] = reqQuery.author
        }
        if (reqQuery.favorited && reqQuery.favorited.length > 1) {
            const user = await findOneUser({username: reqQuery.favorited})
            query.favoritedBy = user._id.toString()
        }

        const articles = await findManyArticles(query, {_id: 0, __v: 0}, reqQuery)
        const count = await CountArticles(query)
        const result = articles.map((item) => ({
            ...item._doc,
            favorited: item.favoritedBy.includes(id),
        }))
        return {
            articles: result,
            articlesCount: count,
        }
    } catch (err) {
        throw new Error(err)
    }
}
const getArticleBySlugService = async (slug, id) => {
    try {
        const article = await findOneArticlebySlug({slug: slug}, {_id: 0, __v: 0})
        const user = await findOneUser({username: article.author.username})
        return {
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
        }
    } catch (err) {
        throw new Error(err)
    }
}
const getFeedArticlesService = async (id, reqQuery) => {
    try {
        let usernames = []
        await findUsers({
            followingBy: {$in: id},
        }).then((users) => {
            users.forEach((user) => {
                usernames.push(user.username)
            })
        })
        const query = {
            'author.username': {$in: usernames},
        }
        const count = await CountArticles(query)
        const articles = await findManyArticles(query, {_id: 0, __v: 0}, reqQuery)
        const editArticles = articles.map((item) => ({
            ...item._doc,
            favorited: item.favoritedBy.includes(id),
        }))
        return {
            articles: editArticles,
            articlesCount: count,
        }
    } catch (err) {
        throw new Error(err)
    }
}
const createArticleService = async (id, reqArticle) => {
    try {
        const user = await findOneUser({_id: id})
        const article = await createNewArticle({
            slug: reqArticle.title.split(' ').join('-'),
            title: reqArticle.title,
            description: reqArticle.description,
            body: reqArticle.body,
            tagList: reqArticle.tagList,
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
        })
        return {
            article: article,
        }
    } catch (err) {
        throw new Error(err)
    }
}
const updateArticleService = async (slug, reqArticle) => {
    try {
        const article = await findOneArticleAndUpdate(
            {slug: slug},
            {
                slug: reqArticle.title.split(' ').join('-'),
                title: reqArticle.title,
                description: reqArticle.description,
                body: reqArticle.body,
                tagList: reqArticle.tagList,
                updatedAt: new Date().toISOString(),
            },
            {new: true}
        )
        return {
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
        }
    } catch (err) {
        throw new Error(err)
    }
}
const deleteArticleService = async (slug) => {
    try {
        await findOneArticleAndDelete({slug: slug})
        return {message: 'Article was deleted successfuly'}
    } catch (err) {
        throw new Error(err)
    }
}
const favoriteArticleService = async (slug, id) => {
    try {
        const article = await findOneArticleAndUpdate(
            {slug: slug},
            {
                $push: {favoritedBy: id},
                $inc: {favoritesCount: +1},
            },
            {new: true}
        )
        return {
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
                author: article.author,
            },
        }
    } catch (err) {
        throw new Error(err)
    }
}

const unFavoriteArticleService = async (slug, id) => {
    try {
        const article = await findOneArticleAndUpdate(
            {slug: slug},
            {
                $pull: {favoritedBy: id},
                $inc: {favoritesCount: -1},
            },
            {new: true}
        )
        return {
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
                author: article.author,
            },
        }
    } catch (err) {
        throw new Error(err)
    }
}

const getTagsService = async () => {
    try {
        const tags = await getAllTags('tagList')
        return {tags}
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = {
    getAllArticlesService,
    getArticleBySlugService,
    getFeedArticlesService,
    createArticleService,
    deleteArticleService,
    updateArticleService,
    favoriteArticleService,
    unFavoriteArticleService,
    getTagsService,
}
