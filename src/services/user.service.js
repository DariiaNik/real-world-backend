const {findOneUser, findOneUserAndUpdate} = require('../repositories/user.repository')
const {updateManyArticles} = require('../repositories/article.repository')
const {updateManyComments} = require('../repositories/comment.repository')

const getUserService = async (token, id) => {
    try {
        const user = await findOneUser({_id: id})
        return {
            user: {
                username: user.username,
                email: user.email,
                bio: user.bio,
                image: user.image,
                token: token,
            },
        }
    } catch (err) {
        throw new Error(err)
    }
}

const getProfileService = async (username, id) => {
    try {
        const user = await findOneUser({username: username})
        return {
            profile: {
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: user.followingBy.includes(id),
            },
        }
    } catch (err) {
        throw new Error(err)
    }
}

const updateUserService = async (reqUser, token, id) => {
    try {
        const user = await findOneUser({_id: id})
        const update = {
            'author.username': reqUser.username,
            'author.bio': reqUser.bio,
            'author.image': reqUser.image,
        }
        await updateManyArticles({'author.username': user.username}, update)
        await updateManyComments({'author.username': user.username}, update)
        const updateUser = await findOneUserAndUpdate(
            {_id: id},
            {
                email: reqUser.email,
                username: reqUser.username,
                image: reqUser.image,
                bio: reqUser.bio,
            },
            {new: true}
        )
        return {
            user: {
                username: updateUser.username,
                email: updateUser.email,
                bio: updateUser.bio,
                image: updateUser.image,
                token: token,
            },
        }
    } catch (err) {
        throw new Error(err)
    }
}

const followProfileService = async (username, id) => {
    try {
        const user = await findOneUserAndUpdate(
            {username: username},
            {
                $push: {followingBy: id},
            },
            {new: true}
        )
        return {
            profile: {
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: user.followingBy.includes(id),
            },
        }
    } catch (err) {
        throw new Error(err)
    }
}

const unFollowProfileService = async (username, id) => {
    try {
        const user = await findOneUserAndUpdate(
            {username: username},
            {
                $pull: {followingBy: id},
            },
            {new: true}
        )
        return {
            profile: {
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: user.followingBy.includes(id),
            },
        }
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = {
    getUserService,
    getProfileService,
    updateUserService,
    followProfileService,
    unFollowProfileService,
}
