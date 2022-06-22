const request = require('supertest')
const app = require('../app')
const dbSetup = require('./setup/db_setup')

describe('/users', () => {
    beforeAll(() => {
        dbSetup.Initialize()
    })

    afterAll(() => {
        dbSetup.Clear()
    })

    describe('Login', () => {
        it('should successfuly login existing user ', async () => {
            const {body, statusCode} = await request(app)
                .post('/users/login')
                .send({
                    user: {
                        email: 'dariia8@gmail.com',
                        password: '88888',
                    },
                })
            expect(statusCode).toBe(200)
            expect(body.user.username).toBe('Dariia')
            expect(body.user.token).toBeTruthy()
        })
        it('should error login user, user not found ', async () => {
            const {body, statusCode} = await request(app)
                .post('/users/login')
                .send({
                    user: {
                        email: 'dariia@gmail.com',
                        password: '88888',
                    },
                })
            expect(statusCode).toBe(404)
            expect(body.message).toBe('User not found')
        })
        it('should error login user, invalid password', async () => {
            const {body, statusCode} = await request(app)
                .post('/users/login')
                .send({
                    user: {
                        email: 'dariia8@gmail.com',
                        password: '888881',
                    },
                })
            expect(statusCode).toBe(401)
            expect(body.message).toBe('Invalid password')
        })
    })

    describe('Register', () => {
        it('should successfuly register new user ', async () => {
            const {body, statusCode} = await request(app)
                .post('/users')
                .send({
                    user: {
                        username: 'Dariia2',
                        email: 'dariia2@gmail.com',
                        password: '22222',
                    },
                })
            expect(statusCode).toBe(200)
            expect(body.user.username).toBe('Dariia2')
            expect(body.user.email).toBe('dariia2@gmail.com')
            expect(body.user.token).toBeTruthy()
        })
        it('should error register new user, email already exists ', async () => {
            const {body, statusCode} = await request(app)
                .post('/users')
                .send({
                    user: {
                        username: 'Dariia0',
                        email: 'dariia8@gmail.com',
                        password: '22222',
                    },
                })
            expect(statusCode).toBe(409)
            expect(body.message).toBe('Failed, email already exists')
        })
        it('should error register new user, username already exists ', async () => {
            const {body, statusCode} = await request(app)
                .post('/users')
                .send({
                    user: {
                        username: 'Dariia',
                        email: 'dariia0@gmail.com',
                        password: '22222',
                    },
                })
            expect(statusCode).toBe(409)
            expect(body.message).toBe('Failed, username already exists')
        })
    })
})
