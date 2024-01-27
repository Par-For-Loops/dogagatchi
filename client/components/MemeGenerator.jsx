import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
      context.font = "40px Impact";
      context.textAlign = 'center';
      context.strokeStyle = 'white';
      context.lineWidth = 2;
      context.strokeText(bottomText, (image.width * .50), (image.height * .77));
      // context.stroke();
      context.fillText(bottomText, (image.width * .50), (image.height * .77));
      dataUrl = canvas.toDataURL("image/jpeg");
      //console.log(dataUrl);
      uploadDogImage(dataUrl);
    }
   // console.log(context)
   image.src = dogImage;
   image.crossOrigin="anonymous";

  }
  
  const handleImageSearch = () => {
    getDogPic(search);
  }

  const handleClick = () => {
    // e.preventDefault();
    memeCanvas();
  }

  // calls memeCanvas, to test
  useEffect(() => {
    getDogPic('corgi');
  }, []);

  return (
    <Container>
      {/* <Canvas width="500" height="400"/> */}
      <canvas ref={ref} hidden="hidden" />
      <Row>
        <Col>
          <input
            type="text"
            size="25"
            value={search}
            placeholder="Search dog breed"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            type="button"
            style={{ width: '100px'}}
            onClick={handleImageSearch}
          >
            Search
          </Button>
        <br />
          <Form className="meme-form" >
            <input 
              type="text"
              size="25"
              name="bottomText"
              value={bottomText}
              placeholder="Enter text"
              onChange={(e) => setBottomText(e.target.value)}
            />
          </Form>
        </Col>
      </Row>
      <br />
      <div className="meme">
        <img src={dogImage} alt="" />
        <div className="overlay-text">{bottomText}</div>
      </div>
      <br />
      <Button onClick={handleClick}>Save Meme</Button>
    </Container>
  )
}

export default MemeGenerator;