import React from 'react'
import { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { Button } from 'react-bootstrap'
import axios from 'axios'

mapboxgl.accessToken = 'pk.eyJ1Ijoia3ljb2RlZSIsImEiOiJjbHJxcndwam8wNmZsMmtwOXUyZ3JjNXo2In0.yLXXdweemHobMUJlc9GXvg';
function MyMap() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-90.09307721786142);
    const [lat, setLat] = useState(30.008068345656227);
    const [zoom, setZoom] = useState(13);
    const [allMarkers, setMarkers] = useState([])
    const [boneComment, addComment] = useState('')
    // Set marker options.
    
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        createMarker()
        clickForNewMarker()
        retrieveAllMarkers()
        clickToShowBones()
    }, []);
    
    useEffect(() => {
        retrieveAllMarkers()
    }, [allMarkers])
    
    function createMarker() {
        map.marker = new mapboxgl.Marker({
            color: "orange",
            draggable: false
        }) 
        .setLngLat([lng, lat])
            .addTo(map.current);
    }
      
    function clickForNewMarker(){
        map.current.on('click', (e) => {
            let coordinates = e.lngLat
            map.marker.setLngLat(coordinates)
            .addTo(map.current);
            setLng(e.lngLat.lng)
            setLat(e.lngLat.lat)
        })
    }


    function retrieveAllMarkers(){
        let thisUser = JSON.parse(sessionStorage.user)
        // console.log(thisUser.username)
        axios.get(`/user/hiddenBones/${thisUser.username}`)
        .then((hiddenBonesArr) => {
            setMarkers(hiddenBonesArr.data)
        })
    }

    function clickToShowBones() {
        // console.log(allMarkers)
        for(let i = 0; i < allMarkers.length; i++){
            const popup = new mapboxgl.Popup({ offset: 25 }).setText(allMarkers[i].boneNote);
            new mapboxgl.Marker({
                color: "blue",
                draggable: false
            })
            .setLngLat([allMarkers[i].lng, allMarkers[i].lat])
            .setPopup(popup)
                .addTo(map.current);
        }
       
    }



    function addCommentOnClick() {
        // addComment
        
        let thisUser = JSON.parse(sessionStorage.user)
            // put request to send location to db
            axios.put(`/user/hiddenBones/${thisUser.username}`, {
                lng: lng, 
                lat: lat, 
                boneNote: boneComment
            })
            .then((userObj) => {
                console.log('successfully added put request on location click')
                // setMarkers(userObj.hiddenBones)
                let inputBox = document.getElementById('boneLocation')
                inputBox.value = ''
            })
            .catch((err) => {
                console.log('unsucessful put request on click of location', err)
            })
    }
    

    function handleChange(e) {
        // console.log(e.target.value)
        addComment(e.target.value)
    }


      return (
        <div>
            <div>
                <div ref={mapContainer} className="map-container" ></div>
            </div>
            <br />
            <div id='bigMapDiv'>
                <h1>COME ALONG ON A BONE ADVENTURE!</h1>
                <h4>**Click where you want to bury your bone and leave yourself a little note about this special place!**</h4>
            <br />
            <label htmlFor="boneLocation" id='boneLocationLabel'>Bone Note</label>
            {' '}
            <input type="text" name="" id="boneLocation" placeholder='Add a note here' onChange={handleChange}/>
            <br />
            <br />
            <Button onClick={addCommentOnClick}>Bury My Bone 🦴</Button>
            <br />
            <br />
            <Button id='boneLocator' onClick={clickToShowBones}>Show My Bone Collection</Button>
            </div>
        </div>
      );
}

export default MyMap