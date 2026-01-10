'use client';
import { FaTags, FaBus, FaStar, FaSnowflake } from 'react-icons/fa';

export default function RatesPage() {
    // Mock Rates Data
    const rates = [
        { route: 'Colombo - Kandy', normal: 350, semi: 550, ac: 800 },
        { route: 'Colombo - Matara', normal: 450, semi: 650, ac: 950 },
        { route: 'Colombo - Galle', normal: 300, semi: 500, ac: 750 },
        { route: 'Kandy - Anuradhapura', normal: 400, semi: 600, ac: 850 },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaTags className="text-teal-500" />
                Ticket Rates
            </h1>

            <div className="space-y-6">
                {rates.map((rate, index) => (
                    <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                        <div className="bg-gray-700/50 p-3 font-bold text-center border-b border-gray-700">
                            {rate.route}
                        </div>
                        <div className="grid grid-cols-3 divide-x divide-gray-700">
                            <div className="p-4 text-center">
                                <FaBus className="mx-auto text-gray-400 mb-2" />
                                <div className="text-xs text-gray-400 uppercase font-bold">Normal</div>
                                <div className="text-lg font-bold text-white mt-1">Rs {rate.normal}</div>
                            </div>
                            <div className="p-4 text-center bg-gray-700/20">
                                <FaBus className="mx-auto text-blue-400 mb-2" />
                                <div className="text-xs text-blue-300 uppercase font-bold">Semi-Luxury</div>
                                <div className="text-lg font-bold text-white mt-1">Rs {rate.semi}</div>
                            </div>
                            <div className="p-4 text-center bg-teal-900/10">
                                <FaSnowflake className="mx-auto text-teal-400 mb-2" />
                                <div className="text-xs text-teal-300 uppercase font-bold">A/C Luxury</div>
                                <div className="text-lg font-bold text-teal-400 mt-1">Rs {rate.ac}</div>
                            </div>
                        </div>
                        {/* Promo / Offer Section Mock */}
                        {index === 1 && (
                            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-xs font-bold text-center py-1">
                                <FaStar className="inline mr-1" /> SPECIAL OFFER: 10% OFF ON HIGHWAY BUSES
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
