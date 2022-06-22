const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {createNewUser} = require('../repositories/user.repository')

const registerNewUserService = async (reqUser) => {
    try {
        const user = await createNewUser({
            username: reqUser.username,
            email: reqUser.email,
            password: bcrypt.hashSync(reqUser.password, 8),
            image: 'https://pic.onlinewebfonts.com/svg/img_550783.png',
            bio: '',
            following: false,
        })
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: 3600,
        })
        return {
            user: {
                username: user.username,
                email: user.email,
                image: user.image,
                bio: user.bio,
                token: token,
            },
        }
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = {
    registerNewUserService,
}
