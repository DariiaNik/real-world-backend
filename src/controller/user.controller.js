const {findOneUser, findOneUserAndUpdate} = require('../services/user.service')
const {updateManyArticles} = require('../services/article.service')
const {updateManyComments} = require('../services/comment.service')

const updateUser = async (req, res) => {
    try {
        let token = req.headers['x-access-token']
        let id = res.locals.token
        let user = await findOneUser({id: id})
        let update = {
            'author.username': req.body.user.username,
            'author.bio': req.body.user.bio,
            'author.image': req.body.user.image,
        }
        await updateManyArticles({'author.username': user.username}, update)
        await updateManyComments({'author.username': user.username}, update)
        let updateUser = await findOneUserAndUpdate(
            {_id: id},
            {
                email: req.body.user.email,
                username: req.body.user.username,
                image: req.body.user.image,
                bio: req.body.user.bio,
            },
            {new: true}
        )
        res.status(200).send({
            user: {
                username: updateUser.username,
                email: updateUser.email,
                bio: updateUser.bio,
                image: updateUser.image,
                token: token,
            },
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const getUser = async (req, res) => {
    try {
        let token = req.headers['x-access-token']
        let id = res.locals.token
        let user = await findOneUser({_id: id})
        res.status(200).send({
            user: {
                username: user.username,
                email: user.email,
                bio: user.bio,
                image: user.image,
                token: token,
            },
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const getProfile = async (req, res) => {
    try {
        let id = res.locals.token
        let user = await findOneUser({username: req.params.username})
        res.status(200).send({
            profile: {
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: user.followingBy.includes(id),
            },
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const followProfile = async (req, res) => {
    try {
        let id = res.locals.token
        let user = await findOneUserAndUpdate(
            {username: req.params.username},
            {
                $push: {followingBy: id},
            },
            {new: true}
        )
        if (user) {
            res.status(200).send({
                profile: {
                    username: user.username,
                    bio: user.bio,
                    image: user.image,
                    following: user.following,
                },
            })
        }
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const unFollowProfile = async (req, res) => {
    try {
        let id = res.locals.token
        let user = await findOneUserAndUpdate(
            {username: req.params.username},
            {
                $pull: {followingBy: id},
            },
            {new: true}
        )
        if (user) {
            res.status(200).send({
                profile: {
                    username: user.username,
                    bio: user.bio,
                    image: user.image,
                    following: user.following,
                },
            })
        }
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

module.exports = {
    updateUser,
    getUser,
    getProfile,
    followProfile,
    unFollowProfile,
}
