const {
    findManyComments,
    findOneCommentAndDelete,
    createNewComment,
} = require('../services/comment.service')
const {findOneUser} = require('../services/user.service')

const getComments = async (req, res) => {
    try {
        let comments = await findManyComments({slug: req.params.slug}, {_id: 0, slug: 0, __v: 0})
        res.status(200).send({comments: comments})
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const createComment = async (req, res) => {
    try {
        let id = res.locals.token
        let user = await findOneUser({_id: id})
        let newComment = await createNewComment(req.params.slug, req.body.comment.body, user)
        res.status(200).send({newComment})
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const deleteComment = async (req, res) => {
    try {
        await findOneCommentAndDelete({
            slug: req.params.slug,
            id: req.params.id,
        })
        res.status(200).send({message: 'Comment was deleted successfuly'})
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

module.exports = {
    getComments,
    createComment,
    deleteComment,
}
