import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

function DogBlog() {
  const [breeds, setList] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [userId, setUserId] = useState(user._id);
  const [dogStory, setDogStory] = useState([]);
  const [dogArray, setDogArray] = useState([]);

  // get users dogs from db and set breeds list
  const getDogs = () => {
    axios
      .get(`/dog/users/${userId}`)
      .then(({ data }) => {
        setDogArray(data.dogsArr);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  // create a function to send request to server to make external api call, needs to take in dog details**POST
  const getStory = (dog, breed, owner) => {
    axios(`/dog/story/${dog}/breeds/${breed}/owners/${owner}/`)
      .then(({ data }) => {
        setDogStory(data.stories);
      })
      .catch((err) => console.log(err, "post story failed"));
  };
  // render a component that shows current dogs you possess
  const dogList2 =
    dogArray.length === 0 ? (
      <div> Go buy a dog from the kennel!</div>
    ) : (
      dogArray.map((dog, index) => {
        return (
          <div key={index}>
            <div className="dog-name"> Name: {dog.name}</div>
            <img src={dog.img} style={{ width: "250px" }} />
            <div className="dog-breed"> Breed: {dog.breed}</div>
            <Button onClick={() => handleClick(dog.name, dog.breed, user.username)}>
              `What did {dog.name} do today?`
            </Button>
          </div>
        );
      })
    );

  // create an element for the dog story
  const story =
    dogStory.length === 0 ? (
      <div>My life as a dog...</div>
    ) : (
      <div>
        My life as a dog...
        {
        dogStory.map((story, index) => {
          return (
            <div
              key={index}>
              <h3 className="blog-date">Date: {story.date}</h3>
              {story.story}
            </div>
          )
        })
        }
      </div>
    );

  // create a handle click function to call axios request and render returned story with data
  const handleClick = (dog, breed, owner) => {
    getStory(dog, breed, owner);
  };

  useEffect(() => {
    setUserId(user._id);
    getDogs();
  }, []);

  return (
    <div>
      <h1>Dog Blog!</h1>
      {dogList2}
      {story}
    </div>
  );
}

export default DogBlog;
