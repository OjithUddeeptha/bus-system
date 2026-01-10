'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FaSearch, FaMapMarkerAlt, FaBus, FaClock } from 'react-icons/fa';
import api from '@/lib/api';

// Dynamic Import for Map (No SSR)
const RouteMap = dynamic(() => import('@/components/RouteMap'), { ssr: false });

export default function SearchPage() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [routes, setRoutes] = useState<any[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Mock Live Location
    const [liveLoc, setLiveLoc] = useState({ lat: 6.9271, lng: 79.8612, speed: 45 });

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Optimized: Server-side filtering
            const res = await api.get('/routes/search', {
                params: {
                    start: from,
                    end: to
                }
            });

            setRoutes(res.data);
            if (res.data.length > 0) setSelectedRoute(res.data[0]);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 pb-20 flex flex-col md:flex-row gap-4">

            {/* Left Panel: Search & Results */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                {/* Search Form */}
                <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
                    <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FaSearch className="text-green-500" /> Search Routes
                    </h1>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute top-4 left-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="From (e.g. Colombo)"
                                value={from}
                                onChange={e => setFrom(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-green-500 outline-none transition"
                            />
                        </div>
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute top-4 left-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="To (e.g. Kandy)"
                                value={to}
                                onChange={e => setTo(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-green-500 outline-none transition"
                            />
                        </div>
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold transition shadow-lg shadow-green-900/50">
                            {loading ? 'Searching...' : 'Find Buses'}
                        </button>
                    </form>
                </div>

                {/* Results List */}
                <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 flex-1 overflow-auto max-h-[60vh]">
                    <div className="p-4 border-b border-gray-700 font-bold text-gray-400 uppercase text-xs tracking-wider">
                        Available Routes
                    </div>
                    {routes.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <FaBus className="text-4xl mx-auto mb-2 opacity-20" />
                            <p>No routes found. Try different cities.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-700">
                            {routes.map(route => (
                                <div
                                    key={route.id}
                                    onClick={() => setSelectedRoute(route)}
                                    className={`p-4 cursor-pointer hover:bg-gray-700 transition ${selectedRoute?.id === route.id ? 'bg-gray-700 border-l-4 border-green-500' : ''}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="bg-blue-900 text-blue-200 text-xs font-bold px-2 py-1 rounded">
                                            {route.routeNumber}
                                        </span>
                                        <span className="text-gray-400 text-xs flex items-center gap-1">
                                            <FaClock /> Every 30m
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-white">{route.routePath}</h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {route.startCity} <span className="text-gray-600">→</span> {route.endCity}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Map */}
            <div className="w-full md:w-2/3 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden relative min-h-[500px]">
                {selectedRoute ? (
                    <>
                        <div className="absolute top-4 left-4 z-[1000] bg-gray-900/90 backdrop-blur text-white p-3 rounded-xl border border-gray-600 shadow-xl max-w-xs">
                            <h4 className="font-bold text-sm text-green-400 uppercase tracking-widest mb-1">Live Tracking</h4>
                            <p className="font-bold text-lg">{selectedRoute.routeNumber} - {selectedRoute.routePath}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Bus is active • {liveLoc.speed} km/h
                            </div>
                        </div>
                        <RouteMap route={selectedRoute} liveLocation={liveLoc} />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                        <FaMapMarkerAlt className="text-6xl mb-4 opacity-20" />
                        <p>Select a route to view map</p>
                    </div>
                )}
            </div>

        </div>
    );
}
