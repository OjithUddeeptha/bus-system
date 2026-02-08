'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { FaStar, FaMapMarkerAlt, FaSearch, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: 6.9271,
    lng: 79.8612
};

const LIBRARIES: ("places")[] = ["places"];

export default function ExplorePage() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: LIBRARIES
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [searchType, setSearchType] = useState('restaurant');

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    const searchNearby = useCallback(() => {
        if (!map) return;

        const service = new google.maps.places.PlacesService(map);
        const request: google.maps.places.PlaceSearchRequest = {
            location: map.getCenter() || center,
            radius: 2000,
            type: searchType
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                setPlaces(results);
            }
        });
    }, [map, searchType]);

    useEffect(() => {
        if (map) {
            searchNearby();
        }
    }, [map, searchNearby]);

    if (!isLoaded) return <div className="h-screen w-full flex items-center justify-center bg-gray-100">Loading Maps...</div>;

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden font-sans bg-white">
            {/* Sidebar */}
            <div className="w-full md:w-[400px] flex-shrink-0 bg-white shadow-xl z-10 flex flex-col border-r border-gray-200">
                <div className="p-4 bg-white shadow-sm z-10 sticky top-0">
                    <div className="flex items-center gap-2 mb-4">
                        <Link href="/dashboard/passenger" className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
                            <FaArrowLeft />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">Neighborhood Discovery</h1>
                    </div>

                    <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                        {['restaurant', 'cafe', 'park', 'museum', 'shopping_mall', 'tourist_attraction'].map(type => (
                            <button
                                key={type}
                                onClick={() => setSearchType(type)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition ${searchType === type
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {places.map(place => (
                        <div
                            key={place.place_id}
                            onClick={() => {
                                setSelectedPlace(place);
                                map?.panTo(place.geometry?.location || center);
                                map?.setZoom(16);
                            }}
                            className={`flex gap-3 p-3 rounded-xl border cursor-pointer hover:shadow-md transition ${selectedPlace?.place_id === place.place_id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'}`}
                        >
                            <div className="w-20 h-20 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                                {place.photos?.[0] ? (
                                    <img src={place.photos[0].getUrl({ maxWidth: 100 })} alt={place.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <FaMapMarkerAlt />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate">{place.name}</h3>
                                <div className="flex items-center gap-1 text-sm text-yellow-500 my-1">
                                    <span className="font-bold">{place.rating}</span>
                                    <FaStar />
                                    <span className="text-gray-400 text-xs">({place.user_ratings_total})</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{place.vicinity}</p>
                                {place.opening_hours?.open_now && (
                                    <span className="text-[10px] font-bold text-green-600 uppercase mt-1 inline-block">Open Now</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative bg-gray-100">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={14}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                    }}
                >
                    {places.map(place => (
                        <Marker
                            key={place.place_id}
                            position={place.geometry?.location || center}
                            onClick={() => setSelectedPlace(place)}
                        />
                    ))}

                    {selectedPlace && selectedPlace.geometry?.location && (
                        <InfoWindow
                            position={selectedPlace.geometry.location}
                            onCloseClick={() => setSelectedPlace(null)}
                        >
                            <div className="p-2 max-w-xs">
                                <h3 className="font-bold text-lg">{selectedPlace.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{selectedPlace.vicinity}</p>
                                <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
                                    <span className="font-bold">{selectedPlace.rating}</span> <FaStar />
                                </div>
                                {selectedPlace.photos?.[0] && (
                                    <img
                                        src={selectedPlace.photos[0].getUrl({ maxWidth: 200 })}
                                        alt={selectedPlace.name}
                                        className="w-full h-32 object-cover rounded-md"
                                    />
                                )}
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>

                {/* Helper Button */}
                <button
                    onClick={searchNearby}
                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg font-bold text-sm text-blue-600 hover:bg-gray-50 transition z-10 flex items-center gap-2"
                >
                    <FaSearch /> Search This Area
                </button>
            </div>
        </div>
    );
}
