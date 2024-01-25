const express = require('express')
const router = express.Router()
const axios = require('axios');
const { Dog, User } = require('../db/index');

const { OPENAI_KEY } = require('../config');


// **************** GET ROUTES ********************

//GET DOG BY USER ID

router.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  Dog.find().where({ owner: userId })
    .then((dogsArr) => {
      User.findById(userId)
        .then(({ breeds }) => {
          res.status(200)
            .send({ dogsArr, breeds })
        })
        .catch((err) => {
          console.error('SERVER ERROR: failed to GET user breeds list by id', err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.error('SERVER ERROR: failed to GET dog by userId', err);
      res.sendStatus(500);
    });
});

//GET DOG BY DOG ID

router.get('/id/:dogId', (req, res) => {
  const { dogId } = req.params;

  

  Dog.findById(dogId)
    .then((dog) => {
      res.status(200).send(dog)
    })
    .catch((err) => {
      console.error('SERVER ERROR: failed to GET dog by id', err);
      res.sendStatus(500);
    });
})

//GET DOG STORY FROM EXTERNAL API AND SAVE TO DOG DB

router.get('/story/:dogName', (req, res) => {
  const { dogName } = req.params;
  const headers = {
    headers: {
      authorization: `Bearer ${OPENAI_KEY}`,
    }
  };

  const body = {
    "model": "gpt-3.5-turbo-instruct",
    "prompt": `Write a story about my dog named ${dogName}, and what he did today.`,
    "max_tokens": 100,
    "temperature": 0
  }
  axios.post('https://api.openai.com/v1/completions', body, headers)
  .then((response) => {
    res.status(200).send(response.data.choices);
  })
  .catch((err) => console.log(err))
})

// **************** POST ROUTES ********************

//POST DOG

router.post('/', (req, res) => {
  const { name, img, owner } = req.body;
  const status = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  Dog.create({
    name,
    img,
    owner,
    feedDeadline: status,
    walkDeadline: status
  })
    .then(() => {
      return User.findByIdAndUpdate(owner, { $inc: { coinCount: -15, dogCount: -1 }, $pull: { breeds: img } }, { new: true })
        .catch((err) => {
          console.error('SERVER ERROR: failed to UPDATE user', err);
          res.sendStatus(500);
        })
    })
    .then((updatedUser) => {
        res.status(201).send(updatedUser)
    })
    .catch((err) => {
      console.error('SERVER ERROR: failed to CREATE dog', err);
      res.sendStatus(500);
    })
})

// **************** PUT ROUTES ********************

//PUT BY DOG ID

router.put('/:dogId', (req, res) => {
    const { dogId } = req.params;
    const { status, cost } = req.body;

    Dog.findByIdAndUpdate(dogId, status, { returnDocument: 'after' })
        .then((updatedDog) => {
            if (updatedDog && cost === -3) {
                User.findByIdAndUpdate(updatedDog.owner, { $inc: { coinCount: cost } }, {new: true})
                    .then((updatedUser) => {
                        res.status(200).send(updatedUser);
                    })
                    .catch((err) => {
                        console.error('SERVER ERROR: failed to UPDATE user coins by id', err);
                        res.sendStatus(500);
                    });
            } else if (updatedDog) {
                User.findById(updatedDog.owner)
                    .then((updatedUser) => {
                        res.status(200).send(updatedUser);
                    })
                    .catch((err) => {
                        console.error('SERVER ERROR: failed to UPDATE user coins by id', err);
                        res.sendStatus(500);
                    });
            } else {
                res.sendStatus(404);
            }
        })
        .catch((err) => {
            console.error('SERVER ERROR: failed to UPDATE dog status by id', err);
            res.sendStatus(500);
        });
});

// **************** DELETE ROUTES ********************


// DELETE ALL DOGS BY USER ID
router.delete('/all/:ownerId', (req, res) => {
  const { ownerId } = req.params
  
  Dog.deleteMany({ owner: ownerId})
  .then((deleted) => {
    console.log(deleted)
    res.sendStatus(200)
  })
  .catch((err) => {
    console.error('deleted all dogs by user ERROR', err)
  })
} )

//DELETE BY DOG ID
router.delete('/:dogId', (req, res) => {
  const { dogId } = req.params;

  Dog.findByIdAndDelete(dogId)
    .then((deletedDog) => {
      if (deletedDog) {
        return res.status(200).send(deletedDog);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('SERVER ERROR: failed to DELETE dog by id', err);
      res.sendStatus(500);
    });
})









module.exports = router