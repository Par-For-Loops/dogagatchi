import React from 'react'
import { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
// import Button from 'react-bootstrap'

mapboxgl.accessToken = 'pk.eyJ1Ijoia3ljb2RlZSIsImEiOiJjbHJxcndwam8wNmZsMmtwOXUyZ3JjNXo2In0.yLXXdweemHobMUJlc9GXvg';
function MyMap() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-90.09307721786142);
    const [lat, setLat] = useState(30.008068345656227);
    const [zoom, setZoom] = useState(13);

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
        let thisUser = JSON.parse(sessionStorage.user)
        console.log(thisUser.username)
    });
    
    
    function createMarker() {
        // var coordinates = e.lngLat
        // console.log(coordinates)
        map.marker = new mapboxgl.Marker({
            color: "orange",
            draggable: false
        })
        // .setLngLat([lng, lat])
        //     .addTo(map.current);
        
        .setLngLat([lng, lat])
            .addTo(map.current);
        const lngLat = map.marker.getLngLat()
        console.log(lngLat)
    }
      
    function clickForNewMarker(){
        map.current.on('click', (e) => {
            // setLng(e.lngLat.lng)
            // setLat(e.lngLat.lat)
            let coordinates = e.lngLat
            map.marker.setLngLat(coordinates)
            .addTo(map.current);
            console.log(e.lngLat)
            setLng(e.lngLat.lng)
            setLat(e.lngLat.lat)
        })
    }

      return (
        <div>
            <div>
                <div ref={mapContainer} className="map-container" ></div>
            </div>
            <h1 id='lngg' >longitude: {lng}</h1>
            <h1 id='latt' >latitude: {lat}</h1>
            <label htmlFor="boneLocation">Bone Note</label>
            {' '}
            <input type="text" name="" id="boneLocation" placeholder='Hide A Bone' />
            <br />
            <button>Click to save Point</button>
            <br />
            <button>Bone Locator</button>
        </div>
      );
}

export default MyMap