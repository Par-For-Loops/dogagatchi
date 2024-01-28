import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
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

  // PUT to update likes
  const updateLikes = (id) => {
    axios.put(`/memes/${id}`)
    // .then((response) => console.log(response))
    // .catch((err) => console.log(err))
  }

  const dislike = (id) => {
    axios.put(`/memes/dislike/${id}`)

  }

  const handleClick = (meme) => {
    // console.log(img._id)
    updateLikes(meme._id)
  }

  const handleDislike = (meme) => {
    // console.log(img._id)
    dislike(meme._id);
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
              <Card style={{ width: '325px' }}>
                <Card.Img
                  className="gallery-image"
                  style={loaded ? { width: '300px', height: 'auto' } : { display: 'none' }}
                  src={meme.img} 
                  alt={meme._id} 
                  onLoad={() => {
                    setLoaded(true)
                  }}
                />
                <Card.Body>
                  <Button 
                    className="emoji-button"
                    variant="outline-light"
                    size="sm"
                    type="submit"
                    onClick={() => handleClick(meme)}
                  >🙂</Button>
                  <Button
                    className="emoji-button"
                    variant="outline-light"
                    size="sm"
                    type="submit"
                    onClick={() => {
                      handleDislike(meme)
                    }}
                  >🫤</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        }
      </Row>
    </Container>
  );
};

export default Gallery;
