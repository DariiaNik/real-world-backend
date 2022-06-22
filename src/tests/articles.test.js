const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const Articles = require('./mocks/article_mock')
const dbSetup = require('./setup/db_setup')

describe('/articles', () => {
    const token = jwt.sign({id: '507f191e810c19729de860ea'}, process.env.JWT_SECRET)
    const newArticle = {
        title: 'Test title real world',
        description: 'Ipsum Lorem edit',
        body: 'Return edit one',
        tagList: ['tag'],
    }

    beforeAll(() => {
        dbSetup.Initialize()
    })

    afterAll(() => {
        dbSetup.Clear()
    })

    describe('GET', () => {
        it('shouldsuccessfuly get all articles', async () => {
            const {body, statusCode} = await request(app).get('/articles')
            expect(statusCode).toBe(200)
            expect(body.articlesCount).toEqual(Articles.length)
            expect(body.articles[0].title).toEqual(Articles[0].title)
        })
        it('should successfuly get all articles with token', async () => {
            const {body, statusCode} = await request(app)
                .get('/articles')
                .set({'x-access-token': token})
            expect(statusCode).toBe(200)
            expect(body.articlesCount).toEqual(Articles.length)
            expect(body.articles[0].title).toEqual(Articles[0].title)
        })
        it('should successfuly get article by slug', async () => {
            const {body, statusCode} = await request(app).get('/articles/This-is-my-first-article!')
            expect(statusCode).toBe(200)
            expect(body.article.slug).toEqual('This-is-my-first-article!')
        })
        it('should error article with such slug doesnt exists', async () => {
            const {error, statusCode} = await request(app).get('/articles/Expect')
            expect(error).toBeDefined()
            expect(statusCode).toBe(500)
        })
        it('should successfuly get article by author', async () => {
            const {body, statusCode} = await request(app).get('/articles?author=Dariia')
            expect(statusCode).toBe(200)
            expect(body.articles[0].author.username).toEqual('Dariia')
        })
        it('should successfuly get article by tag', async () => {
            const {body, statusCode} = await request(app).get('/articles?tag=First')
            expect(statusCode).toBe(200)
            expect(body.articles[0].tagList).toContain('First')
        })
        it('should successfuly get article by favorited', async () => {
            const {body, statusCode} = await request(app).get('/articles?favorited=Dariia')
            expect(statusCode).toBe(200)
            expect(body.articles[0].favoritedBy).toContain('507f191e810c19729de860ea')
        })
        it('should successfuly get article by feed', async () => {
            const {body, statusCode} = await request(app)
                .get('/feed')
                .set({'x-access-token': token})
            expect(statusCode).toBe(200)
            expect(body.articles[0].author.id).toEqual('6299fb3d8d860055f7d592b4')
        })
        it('should successfuly get all tags', async () => {
            const {body, statusCode} = await request(app).get('/tags')
            expect(statusCode).toBe(200)
            expect(body.tags).toContain('First', 'Quisque porta')
        })
    })

    describe('POST', () => {
        it('should successfuly post new article', async () => {
            const {body, statusCode} = await request(app)
                .post('/articles')
                .set({'x-access-token': token})
                .send({article: newArticle})
            expect(statusCode).toBe(200)
            expect(body.article.title).toEqual(newArticle.title)
            expect(body.article.author.username).toEqual('Dariia')
        })
        it('should error post new article without data', async () => {
            const {error, statusCode} = await request(app)
                .post('/articles')
                .set({'x-access-token': token})
                .send({article: ''})
            expect(statusCode).toBe(500)
            expect(error).toBeDefined()
        })
        it('should successfuly favorite article', async () => {
            const {body, statusCode} = await request(app)
                .post('/articles/This-is-my-first-article!/favorite')
                .set({'x-access-token': token})
            expect(statusCode).toBe(200)
            expect(body.article.favorited).toBeTruthy()
        })
        it('should error favorite, article does not exist', async () => {
            const {error, statusCode} = await request(app)
                .post('/articles/Test/favorite')
                .set({'x-access-token': token})
            expect(statusCode).toBe(500)
            expect(error).toBeDefined()
        })
    })

    describe('PUT', () => {
        it('should successfuly update article', async () => {
            const {body, statusCode} = await request(app)
                .put('/articles/This-is-my-first-article!')
                .set({'x-access-token': token})
                .send({
                    article: {
                        title: 'This is my first article!',
                        description: 'description',
                        body: 'Updated',
                    },
                })
            expect(statusCode).toBe(200)
            expect(body.article.description).toEqual('description')
            expect(body.article.author.username).toEqual('Dariia')
        })
        it('should error update article with exist title', async () => {
            const {body, statusCode} = await request(app)
                .put('/articles/This-is-my-first-article!')
                .set({'x-access-token': token})
                .send({
                    article: {
                        title: 'Cras mollis elit orci, et vestibulum nulla euismod ac.',
                    },
                })
            expect(statusCode).toBe(400)
            expect(body.error).toEqual('Failed, article with such title already exists')
        })
    })

    describe('DELETE', () => {
        it('should successfuly unFavorite article', async () => {
            const {body, statusCode} = await request(app)
                .delete('/articles/This-is-my-first-article!/favorite')
                .set({'x-access-token': token})
            expect(statusCode).toBe(200)
            expect(body.article.favorited).toBeFalsy()
        })
        it('should error unFavorite, article does not exist', async () => {
            const {error, statusCode} = await request(app)
                .delete('/articles/Test/favorite')
                .set({'x-access-token': token})
            expect(statusCode).toBe(500)
            expect(error).toBeDefined()
        })
        it('should successfuly delete article', async () => {
            const {body, statusCode} = await request(app)
                .delete('/articles/This-is-my-first-article!')
                .set({'x-access-token': token})
            expect(statusCode).toBe(200)
            expect(body.message).toEqual('Article was deleted successfuly')
        })
    })
})
