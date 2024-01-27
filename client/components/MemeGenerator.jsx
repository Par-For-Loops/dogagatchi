import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function MemeGenerator() {
  const ref = useRef();
  // state dog image
  const [dogImage, setDogImage] = useState('')
  // search
  const [search, setSearch] = useState('')
  // state text variables
  const [bottomText, setBottomText] = useState('');

  let dataUrl;

  // search for a dog pic
  const getDogPic = (breedName) => {
    // axios get request
    // console.log(breedName);
    axios.get(`/api/gallery/${breedName}`)
      .then((response) => {
        // console.log('dog data ', response.data);
        setDogImage(response.data);
      })
      .catch((err) => console.error('no dogs ', err))
  }

  // POST meme to db
  const postToGallery = (url) => {
    axios.post('/memes/post', {
      meme: {
        img: url
      }
    })
    .then(() => console.log('POSTed to db ', response))
    .catch(err => console.error('Could not POST to db ', err));
  }

  // POST dog meme to cloudinary
  const uploadDogImage = (imageUrl) => {
    //console.log(imageUrl)
    axios.post('/api/gallery', {
      url: imageUrl
    })
      .then((response) => {
        console.log('upload response: ', response.data)
        // add cloudinary url to database here, put request
        postToGallery(response.data)
      })
      .catch((err) => console.error('Could not post to Cloudinary ', err))
  }
  // function to create canvas
  const memeCanvas = () => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
  
    let image = new Image()
    image.onload = function() {
      canvas.width = image.width;
      canvas.height = image.height;

      context.drawImage(image, 0, 0);
      context.font = "30px Arial";
      context.textAlign = 'center';
      context.fillText(bottomText, (image.width * .50), (image.height * .77));
      dataUrl = canvas.toDataURL("image/jpeg");
      //console.log(dataUrl);
      uploadDogImage(dataUrl);
    }
   // console.log(context)
   image.src = dogImage;
   image.crossOrigin="anonymous";

  }
  // calls memeCanvas, to test
  // useEffect(() => {
  //   memeCanvas();
  // })
  const handleImageSearch = () => {
    getDogPic(search);
  }

  const handleClick = () => {
    // e.preventDefault();
    memeCanvas();
  }

  return (
    <div>
      {/* <Canvas width="500" height="400"/> */}
      <canvas ref={ref} hidden="hidden" />
      <input
        type="text"
        value={search}
        placeholder="Search dog breed"
        // onKeyDown={(e) => {
        //   if (search.length > 0 && e.key === 'Enter') {
        //     keywordSearch(search);
        //     setSearch('');
        //   }
        // }}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        type="button"
        onClick={handleImageSearch}
      >
        Search
      </button>
      <form className="meme-form" >
        {/* <input 
          type="text"
          name="topText"
          value={topText}
          onChange={(e) => {
            setTopText(e.target.value);
          }}
        /> */}
        <input 
          type="text"
          name="bottomText"
          value={bottomText}
          placeholder="arf arf"
          onChange={(e) => setBottomText(e.target.value)}
        />
        <button>Submit</button>
      </form>
        <div className="meme">
          <img src={dogImage} alt="" />
          <div className="overlay-text">{bottomText}</div>
          {/* <h2 className="bottom">{bottomText}</h2> */}
        </div>
        <button onClick={handleClick}>Save Meme</button>
    </div>
  )
}

export default MemeGenerator;