const db = require('../models')
const Article = db.article

const findOneArticlebySlug = async (query, options) => {
    try {
        return await Article.findOne(query, options)
    } catch (err) {
        return err
    }
}

const findManyArticles = async (query, options, reqQuery) => {
    try {
        return await Article.find(query, options).skip(reqQuery.offset).limit(reqQuery.limit)
    } catch (err) {
        return err
    }
}

const CountArticles = async (query) => {
    try {
        return await Article.find(query).count()
    } catch (err) {
        return err
    }
}

const findOneArticleAndDelete = async (query, options) => {
    try {
        return await Article.findOneAndDelete(query, options)
    } catch (err) {
        return err
    }
}

const findOneArticleAndUpdate = async (query, update, options) => {
    try {
        return await Article.findOneAndUpdate(query, update, options)
    } catch (err) {
        return err
    }
}

const updateManyArticles = async (query, update, options) => {
    try {
        return await Article.updateMany(query, update, options)
    } catch (err) {
        return err
    }
}

const getAllTags = async (query) => {
    try {
        return await Article.distinct(query)
    } catch (err) {
        return err
    }
}

const createNewArticle = async (article, user) => {
    try {
        return await new Article({
            slug: article.title.split(' ').join('-'),
            title: article.title,
            description: article.description,
            body: article.body,
            tagList: article.tagList,
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
        }).save()
    } catch (err) {
        return err
    }
}

module.exports = {
    updateManyArticles,
    findManyArticles,
    findOneArticlebySlug,
    CountArticles,
    findOneArticleAndDelete,
    findOneArticleAndUpdate,
    getAllTags,
    createNewArticle,
}
