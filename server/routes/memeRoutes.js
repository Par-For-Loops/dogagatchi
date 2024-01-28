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
    .catch(() => {
      // console.error('error ', err)
      res.sendStatus(500)
    })
})

// PUT find by id and update
router.put('/:memeId', (req, res) => {
  const { memeId } = req.params;
  // const { likes } = req.body.meme;
  // console.log(memeId);

  Meme.findByIdAndUpdate({_id: memeId }, { $inc: { likes: 1 } }, { new: true})
    .then(() => {
      // console.log('put success ', data);
      res.sendStatus(200)
    })
    .catch( err => {
      console.error('could not update ', err)
      res.sendStatus(500)
    })
})

// PUT dislike meme
router.put('/dislike/:memeId', (req, res) => {
  const { memeId } = req.params;
  // const { likes } = req.body.meme;
  // console.log(memeId);

  Meme.findByIdAndUpdate({_id: memeId }, { $inc: { likes: -1 } }, { new: true})
    .then(data => {
      // console.log('put success ', data);
      if (data.likes === -2) {
        Meme.findByIdAndDelete(memeId)
          .then(() => {
            // console.log("deleted ", data)
            res.sendStatus(200)
          })
          .catch(() => {
            // console.error('del failed ', err)
            res.sendStatus(500)
          })
      } else {
        res.sendStatus(200)
      }
    })
    .catch( err => {
      console.error('could not update ', err)})
})

module.exports = router;