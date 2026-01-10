'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold text-green-800 tracking-tight">
          Welcome to Bus.lk
        </h1>
        <p className="text-xl text-gray-600">
          Sri Lanka's National Bus System Management Platform.
          <br />
          Seamlessly connect Passengers, Operators, and Administrators.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg"
          >
            Login to Dashboard
          </Link>
          <Link
            href="/auth/register"
            className="px-8 py-3 bg-white text-green-800 border-2 border-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition shadow-sm"
          >
            Register New Account
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 text-gray-400 text-sm">
        © 2027 Bus.lk Platform. All rights reserved.
      </div>
    </div>
  );
}
