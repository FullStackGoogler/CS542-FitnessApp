import React, { useEffect, useState } from 'react';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

import TopBar from '../../Components/TopBar';

import './GymFinderPage.css'

const GymFinderPage: React.FC = () => {
    const [currentLocation, setCurrentLocation] = useState<[number, number]>([0, 0]);
    const [fitnessCenters, setFitnessCenters] = useState<any[]>([]);

    const defaultIcon = new Icon({
        iconUrl: markerIconPng,
        shadowUrl: markerShadowPng,

        iconSize:     [25, 41],
        shadowSize:   [50, 64],
        iconAnchor:   [12, 41], 
        shadowAnchor: [15, 64],
        popupAnchor:  [0, -41]
    })

    const gymIcon = new Icon({
        iconUrl: 'https://fonts.gstatic.com/s/i/materialicons/fitness_center/v10/24px.svg',
        shadowUrl: markerShadowPng,

        iconSize:     [25, 41],
        shadowSize:   [50, 64],
        iconAnchor:   [12, 41], 
        shadowAnchor: [15, 79],
        popupAnchor:  [0, -41]
    })

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log(position.coords.latitude) //TODO: Debugging
                console.log(position.coords.longitude) //TODO: Debugging
                setCurrentLocation([position.coords.latitude, position.coords.longitude]);
                fetchFitnessCenters(position.coords.latitude, position.coords.longitude);
            },
            error => {
                console.error('Error fetching current position:', error);
            }
        );
    }, []);

    const fetchFitnessCenters = (latitude: number, longitude: number) => {
        const radiusInMiles = 10; //TODO: Figure out reasonable value
        const query = `[out:json];
            node(around:${radiusInMiles * 1609.34},${latitude},${longitude})["leisure"="fitness_centre"];
            out;`;

        fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `data=${encodeURIComponent(query)}`
        })
        .then(response => response.json())
        .then(data => {
            setFitnessCenters(data.elements);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="container">
            <TopBar title="Gym Finder" titleColor="#ffffff" />
            <div className="content">
                <div className="gym-list">
                    <Typography variant="h6" gutterBottom>Nearby Gyms</Typography>
                    <List>
                        {fitnessCenters.map((center, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemText primary={center.tags.name} secondary={
                            Object.entries(center.tags)
                                .filter(([key]) => key !== 'name')
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')
                            } />
                        </ListItem>
                        ))}
                    </List>
                </div>
                <div className="map-container">
                    {currentLocation[0] !== 0 && currentLocation[1] !== 0 && (
                        <MapContainer center={[currentLocation[0], currentLocation[1]]} zoom={13} style={{ height: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[currentLocation[0], currentLocation[1]]} icon={defaultIcon}>
                            <Popup>You are here</Popup>
                        </Marker>
                        {fitnessCenters.map((center, index) => (
                            <Marker key={index} position={[center.lat, center.lon]} icon={gymIcon}>
                            <Popup>
                                {Object.entries(center.tags).map(([key, value]) => (
                                <div key={key}>
                                    <strong>{key}: </strong> {value as string}
                                </div>
                                ))}
                            </Popup>
                            </Marker>
                        ))}
                        </MapContainer>
                    )}
                </div>
            </div>
        </div>
    );
};
    
export default GymFinderPage;