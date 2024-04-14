import React, { useEffect, useState } from 'react';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';

import TopBar from '../../Components/TopBar';

const GymFinderPage: React.FC = () => {
    const [currentLocation, setCurrentLocation] = useState<[number, number]>([0, 0]); //TODO: Implement properly
    const [fitnessCenters, setFitnessCenters] = useState<any[]>([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                setCurrentLocation([position.coords.latitude, position.coords.longitude]);
                fetchFitnessCenters(position.coords.latitude, position.coords.longitude);
            },
            error => {
                console.error('Error:', error);
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

    return (
        <div style={{ position: 'relative' }}>
            <TopBar title="Gym Finder" titleColor="#ffffff" />
            <div style={{ position: 'absolute', top: '60px', bottom: '0', width: '100%' }}>
                <MapContainer center={[42.2746, -71.8068]} zoom={13} style={{ height: '90vh' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[42.2746, -71.8068]} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
                        <Popup>You are here</Popup>
                    </Marker>
                    {fitnessCenters.map((center, index) => (
                        <Marker key={index} position={[center.lat, center.lon]} icon={new Icon({ iconUrl: 'https://fonts.gstatic.com/s/i/materialicons/fitness_center/v10/24px.svg', iconSize: [25, 41], iconAnchor: [12, 41] })}>
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
            </div>
        </div>
    );
};

export default GymFinderPage;
