'use client';
import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function SchedulesPage({ params }: { params: Promise<{ routeId: string }> }) {
    const { routeId } = use(params);
    const [schedules, setSchedules] = useState<any[]>([]);

    useEffect(() => {
        // Mock data for now if API fails or is empty, to ensure UI works
        // api.get(`/schedules/route/${routeId}`).then(res => setSchedules(res.data));
        setSchedules([
            { id: '1', departureTime: '2027-04-30T08:00:00Z', arrivalTime: '2027-04-30T10:30:00Z', bus: { number: 'SL-2098', operator: { name: 'Premasiri' } }, price: 850 },
            { id: '2', departureTime: '2027-04-30T09:00:00Z', arrivalTime: '2027-04-30T11:30:00Z', bus: { number: 'NB-1111', operator: { name: 'Superline' } }, price: 900 },
        ]);
    }, [routeId]);

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-green-800">Available Schedules</h1>

            <div className="space-y-4">
                {schedules.map(schedule => (
                    <div key={schedule.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg">{new Date(schedule.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(schedule.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-gray-500 text-sm">Bus: {schedule.bus.number} ({schedule.bus.operator.name})</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-green-600">Rs. {schedule.price}</p>
                            <Link
                                href={`/dashboard/passenger/booking/${schedule.id}`}
                                className="inline-block mt-2 px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                            >
                                Book Seat
                            </Link>
                        </div>
                    </div>
                ))}
                {schedules.length === 0 && (
                    <p className="text-center text-gray-400">No schedules found for this route.</p>
                )}
            </div>
        </div>
    );
}
