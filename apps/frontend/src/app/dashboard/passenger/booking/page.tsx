'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { FaBus, FaSearch, FaMapMarkerAlt, FaExchangeAlt, FaClock, FaFilter, FaWifi, FaSnowflake, FaChair } from 'react-icons/fa';
import SeatSelectionModal from '@/components/SeatSelectionModal';

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

const POPULAR_ROUTES = [
    { from: 'Kandy', to: 'Colombo', label: '001 Mahanuwara ↔ Colombo' },
    { from: 'Warakapola', to: 'Colombo', label: '001/2 Warakapola ↔ Colombo' },
    { from: 'Negombo', to: 'Kandy', label: '001/245 Migamuwa ↔ Mahanuwara' },
    { from: 'Colombo', to: 'Matara', label: '002 Colombo ↔ Matara' },
    { from: 'Colombo', to: 'Galle', label: '002-1 Colombo ↔ Galle' },
    { from: 'Colombo', to: 'Embilipitiya', label: '003 Colombo ↔ Embilipitiya' },
    { from: 'Puttalam', to: 'Colombo', label: '004 Puttalam ↔ Colombo' },
    { from: 'Anuradhapura', to: 'Matara', label: '004 Anuradhapura ↔ Matara' },
    { from: 'Jaffna', to: 'Colombo', label: '015 Jaffna ↔ Colombo' },
    { from: 'Badulla', to: 'Colombo', label: '099 Badulla ↔ Colombo' },
    { from: 'Trincomalee', to: 'Colombo', label: '049 Trincomalee ↔ Colombo' },
];

export default function BookingPage() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [trips, setTrips] = useState<Trip[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!from || !to) return;

        setLoading(true);
        setHasSearched(true);
        setSelectedTrip(null);

        try {
            // Fetch Routes & Schedules from Backend (Text Search)
            const res = await api.get('/routes/search', {
                params: { start: from, end: to }
            });
            const fetchedRoutes = res.data;

            // Transform Nested Routes/Schedules into Flat "Trips"
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
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTrip = (trip: Trip) => {
        setSelectedTrip(trip);
        setIsSeatModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32 font-sans text-gray-800">
            {/* Hero Search Section - Orange Theme for Booking to differentiate */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 pt-8 pb-16 px-4 rounded-b-[3rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <FaBus className="text-[20rem] text-white absolute -right-20 -top-20" />
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-6 text-center">Book Your Seat</h1>

                    <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 items-center mb-6">
                        {/* ... Existing Inputs ... */}
                        <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl w-full h-14 border border-transparent hover:border-gray-200 transition-colors">
                            <FaMapMarkerAlt className="text-orange-500 text-lg mr-3" />
                            <input
                                type="text"
                                placeholder="From (e.g. Colombo)"
                                value={from}
                                onChange={e => setFrom(e.target.value)}
                                className="bg-transparent flex-1 outline-none text-gray-800 font-semibold placeholder-gray-400"
                            />
                        </div>

                        <button
                            type="button"
                            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 text-orange-600 transition shadow-sm md:rotate-0 rotate-90"
                            onClick={() => { const temp = from; setFrom(to); setTo(temp); }}
                        >
                            <FaExchangeAlt />
                        </button>

                        <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl w-full h-14 border border-transparent hover:border-gray-200 transition-colors">
                            <FaMapMarkerAlt className="text-red-500 text-lg mr-3" />
                            <input
                                type="text"
                                placeholder="To (e.g. Kandy)"
                                value={to}
                                onChange={e => setTo(e.target.value)}
                                className="bg-transparent flex-1 outline-none text-gray-800 font-semibold placeholder-gray-400"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold h-14 px-8 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 w-full md:w-auto justify-center"
                            disabled={loading}
                        >
                            {loading ? <span className="animate-spin">⌛</span> : <FaSearch />}
                            <span>Find Buses</span>
                        </button>
                    </form>

                    {/* Popular Routes Shortcuts */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        <span className="text-white/80 text-sm font-bold mr-2 py-1">Popular:</span>
                        {POPULAR_ROUTES.map((route, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setFrom(route.from); setTo(route.to); }}
                                type="button"
                                className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium transition border border-white/10"
                            >
                                {route.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20 space-y-4">

                {/* Filters (Mock) */}
                {trips.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 border flex items-center gap-2 whitespace-nowrap">
                            <FaFilter className="text-gray-400" /> All Buses
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
                        <div className="animate-spin text-4xl text-orange-600 mx-auto mb-4">⟳</div>
                        <p className="text-gray-500">Searching for available seats...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && hasSearched && trips.length === 0 && (
                    <div className="bg-white p-12 rounded-2xl shadow-sm text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaBus className="text-4xl text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">No Buses Found</h3>
                        <p className="text-gray-500 mt-2 max-w-sm">
                            We couldn't find any buses between <b>{from}</b> and <b>{to}</b>.
                            Try checking the spelling or searching for major cities.
                        </p>
                    </div>
                )}

                {/* Trip Cards */}
                {trips.map((trip) => (
                    <div
                        key={trip.id}
                        className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 overflow-hidden group cursor-pointer"
                        onClick={() => handleSelectTrip(trip)}
                    >
                        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">

                            {/* Left: Time & Route */}
                            <div className="flex items-center gap-6">
                                <div className="text-center min-w-[80px]">
                                    <p className="text-2xl font-bold text-gray-800">
                                        {new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-sm font-medium text-gray-400">Departure</p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <p className="text-xs text-gray-400 mb-1">4h 30m</p>
                                    <div className="w-24 h-[2px] bg-gray-200 relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                                        <FaBus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 text-xs bg-white px-1" />
                                    </div>
                                </div>

                                <div className="text-center min-w-[80px]">
                                    <p className="text-2xl font-bold text-gray-400">
                                        {new Date(trip.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-sm font-medium text-gray-400">Arrival</p>
                                </div>
                            </div>

                            {/* Middle: Bus Info */}
                            <div className="flex-1 border-l border-gray-100 md:pl-6">
                                <h4 className="font-bold text-lg text-gray-900 mb-1">
                                    {trip.route.routeNumber} <span className="text-gray-400 font-normal">• {trip.bus.number}</span>
                                </h4>
                                <div className="flex gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><FaWifi /> WiFi</span>
                                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><FaSnowflake /> A/C</span>
                                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><FaChair /> Reclining</span>
                                </div>
                            </div>

                            {/* Right: Price & Button */}
                            <div className="text-right flex flex-col items-end gap-2">
                                <p className="text-3xl font-bold text-orange-600">
                                    <span className="text-sm text-gray-400 font-semibold align-top mr-1">LKR</span>
                                    {trip.route.price?.toFixed(0)}
                                </p>
                                <button className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-orange-200 group-hover:bg-orange-700 transition">
                                    Select Seats
                                </button>
                                <p className="text-xs text-green-600 font-bold">40 Seats Available</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking Modal */}
            <SeatSelectionModal
                isOpen={isSeatModalOpen}
                onClose={() => setIsSeatModalOpen(false)}
                schedule={selectedTrip}
                onSuccess={() => setIsSeatModalOpen(false)}
            />
        </div>
    );
}
