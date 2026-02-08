'use client';
import { useEffect, useState } from 'react';
import { FaSearch, FaBus, FaMapMarkedAlt, FaTicketAlt, FaUserCircle, FaSun, FaCloud, FaCloudRain, FaSnowflake, FaBolt, FaLocationArrow, FaHistory, FaRoute, FaTags, FaBell, FaUserCog, FaWallet, FaGift } from 'react-icons/fa';
import Link from 'next/link';
import api from '@/lib/api';
import axios from 'axios';

export default function PassengerDashboard() {
    const [user, setUser] = useState<any>(null);
    const [upcomingTrip, setUpcomingTrip] = useState<any>(null);
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [locationName, setLocationName] = useState('Colombo');

    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            // 1. Fetch User Profile & Bookings
            // 1. Fetch User Profile & Bookings
            try {
                const profileRes = await api.get('/auth/profile');
                setUser(profileRes.data);
            } catch (error) {
                console.warn("Failed to load user profile (401/500 likely)", error);
                // Don't crash, just let it be guest/loading state or redirect if needed
            }

            try {
                const bookingsRes = await api.get('/bookings/my-bookings');
                if (bookingsRes.data && bookingsRes.data.length > 0) {
                    setUpcomingTrip(bookingsRes.data[0]);
                }
            } catch (error) {
                console.warn("Failed to load bookings", error);
            }

            // 2. Fetch Weather (Independent of Auth)
            await fetchWeather(6.9271, 79.8612);

            // 3. Fetch Time
            try {
                const timeRes = await axios.get('/api/time');
                if (timeRes.data.datetime) {
                    setCurrentTime(new Date(timeRes.data.datetime));
                }
            } catch (error) {
                console.error("Failed to fetch time", error);
                setCurrentTime(new Date()); // Fallback
            }

            setLoading(false);
        };
        fetchData();
    }, []);

    // Real-time clock tick
    useEffect(() => {
        if (!currentTime) return;
        const timer = setInterval(() => {
            setCurrentTime(prev => prev ? new Date(prev.getTime() + 1000) : new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, [currentTime]);

    const fetchWeather = async (lat: number, lon: number) => {
        try {
            const res = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
            const current = res.data.properties.timeseries[0].data;
            setWeather(current);
        } catch (e) {
            console.error("Weather fetch failed", e);
        }
    };

    const getWeatherIcon = (symbolCode: string) => {
        if (!symbolCode) return <FaSun className="text-yellow-400 text-4xl" />;
        if (symbolCode.includes('clearsky')) return <FaSun className="text-yellow-400 text-4xl animate-pulse" />;
        if (symbolCode.includes('cloud')) return <FaCloud className="text-gray-300 text-4xl" />;
        if (symbolCode.includes('rain')) return <FaCloudRain className="text-blue-400 text-4xl" />;
        if (symbolCode.includes('snow')) return <FaSnowflake className="text-white text-4xl" />;
        if (symbolCode.includes('thunder')) return <FaBolt className="text-yellow-500 text-4xl" />;
        return <FaSun className="text-yellow-400 text-4xl" />; // Default
    }

    if (loading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading Dashboard...</div>;
    }

    const userName = user?.name || 'Traveler';
    const firstName = userName.split(' ')[0];

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-24 font-sans">
            {/* Header Section */}
            <header className="p-6 flex justify-between items-center bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg rounded-b-3xl">
                <div>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                        {currentTime ? currentTime.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }) : 'Good Morning'}
                    </p>
                    <h1 className="text-2xl font-bold text-white mt-1">Hello, <span className="text-green-400">{firstName}</span></h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-mono font-bold text-blue-300">
                            {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
                        </span>
                        <span className="text-xs text-gray-500">Colombo Time</span>
                    </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-green-400 border-2 border-gray-600 shadow-md">
                    <FaUserCircle className="text-3xl" />
                </div>
            </header>

            <div className="p-6 space-y-8">

                {/* Weather Widget */}
                {weather && (
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden transform hover:scale-[1.02] transition duration-300 cursor-pointer">
                        <div className="z-10">
                            <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">
                                <FaLocationArrow className="text-[10px]" /> Live Weather • {locationName}
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-bold text-white leading-none tracking-tight">
                                    {Math.round(weather.instant.details.air_temperature)}°
                                </span>
                                <div className="flex flex-col mb-1">
                                    <span className="text-sm font-bold text-white">Celsius</span>
                                    <span className="text-xs text-blue-200 capitalize">
                                        {weather.next_1_hours?.summary?.symbol_code?.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="z-10 drop-shadow-2xl filter">
                            {getWeatherIcon(weather.next_1_hours?.summary?.symbol_code)}
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -right-6 -top-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <div className="absolute -left-6 -bottom-10 w-40 h-40 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>
                    </div>
                )}

                {/* Action Cards Grid - Modern Glassmorphism */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-200 mb-4 px-1">Services</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Search & Booking */}
                        <Link href="/dashboard/passenger/search">
                            <ActionCard
                                title="Find Bus"
                                subtitle="Search Routes"
                                icon={<FaSearch className="text-2xl text-white" />}
                                gradient="bg-gradient-to-br from-green-500 to-green-700"
                            />
                        </Link>
                        <Link href="/dashboard/passenger/booking">
                            <ActionCard
                                title="Book Seat"
                                subtitle="Reserve Now"
                                icon={<FaBus className="text-2xl text-white" />}
                                gradient="bg-gradient-to-br from-orange-500 to-red-600"
                            />
                        </Link>

                        {/* Live Updates */}
                        <Link href="/dashboard/passenger/tracking">
                            <ActionCard
                                title="Live Map"
                                subtitle="Track Bus"
                                icon={<FaMapMarkedAlt className="text-2xl text-white" />}
                                gradient="bg-gradient-to-br from-blue-500 to-blue-700"
                            />
                        </Link>
                        <Link href="/dashboard/passenger/alerts">
                            <ActionCard
                                title="Alerts"
                                subtitle="Trip Updates"
                                icon={<FaBell className="text-2xl text-white" />}
                                gradient="bg-gradient-to-br from-purple-500 to-purple-700"
                            />
                        </Link>

                        {/* Planning & History */}
                        <Link href="/dashboard/passenger/planner">
                            <ActionCard
                                title="Planner"
                                subtitle="Best Route"
                                icon={<FaRoute className="text-2xl text-white" />}
                                gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
                            />
                        </Link>
                        <Link href="/dashboard/passenger/history">
                            <ActionCard
                                title="History"
                                subtitle="My Trips"
                                icon={<FaHistory className="text-2xl text-white" />}
                                gradient="bg-gradient-to-br from-pink-500 to-pink-700"
                            />
                        </Link>

                        {/* Rates & Extras */}
                        <Link href="/dashboard/passenger/rates">
                            <ActionCard
                                title="Rates"
                                subtitle="Ticket Prices"
                                icon={<FaTags className="text-2xl text-white" />}
                                gradient="bg-gradient-to-br from-teal-500 to-teal-700"
                            />
                        </Link>
                        <Link href="/dashboard/passenger/wallet">
                            <ActionCard
                                title="Wallet"
                                subtitle="Payments"
                                icon={<FaWallet className="text-2xl text-white" />}
                                gradient="bg-gradient-to-br from-yellow-500 to-yellow-700"
                            />
                        </Link>
                    </div>
                </section>

                {/* Footer Links for Profile */}
                <div className="mt-8 text-center pb-8">
                    <Link href="/dashboard/passenger/profile" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
                        <FaUserCog /> <span>Manage Profile</span>
                    </Link>
                </div>

                {/* Upcoming Trip Section - Empty State Handling */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-200 mb-4 px-1">Your Trip</h2>
                    {upcomingTrip ? (
                        <div className="bg-gray-800 p-5 rounded-2xl shadow-xl border border-gray-700 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-green-400 text-xs font-bold uppercase tracking-wider">Upcoming</p>
                                        <p className="text-gray-400 text-xs mt-1">{new Date(upcomingTrip.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                                        Confirmed
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div>
                                        <p className="text-2xl font-bold text-white">{upcomingTrip.schedule?.route?.startCity || 'Origin'}</p>
                                        <p className="text-xs text-gray-500">Departure</p>
                                    </div>
                                    <div className="flex-1 h-px bg-gray-600 mx-2 relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-500 rounded-full"></div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">{upcomingTrip.schedule?.route?.endCity || 'Dest.'}</p>
                                        <p className="text-xs text-gray-500">Arrival</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-300 bg-gray-900/50 p-3 rounded-lg backdrop-blur-sm">
                                    <FaBus className="text-green-400" />
                                    <span>Seat <span className="font-bold text-white">{upcomingTrip.seatNumber}</span></span>
                                    <span className="text-gray-600">|</span>
                                    <span>{new Date(upcomingTrip.schedule?.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>

                                <div className="mt-4">
                                    <Link href={`/dashboard/passenger/ticket/${upcomingTrip.id}`}>
                                        <button className="w-full py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-green-900/50">
                                            View Ticket
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-800 p-8 rounded-2xl shadow-inner border border-dashed border-gray-700 text-center">
                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                                <FaBus className="text-2xl opacity-50" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1">No Upcoming Trips</h3>
                            <p className="text-sm text-gray-400 mb-6">You haven't booked any buses yet. Ready to go somewhere?</p>
                            <Link href="/dashboard/passenger/search">
                                <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-500 transition">
                                    Book Your First Trip
                                </button>
                            </Link>
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}

function ActionCard({ title, subtitle, icon, gradient }: { title: string; subtitle: string; icon: React.ReactNode; gradient: string }) {
    return (
        <div className={`${gradient} p-4 rounded-2xl shadow-lg relative overflow-hidden h-32 flex flex-col justify-between group cursor-pointer transition-transform hover:scale-[1.02]`}>
            <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                {icon}
            </div>
            <div>
                <h3 className="text-white font-bold text-lg leading-tight">{title}</h3>
                <p className="text-white/70 text-xs font-medium">{subtitle}</p>
            </div>

            {/* Decorative Circles */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
    );
}
