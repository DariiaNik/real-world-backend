const {
    getUser,
    updateUser,
    getProfile,
    followProfile,
    unFollowProfile,
} = require('../controller/user.controller')
const {checkUserUpdateExist} = require('../middleware/user.middelware')
const {verifyToken} = require('../middleware/token.middelware')
const {decodedToken} = require('../middleware/decoded.middelware')

module.exports = (app) => {
    app.get('/user', [verifyToken, decodedToken], getUser)
    app.put('/user', [verifyToken, decodedToken, checkUserUpdateExist], updateUser)

    app.get('/profiles/:username', [decodedToken], getProfile)
    app.post('/profiles/:username/follow', [verifyToken, decodedToken], followProfile)
    app.delete('/profiles/:username/follow', [verifyToken, decodedToken], unFollowProfile)
}
