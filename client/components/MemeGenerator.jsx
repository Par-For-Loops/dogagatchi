import React, { useState } from 'react';

// const cloudinary = require('cloudinary');

function MemeGenerator() {
  // state text variables
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  // state image variable? would have to be passed down as props
  const image = "https://images.dog.ceo/breeds/corgi-cardigan/n02113186_10972.jpg";
  // could have search on same page?
  // render image on page
  // will need state for text
  // input and buttons for text
  // function to add text
  // post req to cloudinary
  
  // function to generate layered image url
  // function handleSubmit() {
  //   // construct URL here
  // }

  function postToMemeGallery(img) {
    // const text = topText.split(' ').join('%2520');

    // const transform = {transformation: [
    //   {width: 500, crop: "scale"},
    //   {color: "#FFFF0080", overlay: {font_family: "Impact", font_size: 90, font_weight: "bold", text: text}},
    //   {flags: "layer_apply", gravity: "south", y: 20}
    //   ]};

    axios.post('/api/meme', {
      image: img,
      // transform: transform
    })
      .then((response) => {
        console.log('upload response: ', response.data)
        // add cloudinary url to database here, put request
      })
      .catch((err) => console.error('Could not post to Cloudinary ', err))
  }
  function handleClick() {
    postToMemeGallery(image);
  }
  // console.log(cloudinary.url);

  return (
    <div>
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
        <button onClick={() => handleClick() }>Submit</button>
      </form>
        <div className="meme-image">
          <img src={image} alt="" />
          <h2 style={{ textAlign: "center", fontFamily: "impact", fontWeight: "bold" }}>{topText}</h2>
        </div>
    </div>
  )
}

export default MemeGenerator;