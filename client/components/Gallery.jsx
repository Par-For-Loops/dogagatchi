import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';

function Gallery() {
  // state variables
  const [memeGallery, setMemeGallery] = useState([])
  const [loaded, setLoaded] = useState(false);

  // GET meme objects from db
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

  const handleClick = (img) => {
    console.log(img._id)
  }

  // call getMemes on page render
  useEffect(() => {
    getMemes();
 
  }, [])


  return (
    <Container className="meme-gallery">
      <Row align="center" gap={3} style={{ listStyleType: 'none', paddingTop: '20px' }}>
        {
          memeGallery.map((meme) => (
            <Col className="gallery-column" key={meme._id}>
              <img
                className="gallery-image"
                style={loaded ? { width: '300px', height: 'auto' } : { display: 'none' }}
                src={meme.img} 
                alt={meme._id} 
                onLoad={() => {
                  setLoaded(true)
                }}
                onClick={() => handleClick(meme)}
              />
            </Col>
          ))
        }
      </Row>
    </Container>
  );
};

export default Gallery;
