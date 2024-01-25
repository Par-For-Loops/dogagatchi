const router = require('express').Router()
const { Message } = require('../db/index');

// To initialize messages array in Chat component, returns all message from db
router.get('/all', (req, res) => {
  Message.find({})
    .sort('-createdAt')
    .then((msgArr) => res.status(200).send(msgArr))
    .catch((err) => {
      console.error('Failed to Find all msgs: ', err);
      res.sendStatus(500);
    })
})

// To be used when message is sent via socket, creates new message document in db
router.post('/post', (req, res) => {
  const { message } = req.body;
  Message.create({ message })
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error('Failed to Create msg: ', err);
      res.sendStatus(500);
    })
})

module.exports = router;
