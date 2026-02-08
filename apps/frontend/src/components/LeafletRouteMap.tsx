'use client';
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
const iconPerson = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', // Red for Start/End
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Helper component to center map and fetch route
function RouteManager({ start, end, setRoutePath }: { start: [number, number], end: [number, number], setRoutePath: (path: [number, number][]) => void }) {
    const map = useMap();

    useEffect(() => {
        if (start && end) {
            const bounds = L.latLngBounds([start, end]);
            map.fitBounds(bounds, { padding: [50, 50] });

            // Fetch OSRM Route
            const fetchRoute = async () => {
                try {
                    // OSRM Public API (Demo server)
                    // URL: {lon},{lat};{lon},{lat}
                    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
                    const response = await fetch(url);
                    const data = await response.json();

                    if (data.routes && data.routes.length > 0) {
                        const coordinates = data.routes[0].geometry.coordinates;
                        // GeoJSON is [lon, lat], Leaflet needs [lat, lon]
                        const latLngs = coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
                        setRoutePath(latLngs);
                    }
                } catch (error) {
                    console.error("Failed to fetch route from OSRM", error);
                    // Fallback to straight line
                    setRoutePath([start, end]);
                }
            };

            fetchRoute();
        }
    }, [start, end, map, setRoutePath]);

    return null;
}

// Bus Icon
const iconBus = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [35, 35],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
});

interface BusMarker {
    id: string;
    position: [number, number];
    label?: string;
}

export default function LeafletRouteMap({
    start,
    end,
    isTracking,
    buses,
    path
}: {
    start: [number, number],
    end: [number, number],
    isTracking: boolean,
    buses?: BusMarker[],
    path?: [number, number][]
}) {
    const [routePath, setRoutePath] = useState<[number, number][]>(path || [start, end]);

    useEffect(() => {
        if (path && path.length > 0) {
            setRoutePath(path);
        }
    }, [path]);

    return (
        <MapContainer center={start} zoom={13} scrollWheelZoom={true} className="w-full h-full" style={{ width: '100%', height: '100%' }}>
            {/* Google Maps Style Tiles */}
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <Marker position={start} icon={iconPerson}>
                <Popup>Start Point</Popup>
            </Marker>

            <Marker position={end} icon={iconPerson}>
                <Popup>Destination</Popup>
            </Marker>

            {/* Bus Markers */}
            {buses && buses.map(bus => (
                <Marker key={bus.id} position={bus.position} icon={iconBus}>
                    <Popup>{bus.label || `Bus ${bus.id}`}</Popup>
                </Marker>
            ))}

            <Polyline
                positions={routePath}
                pathOptions={{ color: '#3b82f6', weight: 6, opacity: 0.8 }}
            />

            {/* Only fetch OSRM if no path provided */}
            {!path && <RouteManager start={start} end={end} setRoutePath={setRoutePath} />}
        </MapContainer>
    );
}
