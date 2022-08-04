const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token']
        if (!token) {
            res.status(403).send({error: 'No token provider'})
            return
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.locals.token = decoded.id
    } catch (err) {
        res.status(401).send({error: 'Unauthorize'})
        return
    }
    next()
}

module.exports = {
    verifyToken,
}
