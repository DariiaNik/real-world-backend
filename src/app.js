const express = require('express')
const cors = require('cors')
const db = require('./models')

const port = process.env.SERVER_PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept')
    next()
})

require('./routes/articles.route')(app)
require('./routes/auth.route')(app)
require('./routes/user.route')(app)

db.mongoose
    .connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DB_NAME}`)
    .then(() => {
        console.log(`Succesesfull connected to mongoDB on port ${process.env.MONGO_PORT}`)
    })
    .catch((err) => console.error('Connection to mongoDB failed', err))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
