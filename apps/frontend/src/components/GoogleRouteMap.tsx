// ... imports
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { useState, useEffect, useCallback, useRef } from 'react';

// ... constants
const containerStyle = {
    width: '100%',
    height: '100%'
};

const defaultCenter = {
    lat: 6.9271,
    lng: 79.8612
};

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ['places', 'geometry'];

interface GoogleRouteMapProps {
    start: string;
    end: string;
    liveLocation?: { lat: number; lng: number; heading?: number };
    simulateTracking?: boolean;
}

export default function GoogleRouteMap({ start, end, liveLocation, simulateTracking = true }: GoogleRouteMapProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries
    });

    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [simulatedPos, setSimulatedPos] = useState<{ lat: number; lng: number; heading: number } | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);

    // Animation Refs
    const pathRef = useRef<google.maps.LatLng[]>([]);
    const progressRef = useRef(0);
    const animationFrameRef = useRef<number>(0);

    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(() => {
        mapRef.current = null;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }, []);

    // Fetch Directions
    useEffect(() => {
        if (!isLoaded || !start || !end) return;

        const directionsService = new google.maps.DirectionsService();

        directionsService.route(
            {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.TRANSIT, // Or DRIVING for smoother paths
                provideRouteAlternatives: false,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && result) {
                    setDirections(result);

                    // Start Simulation if enabled and no live location provided
                    if (simulateTracking && !liveLocation && result.routes[0]?.overview_path) {
                        pathRef.current = result.routes[0].overview_path;
                        progressRef.current = 0;
                        startAnimation();
                    }
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    }, [isLoaded, start, end, simulateTracking, liveLocation]);

    const startAnimation = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        const animate = () => {
            if (!pathRef.current || pathRef.current.length < 2) return;

            // Simple traversal: Index based or distance based. 
            // Let's do a smooth index traversal.
            // Total points
            const totalPoints = pathRef.current.length;
            // Speed factor
            const speed = 0.05; // Points per frame (adjust for speed)

            progressRef.current += speed;

            // Loop
            if (progressRef.current >= totalPoints - 1) {
                progressRef.current = 0;
            }

            const index = Math.floor(progressRef.current);
            const nextIndex = index + 1;
            const fraction = progressRef.current - index;

            // Interpolate between current and next point
            if (pathRef.current[index] && pathRef.current[nextIndex]) {
                const p1 = pathRef.current[index];
                const p2 = pathRef.current[nextIndex];

                const lat = p1.lat() + (p2.lat() - p1.lat()) * fraction;
                const lng = p1.lng() + (p2.lng() - p1.lng()) * fraction;

                // Calculate Heading
                const heading = google.maps.geometry.spherical.computeHeading(p1, p2);

                setSimulatedPos({ lat, lng, heading });
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();
    };

    // Cleanup animation on unmount or prop change
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);


    if (!isLoaded) return <div className="w-full h-full bg-gray-200 flex items-center justify-center animate-pulse">Loading Google Maps...</div>;

    // Determine which position to show
    const currentBusPos = liveLocation || simulatedPos;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
            }}
        >
            {directions && (
                <DirectionsRenderer
                    directions={directions}
                    options={{
                        polylineOptions: {
                            strokeColor: '#1a73e8',
                            strokeWeight: 5,
                        },
                        suppressMarkers: false,
                    }}
                />
            )}

            {/* Live Bus Marker */}
            {currentBusPos && (
                <Marker
                    position={{ lat: currentBusPos.lat, lng: currentBusPos.lng }}
                    icon={{
                        // Use a custom bus icon or the arrow
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 6,
                        fillColor: "#00CC00", // Green for moving bus
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#FFFFFF",
                        rotation: currentBusPos.heading || 0,
                    }}
                    title="Live Bus Location"
                    zIndex={1000}
                />
            )}
        </GoogleMap>
    );
}
