const {
    getCommentsService,
    deleteCommentService,
    createCommentService,
} = require('../services/comment.service')

const getComments = async (req, res) => {
    try {
        const slug = req.params.slug
        const comments = await getCommentsService(slug)
        res.status(200).send(comments)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const createComment = async (req, res) => {
    try {
        const id = res.locals.token
        const slug = req.params.slug
        const comment = req.body.comment.body
        const newComment = await createCommentService(slug, comment, id)
        res.status(200).send(newComment)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

const deleteComment = async (req, res) => {
    try {
        const id = req.params.id
        const slug = req.params.slug
        const message = await deleteCommentService(slug, id)
        res.status(200).send(message)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports = {
    getComments,
    createComment,
    deleteComment,
}
