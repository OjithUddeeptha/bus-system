'use client';
import { useState } from 'react';
import { FaTimes, FaCheck, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface SeatSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    schedule: any;
    onSuccess: () => void;
}

export default function SeatSelectionModal({ isOpen, onClose, schedule, onSuccess }: SeatSelectionModalProps) {
    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'CASH'>('ONLINE');
    const [booking, setBooking] = useState(false);
    const router = useRouter();

    if (!isOpen || !schedule) return null;

    // Mock occupied seats (in real app, fetch from API)
    const occupiedSeats = [2, 5, 8, 12, 15];
    const totalSeats = schedule.bus?.capacity || 40;

    const handleBook = async () => {
        if (!selectedSeat) return;
        setBooking(true);
        try {
            await api.post('/bookings', {
                scheduleId: schedule.id,
                seatNumber: selectedSeat,
                paymentMethod: paymentMethod // Pass the method to backend
            });
            onSuccess(); // Close and show toast
            router.push('/dashboard/passenger/wallet'); // Redirect to wallet
        } catch (error) {
            console.error("Booking failed", error);
            alert("Failed to book seat. Please try again.");
        } finally {
            setBooking(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pb-20 md:pb-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fadeInUp flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="font-bold text-lg">Select Your Seat</h3>
                        <p className="text-sm opacity-90">{schedule.route?.startCity} to {schedule.route?.endCity}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
                        <FaTimes />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 p-6">
                    {/* Seat Legend */}
                    <div className="flex justify-between mb-4 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 rounded border"></div> Available</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded"></div> Selected</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded"></div> Booked</div>
                    </div>

                    {/* Seat Grid */}
                    <div className="grid grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 justify-items-center mb-6">
                        {Array.from({ length: totalSeats }).map((_, i) => {
                            const seatNum = i + 1;
                            const isOccupied = occupiedSeats.includes(seatNum);
                            const isSelected = selectedSeat === seatNum;

                            return (
                                <button
                                    key={seatNum}
                                    disabled={isOccupied}
                                    onClick={() => setSelectedSeat(seatNum)}
                                    className={`
                                        w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all shadow-sm
                                        ${isOccupied ? 'bg-red-400 text-white cursor-not-allowed opacity-50' :
                                            isSelected ? 'bg-blue-600 text-white transform scale-110 shadow-lg ring-2 ring-blue-300' :
                                                'bg-white border hover:border-blue-400 hover:bg-blue-50 text-gray-700'}
                                    `}
                                >
                                    {seatNum}
                                </button>
                            );
                        })}
                    </div>

                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-700">Payment Method</h4>

                        <div
                            onClick={() => setPaymentMethod('ONLINE')}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                    <FaCreditCard />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Pay Online Now</p>
                                    <p className="text-xs text-gray-500">Get e-ticket instantly</p>
                                </div>
                            </div>
                            {paymentMethod === 'ONLINE' && <FaCheck className="text-blue-600" />}
                        </div>

                        <div
                            onClick={() => setPaymentMethod('CASH')}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'CASH' ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 hover:border-green-300'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-full">
                                    <FaMoneyBillWave />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Pay on Bus</p>
                                    <p className="text-xs text-gray-500">Reserve now, pay conductor</p>
                                </div>
                            </div>
                            {paymentMethod === 'CASH' && <FaCheck className="text-green-600" />}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-500">Total Price</p>
                        <p className="text-2xl font-bold text-gray-800">LKR {schedule.route?.price?.toFixed(0) || '450'}</p>
                    </div>
                    <button
                        onClick={handleBook}
                        disabled={!selectedSeat || booking}
                        className={`
                            w-full py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all
                            ${!selectedSeat || booking ? 'bg-gray-400 cursor-not-allowed' :
                                paymentMethod === 'ONLINE' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
                        `}
                    >
                        {booking ? 'Processing...' : (
                            <>
                                {paymentMethod === 'ONLINE' ? 'Pay & Book Seat' : 'Reserve Seat'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
