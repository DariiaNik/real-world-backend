const app = require('./app')
require('dotenv').config({path: '../.env'})

const port = process.env.SERVER_PORT || 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
