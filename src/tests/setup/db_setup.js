const {MongoClient} = require('mongodb')
const Articles = require('../mocks/article_mock')
const Users = require('../mocks/user_mock')
const Comments = require('../mocks/comment_mock')

let connection
let db

const Initialize = async () => {
    try {
        connection = await MongoClient.connect(
            `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DB_NAME}`
        )
        db = await connection.db(process.env.DB_NAME)

        const articles = db.collection('articles')
        const users = db.collection('users')
        const comments = db.collection('comments')

        await articles.insertMany(Articles)
        await users.insertMany(Users)
        await comments.insertMany(Comments)
    } catch (err) {
        console.error(err)
    }
}

const Clear = async () => {
    try {
        await db.collection('articles').deleteMany({})
        await db.collection('users').deleteMany({})
        await db.collection('comments').deleteMany({})
        await connection.close()
    } catch (err) {
        console.error(err)
    }
}

module.exports = {Initialize, Clear}
