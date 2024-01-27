const express = require('express')
const router = express.Router()
const { Meme } = require('../db/index');

// POST cloudinary meme url to db
router.post('/post', (req, res) => {
  const { meme } = req.body;

  Meme.create(meme)
    .then(() => {
      // console.log(data)
      res.sendStatus(201);
    })
    .catch(err => {
      console.error(err)
      res.sendStatus(500)
    });
})

// GET meme images
router.get('/', (req, res) => {
  Meme.find()
    .sort({ createdAt: -1 })
    .then((memes) => {
      // console.log(data);
      res.send(memes).status(200);
    })
    .then(err => {
      // console.error('error ', err)
    })
})
module.exports = router;