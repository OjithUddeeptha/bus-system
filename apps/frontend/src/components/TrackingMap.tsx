'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
const iconPerson = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const iconBus = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    className: 'bus-marker-icon'
});

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function TrackingMap({ busLocation, speed }: { busLocation: [number, number], speed: number }) {
    return (
        <MapContainer center={[6.9, 79.9]} zoom={10} scrollWheelZoom={true} className="w-full h-full" style={{ width: '100%', height: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <LocateControl />

            <Marker position={[6.9271, 79.8612]} icon={iconPerson}>
                <Popup>You are here (Colombo)</Popup>
            </Marker>

            <Marker position={[6.0535, 80.2210]} icon={iconPerson}>
                <Popup>Destination (Galle)</Popup>
            </Marker>

            <Marker position={busLocation} icon={iconBus}>
                <Popup>
                    <div className="text-black text-center">
                        <strong>Bus ND-4520</strong><br />
                        Speed: {speed} km/h
                    </div>
                </Popup>
            </Marker>

            <Polyline
                positions={[
                    [6.9271, 79.8612],
                    [6.0535, 80.2210]
                ]}
                pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.7, dashArray: '10, 10' }}
            />

            <MapUpdater center={busLocation} />
        </MapContainer>
    );
}

function LocateControl() {
    const map = useMap();

    const handleLocate = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                map.flyTo([latitude, longitude], 15, {
                    animate: true,
                    duration: 1.5
                });

                // Add a marker for current location if needed, or just center
                L.popup()
                    .setLatLng([latitude, longitude])
                    .setContent("You are here")
                    .openOn(map);
            },
            () => {
                alert("Unable to retrieve your location. Please enable GPS.");
            }
        );
    };

    return (
        <div className="leaflet-top leaflet-right">
            <div className="leaflet-control leaflet-bar">
                <button
                    onClick={handleLocate}
                    className="bg-white text-black p-2 hover:bg-gray-100 font-bold shadow-md cursor-pointer flex items-center justify-center w-10 h-10"
                    title="Pan to Current Location"
                    style={{ pointerEvents: 'auto' }}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L12 22"></path>
                        <path d="M2 12L22 12"></path>
                        <circle cx="12" cy="12" r="6"></circle>
                    </svg>
                </button>
            </div>
        </div>
    );
}
