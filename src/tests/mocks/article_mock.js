const Articles = [
    {
        _id: 'article_id_1',
        slug: 'This-is-my-first-article!',
        title: 'This is my first article!',
        description: 'Hello world.',
        body: 'Hi!',
        tagList: ['First'],
        createdAt: '2022-06-03T12:04:09.545Z',
        updatedAt: '2022-06-16T07:41:43.498Z',
        favorited: false,
        favoritesCount: 3,
        __v: 0,
        author: {
            username: 'Dariia',
            bio: 'Hello, My mane is Dariia',
            image: 'https://is4-ssl.mzstatic.com/image/thumb/Music124/v4/43/9c/dc/439cdcaa-f12b-9a8c-89ea-463c973baa27/artwork.jpg/400x400cc.jpg',
            id: '507f191e810c19729de860ea',
        },
        favoritedBy: ['507f191e810c19729de860ea', '6299fb3d8d860055f7d592b4'],
    },
    {
        _id: 'article_id_2',
        slug: 'Cras-mollis-elit-orci,-et-vestibulum-nulla-euismod-ac.',
        title: 'Cras mollis elit orci, et vestibulum nulla euismod ac.',
        description: 'Quisque porta, nulla sit eu',
        body: 'Cras mollis elit orci, et vestibulum nulla euismod ac. Quisque porta, nulla sit amet faucibus tempor, purus magna porttitor ex, non sodales magna risus vitae massa. Pellentesque quis blandit lacus, interdum venenatis lacus. Ut cursus vulputate ex ac rhoncus. Integer nec tellus et nisl viverra sagittis tristique a nulla. Vivamus congue aliquet ligula sed placerat. Nulla tincidunt pellentesque est nec finibus. Mauris dictum convallis aliquet. Donec eu augue magna. Cras in augue nec ante convallis ultrices. Duis dapibus lacus nec justo fermentum consectetur. Sed dictum metus et vehicula venenatis. Maecenas vel ex id dolor sagittis facilisis. Pellentesque sed odio ornare, blandit elit eget, accumsan augue.',
        tagList: ['Quisque porta'],
        createdAt: '2022-06-06T12:33:10.024Z',
        updatedAt: '2022-06-07T12:57:04.345Z',
        favoritedBy: ['507f191e810c19729de860ea'],
        favoritesCount: 1,
        __v: 0,
        author: {
            username: 'Pineapple',
            bio: 'Hello, My mane is Dariia',
            image: 'https://is4-ssl.mzstatic.com/image/thumb/Music124/v4/43/9c/dc/439cdcaa-f12b-9a8c-89ea-463c973baa27/artwork.jpg/400x400cc.jpg',
            id: '6299fb3d8d860055f7d592b4',
        },
    },
]

module.exports = Articles
