const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const dbSetup = require('./setup/db_setup')

describe('/articles/:slug/comments', () => {
    const token = jwt.sign({id: '507f191e810c19729de860ea'}, process.env.JWT_SECRET)

    beforeAll(() => {
        dbSetup.Initialize()
    })

    afterAll(() => {
        dbSetup.Clear()
    })

    it('GET/ should successfuly get all comments', async () => {
        const {body, statusCode} = await request(app)
            .get('/articles/This-is-my-first-article!/comments')
            .set({'x-access-token': token})

        expect(statusCode).toBe(200)
        expect(body.comments.length).toEqual(2)
    })
    it('POST/ should successfuly post new comment', async () => {
        const {body, statusCode} = await request(app)
            .post('/articles/This-is-my-first-article!/comments')
            .set({'x-access-token': token})
            .send({
                comment: {
                    body: 'New comment',
                },
            })

        expect(statusCode).toBe(200)
        expect(body.body).toEqual('New comment')
        expect(body.author.username).toEqual('Dariia')
    })
    it('POST/ should error post new comment without data', async () => {
        const {error, statusCode} = await request(app)
            .post('/articles/This-is-my-first-article!/comments')
            .set({'x-access-token': token})
            .send({})

        expect(statusCode).toBe(500)
        expect(error).toBeDefined()
    })
    it('DELETE/ should successfuly delete comment', async () => {
        const {body, statusCode} = await request(app)
            .delete('/articles/This-is-my-first-article!/comments/6299f91e8d860055f7d59270')
            .set({'x-access-token': token})

        expect(statusCode).toBe(200)
        expect(body.message).toEqual('Comment was deleted successfuly')
    })
})
