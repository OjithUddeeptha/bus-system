'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FaBus, FaCalendarAlt, FaTicketAlt, FaHistory, FaMapMarkerAlt, FaQrcode } from 'react-icons/fa';
import Link from 'next/link';
import { format } from 'date-fns';

interface Booking {
    id: string;
    seatNumber: number;
    status: string;
    createdAt: string;
    schedule: {
        departureTime: string;
        arrivalTime: string;
        bus: {
            number: string;
        };
        route: {
            routeNumber: string;
            startCity: string;
            endCity: string;
        };
    };
    ticket?: {
        qrCode: string;
    };
}

export default function HistoryPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/user');
                setBookings(res.data);
            } catch (error) {
                console.error('Failed to fetch bookings', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const now = new Date();

    const upcomingBookings = bookings.filter(b => new Date(b.schedule.departureTime) > now && b.status !== 'CANCELLED');
    const pastBookings = bookings.filter(b => new Date(b.schedule.departureTime) <= now || b.status === 'CANCELLED');

    const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

    if (loading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading history...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaHistory className="text-pink-500" />
                My Trips
            </h1>

            {/* Tabs */}
            <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'upcoming' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'past' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    Past
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {displayedBookings.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                        <FaTicketAlt className="text-4xl mx-auto mb-3" />
                        <p>No {activeTab} trips found.</p>
                        {activeTab === 'upcoming' && (
                            <Link href="/dashboard/passenger/search">
                                <button className="mt-4 px-4 py-2 bg-green-600 rounded-lg text-sm font-bold">Book a Trip</button>
                            </Link>
                        )}
                    </div>
                ) : (
                    displayedBookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg relative overflow-hidden">
                            {/* Status Badge */}
                            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${booking.status === 'CONFIRMED' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                                {booking.status}
                            </div>

                            <div className="flex justify-between items-start mb-4 mt-2">
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <span className="bg-gray-700 text-xs px-2 py-0.5 rounded border border-gray-600 text-blue-300">
                                            {booking.schedule.route.routeNumber || 'N/A'}
                                        </span>
                                        {booking.schedule.route.startCity} <span className="text-gray-500">→</span> {booking.schedule.route.endCity}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                        <FaCalendarAlt />
                                        <span>{format(new Date(booking.schedule.departureTime), 'MMM dd, yyyy • hh:mm a')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700/50 mb-4">
                                <div>
                                    <div className="text-xs text-gray-400 uppercase">Bus No</div>
                                    <div className="font-bold">{booking.schedule.bus.number}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-400 uppercase">Seat</div>
                                    <div className="font-bold text-green-400">#{booking.seatNumber}</div>
                                </div>
                            </div>

                            {activeTab === 'upcoming' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href={`/dashboard/passenger/ticket/${booking.id}`} className="w-full">
                                        <button className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm font-bold transition">
                                            <FaQrcode /> View Ticket
                                        </button>
                                    </Link>
                                    <Link href="/dashboard/passenger/tracking" className="w-full">
                                        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-sm font-bold transition">
                                            <FaMapMarkerAlt /> Track Bus
                                        </button>
                                    </Link>
                                </div>
                            )}
                            {activeTab === 'past' && (
                                <Link href={`/dashboard/passenger/ticket/${booking.id}`} className="w-full">
                                    <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm font-bold transition">
                                        View Details
                                    </button>
                                </Link>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
