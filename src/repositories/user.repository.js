const db = require('../models')
const User = db.user

const findOneUser = async (query) => {
    try {
        return await User.findOne(query)
    } catch (err) {
        return err
    }
}

const findUsers = async (query) => {
    try {
        return await User.find(query)
    } catch (err) {
        return err
    }
}

const findOneUserAndUpdate = async (query, update, options) => {
    try {
        return await User.findOneAndUpdate(query, update, options)
    } catch (err) {
        return err
    }
}

const createNewUser = async (user) => {
    try {
        let newUser = await new User(user).save()
        return {
            username: newUser.username,
            email: newUser.email,
            image: newUser.image,
            bio: newUser.bio,
            _id: newUser._id,
        }
    } catch (err) {
        return err
    }
}
module.exports = {
    findOneUser,
    findUsers,
    createNewUser,
    findOneUserAndUpdate,
}
