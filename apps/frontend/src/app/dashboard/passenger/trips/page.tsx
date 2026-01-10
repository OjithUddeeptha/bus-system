'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function MyTrips() {
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        // Fetch my bookings (placeholder logic until auth is fully connected with state)
        // api.get('/bookings/my-bookings').then(res => setBookings(res.data));
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-green-800 mb-6">My Trips</h1>
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 opacity-50">
                    <p className="font-bold">Colombo - Kandy</p>
                    <p className="text-sm">Upcoming (Example)</p>
                </div>
                {/* Mapping real bookings would go here */}
            </div>
        </div>
    );
}
