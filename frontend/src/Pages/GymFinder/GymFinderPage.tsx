import React, { useEffect, useState } from 'react';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

import TopBar from '../../Components/TopBar';

const GymFinderPage: React.FC = () => {
    const [currentLocation, setCurrentLocation] = useState<[number, number]>([0, 0]);
    const [fitnessCenters, setFitnessCenters] = useState<any[]>([]);

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
        const radiusInMiles = 25; //TODO: Figure out reasonable value
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

    const defaultIcon = new Icon({
        iconUrl: markerIconPng,
        shadowUrl: markerShadowPng,

        iconSize:     [25, 41],
        shadowSize:   [50, 64],
        iconAnchor:   [12, 41], 
        shadowAnchor: [13, 62],
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

    return (
        <div style={{ position: 'relative' }}>
            <TopBar title="Gym Finder" titleColor="#ffffff" />
            <div style={{ position: 'absolute', top: '75px', bottom: '0', width: '100%' }}>
                {currentLocation[0] !== 0 && currentLocation[1] !== 0 && ( //Load Map when positions aren't default 0,0; fix async issue
                    <MapContainer center={[currentLocation[0], currentLocation[1]]} zoom={13} style={{ height: '90vh' }}>
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
    );
};

export default GymFinderPage;
