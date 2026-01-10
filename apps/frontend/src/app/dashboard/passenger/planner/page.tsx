'use client';
import { useState } from 'react';
import { FaMapSigns, FaClock, FaBus, FaLeaf, FaBolt } from 'react-icons/fa';

export default function PlannerPage() {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [showResults, setShowResults] = useState(false);

    const handlePlan = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResults(true);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaMapSigns className="text-purple-500" />
                Smart Route Planner
            </h1>

            <form onSubmit={handlePlan} className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 mb-8 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Start Location</label>
                    <input
                        type="text"
                        value={start}
                        onChange={e => setStart(e.target.value)}
                        placeholder="e.g. Colombo Fort"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Destination</label>
                    <input
                        type="text"
                        value={end}
                        onChange={e => setEnd(e.target.value)}
                        placeholder="e.g. Kandy Clock Tower"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20">
                    <FaBolt /> Find Best Route
                </button>
            </form>

            {showResults && (
                <div className="space-y-4 animate-fadeIn">
                    <h3 className="text-lg font-bold text-gray-300">Suggested Routes</h3>

                    {/* Fastest Route */}
                    <div className="bg-gradient-to-r from-green-900 to-gray-800 p-4 rounded-xl border border-green-700/50 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg">FASTEST</div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="text-3xl font-bold text-green-400">3h 15m</div>
                            <div className="text-sm text-gray-400">via Highway E01</div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                            <FaBus /> <span>Semi-Luxury Bus</span>
                            <span className="text-gray-600">•</span>
                            <FaClock /> <span>Next: 10:30 AM</span>
                        </div>
                        <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm font-bold">Select this Route</button>
                    </div>

                    {/* Cheapest Route */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg relative">
                        <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg">CHEAPEST</div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="text-3xl font-bold text-white">4h 30m</div>
                            <div className="text-sm text-gray-400">via Normal Road</div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                            <FaBus /> <span>Normal Bus</span>
                            <span className="text-gray-600">•</span>
                            <div className="text-yellow-400 font-bold">LKR 350.00</div>
                        </div>
                        <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm font-bold">Select this Route</button>
                    </div>
                </div>
            )}
        </div>
    );
}
