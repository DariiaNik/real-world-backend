const {registerNewUser, loginUser} = require('../controller/auth.controller')
const {checkUserExist} = require('../middleware/user.middelware')

module.exports = (app) => {
    app.post('/users', [checkUserExist], registerNewUser)
    app.post('/users/login', loginUser)
}
