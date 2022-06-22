const {
    findManyComments,
    findOneCommentAndDelete,
    createNewComment,
} = require('../repositories/comment.repository')
const {findOneUser} = require('../repositories/user.repository')

const getCommentsService = async (slug) => {
    try {
        const comments = await findManyComments({slug: slug}, {_id: 0, slug: 0, __v: 0})
        return {comments: comments}
    } catch (err) {
        throw new Error(err)
    }
}
const deleteCommentService = async (slug, id) => {
    try {
        await findOneCommentAndDelete({
            slug: slug,
            id: id,
        })
        return {message: 'Comment was deleted successfuly'}
    } catch (err) {
        throw new Error(err)
    }
}

const createCommentService = async (slug, body, id) => {
    try {
        const user = await findOneUser({_id: id})
        const comment = await createNewComment({
            id: null,
            slug: slug,
            body: body,
            createdAt: new Date().toISOString(),
            author: {
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: user.following,
            },
        })
        return comment
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = {getCommentsService, deleteCommentService, createCommentService}
