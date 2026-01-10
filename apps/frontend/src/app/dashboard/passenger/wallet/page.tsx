'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { FaWallet, FaPlusCircle, FaHistory, FaArrowDown, FaArrowUp } from 'react-icons/fa';

export default function WalletPage() {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/auth/profile').then(res => {
            setBalance(res.data.walletBalance);
            setLoading(false);
        }).catch(err => setLoading(false));
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

            {/* Transaction History (Mock) */}
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-300">
                    <FaHistory /> Recent Transactions
                </h3>
                <div className="space-y-3">
                    {/* Mock Data */}
                    <div className="bg-gray-800 p-4 rounded-xl flex items-center justify-between border border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-900/50 rounded-full flex items-center justify-center text-red-500">
                                <FaArrowDown />
                            </div>
                            <div>
                                <h4 className="font-bold">Bus Ticket - Kandy</h4>
                                <p className="text-xs text-gray-500">Dec 28, 2025</p>
                            </div>
                        </div>
                        <span className="font-bold text-red-400">- LKR 450.00</span>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-xl flex items-center justify-between border border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center text-green-500">
                                <FaArrowUp />
                            </div>
                            <div>
                                <h4 className="font-bold">Top Up</h4>
                                <p className="text-xs text-gray-500">Dec 25, 2025</p>
                            </div>
                        </div>
                        <span className="font-bold text-green-400">+ LKR 2000.00</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
