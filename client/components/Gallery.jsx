import React, { useState, useEffect } from "react";
import axios from 'axios';

function Gallery() {
  // // state variable for dog pics
  const [memeGallery, setMemeGallery] = useState([])
  const [loaded, setLoaded] = useState(false);
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

  const getMemes = () => {
    axios.get('/memes')
      .then(({data}) => {
        // console.log(data);
        setMemeGallery(data)
      })
      .catch((err) => {
        console.error(err)
      });
  }

  useEffect(() => {
    getMemes();
 
  }, [])


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
      <ul>
        {
          memeGallery.map((meme) => (
            <li key={meme._id}>
              <img 
                // style={{ width: '300px', height: 'auto' }}
                style={loaded ? { width: '300px', height: 'auto' } : { display: 'none' }}
                src={meme.img} 
                alt={meme._id} 
                onLoad={() => {
                  // console.log(meme.createdAt)
                  setLoaded(true)
                }}
              />
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default Gallery;

          // memeGallery.map((meme) => {
          //   let img = new Image();
          //   img.onload = () => (
          //     <li key={meme._id}>
          //       <img 
          //         style={{ width: '300px', height: 'auto' }}
          //         src={img.src} 
          //         alt={meme._id} />
          //    </li>
          //   );
          //   img.src = meme.url;
          // })
        //   <ul className="meme-gallery">
        //   {/* <img src='http://res.cloudinary.com/dsxmv5yjt/image/upload/v1706370861/sburb6myaf0m4pttcvyn.jpg' alt="" /> */}
        //   {
        //     memeGallery.map((meme) => (
        //       <li key={meme._id}>
        //         <img 
        //           style={{ width: '300px', height: 'auto' }}
        //           src={meme.url} 
        //           alt={meme._id} />
        //       </li>
        //     ))
        //   }
        // </ul>