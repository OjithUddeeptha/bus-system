'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import LocationAutocomplete from '@/components/LocationAutocomplete';
import { FaBus, FaSearch, FaMapMarkerAlt, FaExchangeAlt, FaClock, FaEllipsisV } from 'react-icons/fa';

// Dynamic Import for Leaflet Map (Client Side Only)
const LeafletRouteMap = dynamic(() => import('@/components/LeafletRouteMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Loading Map...</div>
});

interface Trip {
    id: string; // scheduleId
    departureTime: string;
    arrivalTime: string;
    route: {
        routeNumber: string;
        price: number;
        startCity: string;
        endCity: string;
        distance: number;
    };
    bus: {
        number: string;
        capacity: number;
    };
}

export default function SearchPage() {
    const [from, setFrom] = useState('Colombo');
    const [to, setTo] = useState('Kandy');
    const [fromCoords, setFromCoords] = useState<[number, number] | null>(null);
    const [toCoords, setToCoords] = useState<[number, number] | null>(null);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(false);

    // Map params: Start/End coordinates
    const [mapParams, setMapParams] = useState<{ start: [number, number], end: [number, number] } | null>(null);

    const geocodeCity = async (city: string): Promise<[number, number] | null> => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}, Sri Lanka`);
            const data = await res.json();
            if (data && data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            return null;
        } catch (err) {
            console.error("Geocoding failed", err);
            return null;
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!from || !to) return;

        setLoading(true);
        setSelectedTrip(null);

        // 1. Geocode Real Locations for Map (Prioritize AutoComplete coords)
        let startCoord = fromCoords;
        let endCoord = toCoords;

        if (!startCoord) startCoord = await geocodeCity(from);
        if (!endCoord) endCoord = await geocodeCity(to);

        if (startCoord && endCoord) {
            setMapParams({ start: startCoord, end: endCoord });
        }

        try {
            // 2. Fetch Routes & Schedules from Backend
            const res = await api.get('/routes/search', {
                params: { start: from, end: to }
            });
            const fetchedRoutes = res.data;

            // 3. Transform Nested Routes/Schedules into Flat "Trips"
            const allTrips: Trip[] = fetchedRoutes.flatMap((r: any) =>
                (r.schedules || []).map((s: any) => ({
                    id: s.id,
                    departureTime: s.departureTime,
                    arrivalTime: s.arrivalTime,
                    route: {
                        routeNumber: r.routeNumber,
                        price: r.price,
                        startCity: r.startCity,
                        endCity: r.endCity,
                        distance: r.distance
                    },
                    bus: s.bus || { number: 'TBD', capacity: 40 }
                }))
            );

            // Sort by departure time
            allTrips.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());

            setTrips(allTrips);

            if (allTrips.length > 0) {
                // Auto-select first trip
                setSelectedTrip(allTrips[0]);
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden font-sans">
            {/* Left Sidebar */}
            <div className="w-full md:w-[400px] flex-shrink-0 bg-white shadow-2xl z-20 flex flex-col border-r border-gray-200">

                {/* Search Header */}
                <div className="p-4 bg-white shadow-sm z-10 sticky top-0">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FaBus className="text-blue-600" /> Find Bus
                        </h1>
                        <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
                            <FaEllipsisV />
                        </button>
                    </div>

                    {/* Search Inputs */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm relative mb-3">
                        <div className="absolute left-6 top-10 bottom-10 width-0.5 border-l-2 border-dotted border-gray-300 z-0"></div>
                        <div className="relative bg-white z-10">
                            <div className="flex items-center px-4 py-3 border-b border-gray-200">
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-4 bg-white"></div>
                                <LocationAutocomplete
                                    placeholder="From (e.g. Colombo)"
                                    defaultValue={from}
                                    onPlaceSelected={(place) => {
                                        setFrom(place.city);
                                        setFromCoords([place.lat, place.lng]);
                                    }}
                                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 font-medium w-full"
                                />
                            </div>
                            <div className="flex items-center px-4 py-3">
                                <FaMapMarkerAlt className="text-red-500 text-lg mr-3 ml-0.5" />
                                <LocationAutocomplete
                                    placeholder="To (e.g. Kandy)"
                                    defaultValue={to}
                                    onPlaceSelected={(place) => {
                                        setTo(place.city);
                                        setToCoords([place.lat, place.lng]);
                                    }}
                                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 font-medium w-full"
                                />
                            </div>
                        </div>
                        <button
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 p-2 rounded-full shadow border border-gray-200 z-20"
                            onClick={() => { const temp = from; setFrom(to); setTo(temp); }}
                        >
                            <FaExchangeAlt className="text-gray-500 transform rotate-90" />
                        </button>
                    </div>

                    <button
                        onClick={handleSearch}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition flex justify-center items-center gap-2"
                        disabled={loading}
                    >
                        {loading ? 'Finding Buses...' : (
                            <>
                                <FaSearch /> Search Route
                            </>
                        )}
                    </button>
                </div>

                {/* Filters / Mode */}
                <div className="flex items-center justify-start px-6 gap-6 border-b border-gray-200 py-3 bg-gray-50">
                    <div className="flex flex-col items-center gap-1 text-blue-600 cursor-pointer">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <FaBus />
                        </div>
                        <span className="text-xs font-bold">Best</span>
                    </div>
                </div>

                {/* Results List */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-2 space-y-2">
                    {loading && (
                        <div className="p-10 text-center text-gray-500 animate-pulse">
                            Searching for best routes...
                        </div>
                    )}

                    {!loading && trips.length === 0 && mapParams && (
                        <div className="p-8 text-center text-gray-500">
                            <p className="font-medium">No scheduled buses found.</p>
                            <span className="text-xs text-gray-400">Try changing the date or cities.</span>
                        </div>
                    )}

                    {trips.map((trip) => (
                        <div
                            key={trip.id}
                            onClick={() => setSelectedTrip(trip)}
                            className={`bg-white p-4 rounded-lg shadow-sm border cursor-pointer transition hover:bg-blue-50 relative overflow-hidden ${selectedTrip?.id === trip.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
                        >
                            {/* Time / Duration */}
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-gray-800 font-bold text-lg">
                                        Bus {trip.route.routeNumber}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-medium">{trip.bus?.number || 'Normal'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-900 font-bold">
                                        {new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-gray-500 text-xs text-right">
                                        {new Date(trip.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Arr
                                    </p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                                <FaClock className="text-gray-400" />
                                <span>{new Date(trip.departureTime).toDateString()}</span>
                            </div>

                            {/* Ticket Price Badge */}
                            <div className="absolute bottom-4 right-4 bg-gray-200 text-gray-800 text-xs font-bold px-2 py-1 rounded">
                                LKR {trip.route.price?.toFixed(2) || '450.00'}
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {trips.length === 0 && !loading && !mapParams && (
                        <div className="text-center p-8 text-gray-400">
                            Enter start and end locations to find directions.
                        </div>
                    )}
                </div>
            </div>

            {/* Right Map Area */}
            <div className="flex-1 bg-gray-200 relative">
                {mapParams ? (
                    <LeafletRouteMap
                        start={mapParams.start}
                        end={mapParams.end}
                        isTracking={!!selectedTrip}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                        <FaBus className="text-6xl mb-4 opacity-10" />
                        <p>Map View</p>
                    </div>
                )}
            </div>
        </div>
    );
}
