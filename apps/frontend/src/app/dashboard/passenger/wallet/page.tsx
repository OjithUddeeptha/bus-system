'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FaWallet, FaPlusCircle, FaHistory, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import Link from 'next/link';

export default function WalletPage() {
    const [balance, setBalance] = useState(0);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch Profile for Balance
        api.get('/auth/profile').then(res => {
            setBalance(res.data.walletBalance);
        }).catch(err => console.error(err));

        // Fetch Bookings for Transactions
        api.get('/bookings/my-bookings').then(res => {
            setBookings(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaWallet className="text-yellow-500" />
                My Wallet
            </h1>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 shadow-lg mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <FaWallet className="text-9xl text-white" />
                </div>
                <p className="text-yellow-100 uppercase text-sm font-bold tracking-wider mb-2">Available Balance</p>
                <h2 className="text-4xl font-bold text-white mb-6">LKR {balance.toFixed(2)}</h2>

                <button className="bg-white text-orange-600 px-6 py-2 rounded-full font-bold shadow-md hover:bg-gray-100 transition flex items-center gap-2 mx-auto">
                    <FaPlusCircle /> Add Funds
                </button>
            </div>

            {/* Transaction History */}
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-300">
                    <FaHistory /> Recent Transactions
                </h3>
                <div className="space-y-3">
                    {loading ? (
                        <p className="text-gray-500 text-center">Loading transactions...</p>
                    ) : bookings.length === 0 ? (
                        <p className="text-gray-500 text-center">No transactions found.</p>
                    ) : (
                        bookings.map((booking: any) => (
                            <Link href={`/dashboard/passenger/ticket/${booking.id}`} key={booking.id}>
                                <div className="bg-gray-800 p-4 rounded-xl flex items-center justify-between border border-gray-700 hover:bg-gray-750 transition cursor-pointer mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-red-900/50 rounded-full flex items-center justify-center text-red-500">
                                            <FaArrowDown />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Bus Ticket - {booking.schedule.route.endCity}</h4>
                                            <p className="text-xs text-gray-500">
                                                {new Date(booking.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-red-400">
                                        - LKR {booking.schedule.route.price ? booking.schedule.route.price.toFixed(2) : 'N/A'}
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
