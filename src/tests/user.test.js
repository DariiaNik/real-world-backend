const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const dbSetup = require('./setup/db_setup')

describe('/user', () => {
    const token = jwt.sign({id: '507f191e810c19729de860ea'}, process.env.JWT_SECRET)

    beforeAll(() => {
        dbSetup.Initialize()
    })

    afterAll(() => {
        dbSetup.Clear()
    })

    describe('GET', () => {
        it('should successfuly get current user', async () => {
            const {body, statusCode} = await request(app)
                .get('/user')
                .set({'x-access-token': token})
            expect(statusCode).toBe(200)
            expect(body.user.username).toEqual('Dariia')
        })
        it('should successfuly get user profile', async () => {
            const {body, statusCode} = await request(app)
                .get('/profiles/Dariia')
                .set({'x-access-token': token})
            expect(statusCode).toBe(200)
            expect(body.profile.username).toEqual('Dariia')
        })
        it('should get error, such profile does not exist', async () => {
            const {error, statusCode} = await request(app)
                .get('/profiles/Dan')
                .set({'x-access-token': token})
            expect(statusCode).toBe(500)
            expect(error).toBeDefined()
        })
        it('should get error, no token provider', async () => {
            const {body, statusCode} = await request(app).get('/profiles/Dariia')
            expect(statusCode).toBe(403)
            expect(body.error).toBe('No token provider')
        })
    })

    describe('PUT', () => {
        it('should successfuly update current user', async () => {
            const {body, statusCode} = await request(app)
                .put('/user')
                .set({'x-access-token': token})
                .send({
                    user: {
                        username: 'Dariia1',
                        bio: 'Hello!',
                    },
                })
            expect(statusCode).toBe(200)
            expect(body.user.username).toEqual('Dariia1')
            expect(body.user.bio).toEqual('Hello!')
        })
        it('should error update current user with exist email', async () => {
            const {body, statusCode} = await request(app)
                .put('/user')
                .set({'x-access-token': token})
                .send({
                    user: {
                        email: 'pineapple@gmail.com',
                    },
                })
            expect(statusCode).toBe(400)
            expect(body.error).toEqual('Failed, email already exists')
        })
        it('should error update current user with exist username', async () => {
            const {body, statusCode} = await request(app)
                .put('/user')
                .set({'x-access-token': token})
                .send({
                    user: {
                        username: 'Pineapple',
                    },
                })
            expect(statusCode).toBe(400)
            expect(body.error).toEqual('Failed, username already exists')
        })
    })

    describe('POST', () => {
        it('should successfuly follow user', async () => {
            const {body, statusCode} = await request(app)
                .post('/profiles/Pineapple/follow')
                .set({'x-access-token': token})
            expect(statusCode).toBe(200)
            expect(body.profile.username).toEqual('Pineapple')
            expect(body.profile.following).toBeTruthy()
        })
        it('should error follow, user does not exist', async () => {
            const {error, statusCode} = await request(app)
                .post('/profiles/Pineapp/follow')
                .set({'x-access-token': token})
            expect(statusCode).toBe(500)
            expect(error).toBeDefined()
        })
    })

    describe('DELETE', () => {
        it('should successfuly unFollow user', async () => {
            const {body, statusCode} = await request(app)
                .delete('/profiles/Pineapple/follow')
                .set({'x-access-token': token})
            expect(statusCode).toBe(200)
            expect(body.profile.username).toEqual('Pineapple')
            expect(body.profile.following).toBeFalsy()
        })
        it('should error unFollow ,user does not exist', async () => {
            const {error, statusCode} = await request(app)
                .delete('/profiles/Pineapp/follow')
                .set({'x-access-token': token})
            expect(statusCode).toBe(500)
            expect(error).toBeDefined()
        })
    })
})
