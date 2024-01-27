import React, { useState } from "react";
import axios from 'axios';

function Gallery() {
  // // state variable for dog pics
  // const [dogGallery, setDogGallery] = useState([])
  // // 'search' for dog pics
  // function getDogPics(breedName) {
  //   // axios get request
  //   // console.log(breedName);
  //   axios.get(`/api/gallery/${breedName}`)
  //     .then((response) => {
  //       // console.log('dog data ', response.data);
  //       setDogGallery(response.data);
  //     })
  //     .catch((err) => console.error('no dogs ', err))
  // }
  // // axios post to upload dog imgs
  // // should take in a URL 
  // function uploadDogImage(imageUrl) {
  //   axios.post('/api/gallery', {
  //     url: imageUrl
  //   })
  //     .then((response) => {
  //       console.log('upload response: ', response.data)
  //       // add cloudinary url to database here, put request
  //     })
  //     .catch((err) => console.error('Could not post to Cloudinary ', err))
  // }
  // // handleImageClick function to send image URL to cloudinary post req
  // function handleImageClick(image) {
  //   uploadDogImage(image);
  // }

  return (
    <div>
      {/* <button
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
              onClick={() => handleImageClick(image)}
            />
          </li>
        ))
      }
      </ul> */}
    </div>

  )
}

export default Gallery;
