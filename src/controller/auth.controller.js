const db = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {findOneUser} = require('../services/user.service')
const User = db.user

const registerNewUser = async (req, res) => {
    try {
        let user = await new User({
            username: req.body.user.username,
            email: req.body.user.email,
            password: bcrypt.hashSync(req.body.user.password, 8),
            image: 'https://pic.onlinewebfonts.com/svg/img_550783.png',
            bio: '',
            following: false,
        }).save()
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: 3600,
        })
        res.status(200).send({
            user: {
                username: user.username,
                email: user.email,
                image: user.image,
                bio: user.bio,
                token: token,
            },
        })
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const loginUser = async (req, res) => {
    try {
        let user = await findOneUser({email: req.body.user.email})
        if (!user) {
            res.status(404).send({
                accessToken: null,
                message: 'User not found',
            })
            return
        }
        const passwordIsValid = bcrypt.compareSync(req.body.user.password, user.password)
        if (!passwordIsValid) {
            res.status(401).send({
                accessToken: null,
                message: 'Invalid password',
            })
            return
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: 3600,
        })
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

module.exports = {
    registerNewUser,
    loginUser,
}
