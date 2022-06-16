const {
    getUser,
    updateUser,
    getProfile,
    followProfile,
    unFollowProfile,
} = require('../controller/user.controller')
const {checkUserUpdateExist} = require('../middleware/user.middelware')
const {verifyToken} = require('../middleware/token.middelware')

module.exports = (app) => {
    app.get('/user', [verifyToken], getUser)
    app.put('/user', [verifyToken, checkUserUpdateExist], updateUser)

    app.get('/profiles/:username', [verifyToken], getProfile)
    app.post('/profiles/:username/follow', [verifyToken], followProfile)
    app.delete('/profiles/:username/follow', [verifyToken], unFollowProfile)
}
