let ObjectId = require('mongodb').ObjectID

const Users = [
    {
        _id: ObjectId('507f191e810c19729de860ea'),
        email: 'dariia8@gmail.com',
        username: 'Dariia',
        password: '$2a$08$xixjFYvfK4qsqp6oDlh3EuifWLprrjoAsRuqU71QDVietY8hOms3O',
        bio: 'Hello, My mane is Dariia',
        image: 'https://is4-ssl.mzstatic.com/image/thumb/Music124/v4/43/9c/dc/439cdcaa-f12b-9a8c-89ea-463c973baa27/artwork.jpg/400x400cc.jpg',
        __v: 0,
        followingBy: ['6299fb3d8d860055f7d592b4'],
    },
    {
        _id: ObjectId('6299fb3d8d860055f7d592b4'),
        email: 'pineapple@gmail.com',
        username: 'Pineapple',
        password: '$2a$08$50Q2W04YYQxkD5bk7vg0Z.NRGy1qYeRWJvZxznManO5KTbOcHGTpW',
        bio: 'Pen pineapple apple pen',
        image: 'https://is4-ssl.mzstatic.com/image/thumb/Music124/v4/43/9c/dc/439cdcaa-f12b-9a8c-89ea-463c973baa27/artwork.jpg/400x400cc.jpg',
        __v: 0,
        followingBy: ['507f191e810c19729de860ea'],
    },
]

module.exports = Users
