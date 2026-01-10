'use client';
import { useEffect, useState, use } from 'react';
import api from '@/lib/api';
import { FaQrcode } from 'react-icons/fa';

export default function TicketPage({ params }: { params: Promise<{ bookingId: string }> }) {
    const { bookingId } = use(params);
    const [ticket, setTicket] = useState<any>(null);

    useEffect(() => {
        // Fetch ticket details
        // api.get(`/bookings/${params.bookingId}`).then(res => setTicket(res.data));
        // Mock for UI demonstration
        setTicket({
            id: bookingId,
            seatNumber: 12,
            schedule: {
                route: { startCity: 'Colombo', endCity: 'Kandy' },
                departureTime: new Date().toISOString()
            }
        });
    }, [bookingId]);

    if (!ticket) return <div>Loading...</div>;

    return (
        <div className="p-4 flex flex-col items-center justify-center min-h-[80vh]">
            <h1 className="text-2xl font-bold text-green-800 mb-6">Your E-Ticket</h1>

            <div className="bg-white p-0 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-200">
                <div className="bg-green-600 p-6 text-white text-center">
                    <h2 className="text-xl font-bold">Bus.lk Ticket</h2>
                    <p className="opacity-80 text-sm">Valid for one trip</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <div>
                            <p className="text-xs text-gray-400">From</p>
                            <p className="font-bold text-lg">{ticket.schedule.route.startCity}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 text-right">To</p>
                            <p className="font-bold text-lg text-right">{ticket.schedule.route.endCity}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pb-2">
                        <div>
                            <p className="text-xs text-gray-400">Date</p>
                            <p className="font-semibold text-gray-800">May 24, 2027</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 text-right">Time</p>
                            <p className="font-semibold text-gray-800">08:00 AM</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-400">Seat Number</p>
                            <p className="text-2xl font-bold text-green-600">{ticket.seatNumber}A</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 text-right">Price</p>
                            <p className="text-xl font-bold text-gray-900">Rs. 850</p>
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <FaQrcode className="text-8xl text-gray-800" />
                    </div>
                    <p className="text-center text-xs text-gray-400">Show this QR code to the conductor</p>
                </div>
            </div>
        </div>
    );
}
