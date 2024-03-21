import React, { useEffect, useState } from 'react';
import TopBar from '../../Components/TopBar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'

import { Icon } from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"

const GymFinderPage = () => {
    const [currentLocation, setCurrentLocation] = useState([0, 0]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                setCurrentLocation([position.coords.latitude, position.coords.longitude]);
                console.log(position)
                console.log(currentLocation)
            },
            error => {
                console.error('Error getting location:', error);
            }
        );
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (
        <div style={{ position: 'relative' }}>
            <TopBar title="Gym Finder" titleColor="#ffffff" />
            <div style={{ position: 'absolute', top: '60px', bottom: '0', width: '100%' }}>
                <MapContainer center={[42.2746, -71.8068]} zoom={13} style={{ height: "90vh" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[42.2746, -71.8068]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                        <Popup>You are here</Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
};

export default GymFinderPage;
