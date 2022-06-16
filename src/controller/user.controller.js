const {
    getUserService,
    getProfileService,
    updateUserService,
    followProfileService,
    unFollowProfileService,
} = require('../services/user.service')

const updateUser = async (req, res) => {
    try {
        const token = req.headers['x-access-token']
        const id = res.locals.token
        const reqUser = req.body.user
        const user = await updateUserService(reqUser, token, id)
        res.status(200).send(user)
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const getUser = async (req, res) => {
    try {
        const token = req.headers['x-access-token']
        const id = res.locals.token
        const user = await getUserService(token, id)
        res.status(200).send(user)
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const getProfile = async (req, res) => {
    try {
        const id = res.locals.token
        const username = req.params.username
        const profile = await getProfileService(username, id)
        res.status(200).send(profile)
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const followProfile = async (req, res) => {
    try {
        const id = res.locals.token
        const username = req.params.username
        const profile = await followProfileService(username, id)
        res.status(200).send(profile)
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const unFollowProfile = async (req, res) => {
    try {
        const id = res.locals.token
        const username = req.params.username
        const profile = await unFollowProfileService(username, id)
        res.status(200).send(profile)
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

module.exports = {
    getUser,
    updateUser,
    getProfile,
    followProfile,
    unFollowProfile,
}
