const db = require('../models')
const User = db.user

const checkUserExist = async (req, res, next) => {
    try {
        const id = res.locals.token
        const email = await User.findOne({email: req.body.user.email})
        const username = await User.findOne({
            username: req.body.user.username,
        })
        if (id) {
            const user = await User.findById(id)
            if (user) {
                if (id !== (username._id.toString() || email._id.toString())) {
                    res.status(400).send({
                        error: `Failed, ${username ? 'username' : 'email'} already exists`,
                    })
                    return
                }
            }
        } else if (email || username) {
            res.status(409).send({
                message: `Failed, ${username ? 'username' : 'email'} already exists`,
            })
            return
        }
        next()
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const checkUserUpdateExist = async (req, res, next) => {
    try {
        const id = res.locals.token
        const user = await User.findById(id)
        if (user) {
            const email = await User.findOne({email: req.body.user.email})
            const username = await User.findOne({
                username: req.body.user.username,
            })
            if (email) {
                if (id !== email._id.toString()) {
                    res.status(400).send({
                        error: 'Failed, email already exists',
                    })
                    return
                }
            }
            if (username) {
                if (id !== username._id.toString()) {
                    res.status(400).send({
                        error: 'Failed, username already exists',
                    })
                    return
                }
            }
            next()
        }
    } catch (err) {
        console.error(err)
        res.status(500).send({error: new Error(err)})
    }
}

module.exports = {checkUserUpdateExist, checkUserExist}
