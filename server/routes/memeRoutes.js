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

// PUT find by id and update
router.put('/:memeId', (req, res) => {
  const { memeId } = req.params;
  const { likes } = req.body.meme;
  // console.log(memeId);

  Meme.updateOne({_id: memeId }, { likes })
    .then(data => {
      console.log('put success ', data);
      // if (data.modifiedCount === -2) {
      //   Meme.findByIdAndDelete(memeId)
      // } 
      res.sendStatus(200)
    })
    .catch( err => {
      console.error('could not update ', err)})
})

module.exports = router;