const {registerNewUser, loginUser} = require('../controller/auth.controller')
const {checkUserExist} = require('../middleware/auth.middelware')

module.exports = (app) => {
    app.post('/users', [checkUserExist], registerNewUser)
    app.post('/users/login', loginUser)
}
