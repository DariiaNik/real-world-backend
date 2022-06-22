const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token']
        if (!token) {
            return res.status(403).send({error: 'No token provider'})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            expiresIn: 6000,
        })
        res.locals.token = decoded.id
    } catch (err) {
        res.status(401).send({error: 'Unauthorize'})
    }
    next()
}

module.exports = {
    verifyToken,
}
