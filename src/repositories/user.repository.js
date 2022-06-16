const db = require('../models')
const User = db.user

const findOneUser = async (query) => {
    try {
        return await User.findOne(query)
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
        return await new User(user).save()
    } catch (err) {
        return err
    }
}
module.exports = {
    findOneUser,
    createNewUser,
    findOneUserAndUpdate,
}
