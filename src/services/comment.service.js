const db = require('../models')
const Comment = db.comments

const updateManyComments = async (query, update, options) => {
    try {
        return await Comment.updateMany(query, update, options)
    } catch (err) {
        return err
    }
}

const findManyComments = async (query, options) => {
    try {
        return await Comment.find(query, options)
    } catch (err) {
        return err
    }
}

const findOneComment = async (query, options) => {
    try {
        return await Comment.findOne(query, options)
    } catch (err) {
        return err
    }
}

const findOneCommentAndDelete = async (query, options) => {
    try {
        return await Comment.findOneAndDelete(query, options)
    } catch (err) {
        return err
    }
}

const createNewComment = async (slug, body, user) => {
    try {
        let comment = await await new Comment({
            id: null,
            slug: slug,
            body: body,
            createdAt: new Date().toISOString(),
        }).save()
        comment.id = comment._id
        comment.author = {
            username: user.username,
            bio: user.bio,
            image: user.image,
            following: user.following,
        }
        return await comment.save()
    } catch (err) {
        return err
    }
}

module.exports = {
    updateManyComments,
    findManyComments,
    findOneComment,
    findOneCommentAndDelete,
    createNewComment,
}
