'use client';
import { useState, use } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function BookingPage({ params }: { params: Promise<{ scheduleId: string }> }) {
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const router = useRouter();
    const { scheduleId } = use(params);

    // Mock seat layout for 40 seats (4 columns)
    const seats = Array.from({ length: 40 }, (_, i) => i + 1);

    const handleBook = async () => {
        if (!selectedSeat) return;
        try {
            const res = await api.post('/bookings', {
                scheduleId: scheduleId,
                seatNumber: selectedSeat,
            });
            // Redirect to ticket view
            router.push(`/dashboard/passenger/ticket/${res.data.id}`);
        } catch (error) {
            alert('Booking failed');
        }
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-green-800">Select Your Seat</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                <div className="w-full max-w-xs grid grid-cols-4 gap-4 mb-8">
                    {seats.map(seat => (
                        <button
                            key={seat}
                            onClick={() => setSelectedSeat(seat)}
                            className={`h-12 w-12 rounded-lg font-bold flex items-center justify-center transition
                        ${selectedSeat === seat
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }
                    `}
                        >
                            {seat}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between w-full max-w-xs mb-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><div className="w-4 h-4 bg-gray-200 rounded"></div> Available</span>
                    <span className="flex items-center gap-1"><div className="w-4 h-4 bg-green-600 rounded"></div> Selected</span>
                </div>

                <button
                    onClick={handleBook}
                    disabled={!selectedSeat}
                    className={`w-full max-w-xs py-3 rounded-xl font-bold transition
                ${selectedSeat ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    );
}
