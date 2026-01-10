'use client';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Fix Leaflet Default Icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Bus Icon (CDN)
const icon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

// Pre-defined coords for speed/fallback
const cityCoords: any = {
    'Colombo': [6.9271, 79.8612],
    'Kandy': [7.2906, 80.6337],
    'Galle': [6.0535, 80.2210],
    'Matara': [5.9549, 80.5550],
    'Jaffna': [9.6615, 80.0255],
    'Anuradhapura': [8.3114, 80.4037],
    'Negombo': [7.2081, 79.8378],
    'Kurunegala': [7.4863, 80.3647]
};

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function RouteMap({ route, liveLocation }: { route: any, liveLocation?: any }) {
    const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
    const [endCoords, setEndCoords] = useState<[number, number] | null>(null);

    // Geocode cities when route changes
    useEffect(() => {
        const fetchCoords = async (city: string, setCoords: Function) => {
            if (cityCoords[city]) {
                setCoords(cityCoords[city]);
                return;
            }
            try {
                // Use OpenStreetMap Nominatim for free geocoding
                const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${city}, Sri Lanka`);
                if (res.data && res.data.length > 0) {
                    setCoords([parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)]);
                } else {
                    console.warn(`Could not find location for: ${city}`);
                    setCoords(cityCoords['Colombo']); // Fallback
                }
            } catch (err) {
                console.error("Geocoding error", err);
                setCoords(cityCoords['Colombo']);
            }
        };

        if (route) {
            fetchCoords(route.startCity, setStartCoords);
            fetchCoords(route.endCity, setEndCoords);
        }
    }, [route]);

    if (!startCoords || !endCoords) return <div className="text-gray-500 text-center p-10">Loading map location...</div>;

    const polylinePositions = [startCoords, endCoords];
    const center: [number, number] = [
        (startCoords[0] + endCoords[0]) / 2,
        (startCoords[1] + endCoords[1]) / 2
    ];

    // Dark Theme Tiles (CartoDB Dark Matter)
    const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

    return (
        <MapContainer center={center} zoom={9} style={{ height: '100%', width: '100%', borderRadius: '1rem' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url={darkTiles}
            />

            {/* Start Marker */}
            <Marker position={startCoords}>
                <Popup>Start: {route?.startCity}</Popup>
            </Marker>

            {/* End Marker */}
            <Marker position={endCoords}>
                <Popup>End: {route?.endCity}</Popup>
            </Marker>

            {/* Live Bus Marker */}
            {liveLocation && (
                <Marker position={[liveLocation.lat, liveLocation.lng]} icon={icon}>
                    <Popup>Live Bus Status: {liveLocation.speed} km/h</Popup>
                </Marker>
            )}

            {/* Route Path */}
            <Polyline positions={polylinePositions} color="cyan" weight={4} opacity={0.7} dashArray="10, 10" />

            <MapController center={center} />
        </MapContainer>
    );
}
