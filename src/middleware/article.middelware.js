const db = require('../models')
const Article = db.article

const checkArticleExist = async (req, res, next) => {
    try {
        let article = await Article.findOne({title: req.body.article.title})
        if (article) {
            res.status(400).send({
                error: 'Failed, article with such title already exists',
            })
            return
        }
        next()
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

const checkArticleUpdateExist = async (req, res, next) => {
    try {
        let article = await Article.findOne({title: req.body.article.title})
        if (article) {
            if (req.params.slug !== article.slug) {
                res.status(400).send({
                    error: 'Failed, article with such title already exists',
                })
                return
            }
        }
        next()
    } catch (err) {
        console.error(err)
        res.status(500).send({error: err})
    }
}

module.exports = {checkArticleExist, checkArticleUpdateExist}
