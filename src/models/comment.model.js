const mongoose = require('mongoose')

const Comment = mongoose.model(
    'Comment',
    new mongoose.Schema({
        body: String,
        id: String,
        slug: String,
        createdAt: String,
        author: {
            username: String,
            bio: String,
            image: String,
            following: Boolean,
        },
    })
)

module.exports = Comment
