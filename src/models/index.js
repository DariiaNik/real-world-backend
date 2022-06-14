const mongoose = require('mongoose')

const db = {}
db.mongoose = mongoose
db.article = require('./article.model')
db.comments = require('./comment.model')
db.user = require('./user.model')

module.exports = db
