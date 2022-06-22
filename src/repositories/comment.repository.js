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

const findOneCommentAndDelete = async (query, options) => {
    try {
        return await Comment.findOneAndDelete(query, options)
    } catch (err) {
        return err
    }
}

const createNewComment = async (newComment) => {
    try {
        const comment = await new Comment(newComment).save()
        comment.id = comment._id
        return await comment.save()
    } catch (err) {
        return err
    }
}

module.exports = {
    updateManyComments,
    findManyComments,
    findOneCommentAndDelete,
    createNewComment,
}
