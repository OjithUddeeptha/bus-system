'use client';
import { useEffect, useState } from 'react';
import { FaBus, FaLocationArrow, FaTachometerAlt } from 'react-icons/fa';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic Import to disable SSR for Leaflet Map
const TrackingMap = dynamic(() => import('@/components/TrackingMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">Loading Map...</div>
});

export default function LiveTrackingPage() {
    const [busLocation, setBusLocation] = useState<[number, number]>([6.9271, 79.8612]); // Colombo Start
    const [progress, setProgress] = useState(0);
    const [eta, setEta] = useState('2h 15m');
    const [speed, setSpeed] = useState(65);

    // Simulate Bus Movement
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 1) return 0; // Loop for demo
                return prev + 0.0005; // Slower for realism
            });
        }, 100); // Smoother update
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Interpolate position between Colombo and Galle
        const lat = 6.9271 + (6.0535 - 6.9271) * progress;
        const lng = 79.8612 + (80.2210 - 79.8612) * progress;
        setBusLocation([lat, lng]);

        setSpeed(Math.floor(60 + Math.random() * 5));

        const remainingMins = Math.floor((1 - progress) * 120);
        const hrs = Math.floor(remainingMins / 60);
        const mins = remainingMins % 60;
        setEta(`${hrs}h ${mins}m`);

    }, [progress]);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full z-[1000] p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <div className="flex items-center justify-between pointer-events-auto">
                    <Link href="/dashboard/passenger">
                        <button className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                    </Link>
                    <h1 className="text-xl font-bold text-white shadow-black drop-shadow-lg">Live Tracking</h1>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 w-full h-full absolute inset-0 z-0">
                <TrackingMap busLocation={busLocation} speed={speed} />
            </div>

            {/* Bottom Info Panel */}
            <div className="absolute bottom-0 w-full z-[1000] p-4">
                <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-green-500 text-[10px] font-bold px-2 py-0.5 rounded text-black uppercase tracking-wide">On Time</span>
                                <span className="text-gray-400 text-xs">Route #450</span>
                            </div>
                            <h2 className="text-lg font-bold text-white">Colombo <span className="text-gray-500 mx-1">→</span> Galle</h2>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-400 leading-none">{eta}</div>
                            <div className="text-xs text-gray-400 uppercase font-medium mt-1">Estimated Arrival</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-t border-gray-700 pt-4">
                        <div className="text-center">
                            <FaBus className="mx-auto text-xl text-gray-400 mb-1" />
                            <div className="text-sm font-bold text-white">ND-4520</div>
                            <div className="text-[10px] text-gray-500 uppercase">Bus No</div>
                        </div>
                        <div className="text-center border-l border-r border-gray-700">
                            <FaTachometerAlt className="mx-auto text-xl text-blue-400 mb-1" />
                            <div className="text-sm font-bold text-white">{speed} km/h</div>
                            <div className="text-[10px] text-gray-500 uppercase">Speed</div>
                        </div>
                        <div className="text-center">
                            <FaLocationArrow className="mx-auto text-xl text-green-400 mb-1" />
                            <div className="text-sm font-bold text-white">Kalutara</div>
                            <div className="text-[10px] text-gray-500 uppercase">Next Stop</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
