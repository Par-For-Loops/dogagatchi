import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// import Canvas from './Canvas.jsx';

// const cloudinary = require('cloudinary');

function MemeGenerator() {
  const ref = useRef();
  // state dog image
  const [dogImage, setDogImage] = useState('')
  // search
  const [search, setSearch] = useState('')
  // state text variables
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  // state image variable? would have to be passed down as props
  // data Url variable, will be state
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
      context.fillText("Hello World", 10, 50);
      dataUrl = canvas.toDataURL("image/jpeg");
      console.log(dataUrl);
      // console.log(image.height);
      // post(dataUrl);
    }
   // console.log(context)
   image.src = "https://images.dog.ceo/breeds/corgi-cardigan/n02113186_10972.jpg";
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
        <input 
          type="text"
          name="topText"
          value={topText}
          onChange={(e) => {
            setTopText(e.target.value);
          }}
        />
        <input 
          type="text"
          name="bottomText"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
        />
        <button>Submit</button>
      </form>
        <div className="meme-image">
          <img src={dogImage} alt="" />
          <h2 style={{ textAlign: "center", fontFamily: "impact", fontWeight: "bold" }}>{topText}</h2>
        </div>
        <button onClick={handleClick}>Save Meme</button>
    </div>
  )
}

export default MemeGenerator;