const express = require('express')
const router = express.Router()
const axios = require('axios');
const dayjs = require('dayjs')
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

router.get('/story/:dogName/breeds/:dogBreed/owners/:owner/', (req, res) => {
  const { dogName, dogBreed, owner } = req.params;
  const currentDate = dayjs();
  const formattedDate = currentDate.format('MM-DD-YYYY');

  const headers = {
    headers: {
      authorization: `Bearer ${OPENAI_KEY}`,
    }
  };

  const body = {
    "model": "gpt-3.5-turbo-instruct",
    "prompt": `Write a one paragraph long blog post about my dog named ${dogName}, he is a ${dogBreed}. The dog's owner is a man, named ${owner}. What did the dog do today? Write it from the perspective of the dog.`,
    "max_tokens": 300,
    "temperature": 1
  }

  axios.post('https://api.openai.com/v1/completions', body, headers)
  .then((response) => {
    const story = {
      story: response.data.choices[0].text,
      date: formattedDate,
      likes: 0
    }
    const filter = { name: dogName };
    const update = { $push: { stories: story } }
    Dog.findOneAndUpdate(filter, update, {
      new: true
    })
    .then((dbResponse) => {
      res.status(201).send(dbResponse)
    }).catch(err => console.log(err, 'from db method'))
  })
  .catch((err) => console.log(err))
})

// **************** POST ROUTES ********************

//POST DOG

router.post('/', (req, res) => {
  const { name, img, owner, breed } = req.body;
  const status = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  Dog.create({
    name,
    img,
    owner,
    feedDeadline: status,
    walkDeadline: status,
    breed
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

//LIKE BLOG ENTRY BY ID

// router.put('/story/:dogId', (req, res) => {
//   const { dogId } = req.params;
//   const q = {
//     'stories._id': dogId
//   }
//   Dog.findOneAndUpdate(q, { $set: {stories: {liked: true}}  }, { new: true })
//   .then((response) => {
//     console.log(response)
//     res.status(200)
//   })
//   .catch((err) => console.log(err));
// })

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

//DELETE BLOG ENTRY BY ID

router.delete('/story/:dogId', (req, res) => {
  const { dogId } = req.params;
  const q = {
    'stories._id': dogId 
  }
  Dog.findOneAndUpdate(q, { $pull: { stories: {_id: dogId} } }, { new: true })
  .then((response) => {
    res.status(200).send(response)
  })
  .catch((err) => console.log(err));
})







module.exports = router