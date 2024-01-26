import React, { useEffect, useRef } from "react";
import axios from 'axios';

function Canvas(props) {
  const ref = useRef();
  // console.log(ref);
  let dataUrl;

  function post(url) {
    axios.post('/api/gallery', {
      url: url
      })
      .then((response) => {
        console.log('upload response: ', response.data)
        // add cloudinary url to database here, put request
      })
      .catch((err) => console.error('Could not post to Cloudinary ', err))

  }

  useEffect(() => {
    // console.log(image)
    const canvas = ref.current;
    // console.log(canvas)
    const context = canvas.getContext('2d');
    //console.log(context)
  
    let image = new Image()
    image.onload = function() {
      context.drawImage(image, 0, 0);
      context.font = "30px Arial";
      context.fillText("Hello World", 10, 50);
      dataUrl = canvas.toDataURL("image/jpeg");
      // console.log(typeof dataUrl);
      // post(dataUrl);
    }
   // console.log(context)
   image.src = "https://images.dog.ceo/breeds/corgi-cardigan/n02113186_10972.jpg";
   image.crossOrigin="anonymous";
  //  dataUrl = canvas.toDataURL("image/jpeg");
  //  console.log(dataUrl);

   // post(dataUrl);

  }, []);

  return (
    <canvas ref={ref} {...props}/>
  
  )
}

export default Canvas;