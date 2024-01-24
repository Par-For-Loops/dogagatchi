import React, { useState } from "react";
import axios from 'axios';

function Gallery() {
  // state variable for dog pics
  const [dogGallery, setDogGallery] = useState([])

  function getDogPics(breedName) {
    // axios get request
    // console.log(breedName);
    axios.get(`/api/gallery/${breedName}`)
      .then((response) => {
        // console.log('dog data ', response.data);
        setDogGallery(response.data);
      })
      .catch((err) => console.error('no dogs ', err))
  }

  // handleImageClick function to send image URL to cloudinary post req

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          // console.log('hi')
          getDogPics('corgi');
        }}
      >Click me</button>
      <ul>
      {
        dogGallery.map((image, i) => (
          <li key={i}>
            <img 
              src={image} 
              alt={i}
              onClick={() => console.log(image)}
            />
          </li>
        ))
      }
      </ul>
    </div>

  )
}

export default Gallery;
