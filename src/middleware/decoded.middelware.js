const jwt = require('jsonwebtoken')

const decodedToken = async (req, res, next) => {
    const token = req.headers['x-access-token']
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            res.locals.token = decoded.id
        } catch (err) {
            console.error(err)
            res.status(401).send({error: 'Unauthorized'})
        }
    }
    next()
}

module.exports = {decodedToken}
