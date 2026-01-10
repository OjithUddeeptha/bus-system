'use client';
import { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaCalendarCheck } from 'react-icons/fa';

export default function DatesPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-8 px-4">
                <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="p-2 hover:bg-gray-800 rounded-full transition">
                    <FaChevronLeft className="text-indigo-400" />
                </button>
                <div className="text-xl font-bold text-white">
                    {format(currentDate, 'MMMM yyyy')}
                </div>
                <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="p-2 hover:bg-gray-800 rounded-full transition">
                    <FaChevronRight className="text-indigo-400" />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const startDate = startOfWeek(currentDate);
        const days = [];

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center font-bold text-gray-500 text-sm uppercase tracking-wider mb-2">
                    {format(addDays(startDate, i), 'EEE')}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const startDate = startOfWeek(currentDate);
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        for (let i = 0; i < 1; i++) { // Just one week row for mobile-friendly view, expandable later
            for (let j = 0; j < 7; j++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;
                const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

                days.push(
                    <div
                        key={day.toString()}
                        className={`p-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 rounded-xl m-1 h-20
                           ${isSelected
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-105'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        onClick={() => setSelectedDate(cloneDay)}
                    >
                        <span className="text-lg font-bold">{formattedDate}</span>
                        {j === 3 && <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1"></div>} {/* Mock event dot */}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div>{rows}</div>;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 pb-24">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <FaCalendarCheck className="text-indigo-400" />
                My Schedule
            </h1>

            {/* Calendar Widget */}
            <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-6 shadow-xl border border-gray-700 mb-8">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>

            {/* Selected Date Events */}
            <div>
                <h2 className="text-xl font-bold mb-4 text-gray-300 px-2">
                    Events for {format(selectedDate, 'MMMM do')}
                </h2>

                <div className="space-y-4">
                    {/* Mock Event Card */}
                    <div className="bg-gray-800 rounded-2xl p-5 border-l-4 border-indigo-500 shadow-lg hover:translate-x-1 transition-transform">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-white">Colombo to Kandy</h3>
                                <p className="text-sm text-gray-400 mt-1">Bus #ND-4589 • Luxury AC</p>
                            </div>
                            <span className="bg-gray-700 px-3 py-1 rounded-full text-xs font-bold text-gray-300">
                                08:30 AM
                            </span>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-2xl p-5 border-l-4 border-green-500 shadow-lg hover:translate-x-1 transition-transform">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-white">Return Trip</h3>
                                <p className="text-sm text-gray-400 mt-1">Bus #NB-1122 • Semi-Luxury</p>
                            </div>
                            <span className="bg-gray-700 px-3 py-1 rounded-full text-xs font-bold text-gray-300">
                                04:00 PM
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
