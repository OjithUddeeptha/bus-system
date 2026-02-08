'use client';
import { useEffect, useState } from 'react';
import { FaBus, FaLocationArrow, FaTachometerAlt, FaSearch, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic Import to disable SSR for Map
const LeafletRouteMap = dynamic(() => import('@/components/LeafletRouteMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">Loading Map...</div>
});

// Helper to get position along a path
function getPointOnPath(progress: number, path: [number, number][]): [number, number] {
    if (!path || path.length < 2) return path?.[0] || [0, 0];

    const totalLength = path.reduce((acc, curr, i) => {
        if (i === 0) return 0;
        const prev = path[i - 1];
        return acc + Math.sqrt(Math.pow(curr[0] - prev[0], 2) + Math.pow(curr[1] - prev[1], 2));
    }, 0);

    const targetDist = totalLength * progress;
    let currentDist = 0;

    for (let i = 1; i < path.length; i++) {
        const prev = path[i - 1];
        const curr = path[i];
        const segDist = Math.sqrt(Math.pow(curr[0] - prev[0], 2) + Math.pow(curr[1] - prev[1], 2));

        if (currentDist + segDist >= targetDist) {
            const segProgress = (targetDist - currentDist) / segDist;
            return [
                prev[0] + (curr[0] - prev[0]) * segProgress,
                prev[1] + (curr[1] - prev[1]) * segProgress
            ];
        }
        currentDist += segDist;
    }
    return path[path.length - 1];
}

const ROUTES = [
    {
        id: '177',
        name: 'Kollupitiya - Kaduwela',
        start: [6.9149, 79.8517],
        end: [6.9319, 79.9865],
        path: [
            [6.9149, 79.8517], [6.9120, 79.8600], [6.9100, 79.8700], [6.9130, 79.8850],
            [6.9080, 79.8950], [6.9050, 79.9050], [6.9020, 79.9150], [6.8980, 79.9250],
            [6.9050, 79.9400], [6.9100, 79.9500], [6.9150, 79.9600], [6.9200, 79.9700],
            [6.9319, 79.9865]
        ] as [number, number][]
    },
    { id: '138', name: 'Colombo - Homagama', start: [6.9271, 79.8612], end: [6.8412, 80.0034] },
    { id: '120', name: 'Colombo - Horana', start: [6.9271, 79.8612], end: [6.7151, 80.0620] },
    { id: '001', name: 'Colombo - Kandy', start: [6.9271, 79.8612], end: [7.2906, 80.6337] },
];

export default function LiveTrackingPage() {
    const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [simulatedBuses, setSimulatedBuses] = useState<any[]>([]);

    // 3 Simulated Buses
    useEffect(() => {
        if (!selectedRoute) return;

        // Initialize buses
        const initBuses = [
            { id: 'NB-1223', progress: 0.1, speed: 45 },
            { id: 'NB-5541', progress: 0.4, speed: 52 },
            { id: 'NC-8822', progress: 0.7, speed: 30 },
        ];

        const interval = setInterval(() => {
            const time = Date.now() / 10000;
            const updated = initBuses.map((bus, i) => {
                // Slower movement (0.0002 per tick)
                let p = (bus.progress + 0.0005) % 1;
                bus.progress = p;

                // Use explicit path if available, else linear interp
                const path = selectedRoute.path || [selectedRoute.start, selectedRoute.end];

                // Get position
                let position: [number, number];
                if (selectedRoute.path) {
                    position = getPointOnPath(p, path);
                } else {
                    const lat = path[0][0] + (path[path.length - 1][0] - path[0][0]) * p;
                    const lng = path[0][1] + (path[path.length - 1][1] - path[0][1]) * p;
                    position = [lat, lng];
                }

                return {
                    id: bus.id,
                    position: position,
                    label: `${bus.id} (${Math.floor(bus.speed + Math.sin(time + i) * 5)} km/h)`
                };
            });
            setSimulatedBuses(updated);
        }, 100);

        return () => clearInterval(interval);
    }, [selectedRoute]);

    // Filter Routes
    const filteredRoutes = ROUTES.filter(r => r.id.includes(searchTerm) || r.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="relative h-[calc(100vh-64px)] w-full bg-gray-900 overflow-hidden font-sans">

            {/* Map Layer */}
            <div className="absolute inset-0 z-0">
                {selectedRoute ? (
                    <LeafletRouteMap
                        start={selectedRoute.start as [number, number]}
                        end={selectedRoute.end as [number, number]}
                        isTracking={true}
                        buses={simulatedBuses}
                        path={selectedRoute.path}
                    />
                ) : (
                    // Placeholder blurred map if available, or dark bg
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center opacity-50">
                        {/* Static map bg ideally */}
                    </div>
                )}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />

            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full z-20 p-4 flex items-center justify-between">
                <Link href="/dashboard/passenger">
                    <button className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/20 transition shadow-lg border border-white/10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                </Link>
                {selectedRoute && (
                    <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-white font-bold text-sm">Route {selectedRoute.id}</span>
                        <span className="text-gray-400 text-xs mx-1">|</span>
                        <span className="text-gray-300 text-xs">{simulatedBuses.length} Buses Active</span>
                    </div>
                )}
                <div className="w-10"></div>
            </div>

            {/* Route Selector Modal (Centered if no route, Top Right/Hidden if route selected) */}
            {!selectedRoute && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 pb-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                            <h2 className="text-2xl font-bold mb-1">Select Route</h2>
                            <p className="text-blue-100 text-sm">Choose a route to view live buses</p>

                            <div className="mt-4 relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
                                <input
                                    type="text"
                                    placeholder="Search route no or city..."
                                    className="w-full bg-white/20 border border-white/30 rounded-xl py-3 pl-10 pr-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto p-2 bg-gray-50">
                            {filteredRoutes.map(route => (
                                <button
                                    key={route.id}
                                    onClick={() => setSelectedRoute(route)}
                                    className="w-full text-left p-4 rounded-xl hover:bg-white hover:shadow-md transition border border-transparent hover:border-gray-200 mb-2 group flex items-center gap-4 bg-white shadow-sm"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition">
                                        {route.id}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{route.name}</h3>
                                        <p className="text-xs text-gray-500">Live Buses Available</p>
                                    </div>
                                    <FaLocationArrow className="ml-auto text-gray-300 group-hover:text-blue-500" />
                                </button>
                            ))}
                            {filteredRoutes.length === 0 && (
                                <div className="p-8 text-center text-gray-400">
                                    No routes found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Floating Info (Only when Route Selected) */}
            {selectedRoute && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-auto">
                    <button
                        onClick={() => setSelectedRoute(null)}
                        className="bg-white text-gray-800 px-6 py-3 rounded-full shadow-xl font-bold hover:bg-gray-100 transition flex items-center gap-2"
                    >
                        <FaTimes /> Change Route
                    </button>
                </div>
            )}
        </div>
    );
}
