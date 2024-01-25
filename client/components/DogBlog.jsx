import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import axios from "axios";

function DogBlog() {
  const [breeds, setList] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [userId, setUserId] = useState(user._id);
  const [dogBlog, setDogBlog] = useState(false);
  const [dogName, setDogName] = useState('');
  const [dogPic, setDogPic] = useState('');
  const [dogStory, setDogStory] = useState('');
  

  // get users dogs from db and set breeds list
  const getDogs = () => {
    axios
      .get(`/dog/users/${userId}`)
      .then(({ data }) => {
        console.log(data.breeds)
        setDogName(data.dogsArr[0].name)
        setDogPic(data.dogsArr[0].img)
      })
      .catch((err) => {
        console.error(err);
      });
  };
  
  // render a component that shows current dogs you possess
  // include some details about dog
  // check if user has dog, if not display message "get a dog!", if yes display dog
  // add additional divs to render the returned dog stories
  const dogList = dogName  ? (
    <div>
      <div className='dog-name'> Name: {dogName}</div>
      <img src={dogPic} style={{width: '250px'}}/>
    </div>
  ) : (<div> Go buy a dog from the kennel!</div>)

  // create button/form to tell the story of what this dog did today
  const dogButton = (<Button onClick={() => handleClick(dogName)}>`What did {dogName} do today?`</Button>);

  // create an element for the dog story
  const story = (<div>{dogStory}</div>);

  // create a function to send request to server to make external api call, needs to take in dog details**POST
  const getStory = (dog) => {
    axios
    (`/dog/story/${dog}`)
    .then((response) =>  {
      setDogStory(response.data[0].text)
    })
    .catch((err) => console.log(err, 'post story failed'));
  };

  // create a handle click function to call axios request and render returned story with data
  const handleClick = (dog) => {
    getStory(dog)
  }

  useEffect(() => {
    setUserId(user._id);
    getDogs()
  }, []);

  return (
    <div>
      <h1>Dog Blog!</h1>
      {dogList}
      {dogButton}
      {story}
    </div>
  )
}

export default DogBlog;
