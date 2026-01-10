'use client';
import Link from 'next/link';
import { FaTools } from 'react-icons/fa';

export default function ServicePlaceholder({ title, description }: { title: string, description: string }) {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaTools className="text-4xl text-yellow-500 animate-pulse" />
                </div>
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
                <p className="text-gray-400 mb-8">{description}</p>

                <Link href="/dashboard/passenger">
                    <button className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition">
                        Back to Dashboard
                    </button>
                </Link>
            </div>
        </div>
    );
}
