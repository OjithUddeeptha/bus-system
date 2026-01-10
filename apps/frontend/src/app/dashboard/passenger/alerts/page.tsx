'use client';
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

export default function AlertsPage() {
    // Mock Alerts
    const alerts = [
        { id: 1, type: 'success', message: 'Your booking to Kandy is confirmed!', time: '2 hours ago' },
        { id: 2, type: 'warning', message: 'Heavy rain reported near Kegalle. Expect delays.', time: '5 hours ago' },
        { id: 3, type: 'info', message: 'New luxury buses added to Colombo-Matara route.', time: '1 day ago' }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaBell className="text-purple-500" />
                Notifications
            </h1>

            <div className="space-y-4">
                {alerts.map(alert => (
                    <div key={alert.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg flex items-start gap-4">
                        <div className="mt-1">
                            {alert.type === 'success' && <FaCheckCircle className="text-green-500 text-xl" />}
                            {alert.type === 'warning' && <FaExclamationTriangle className="text-yellow-500 text-xl" />}
                            {alert.type === 'info' && <FaInfoCircle className="text-blue-500 text-xl" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-200">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                        </div>
                    </div>
                ))}

                {alerts.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        No new notifications.
                    </div>
                )}
            </div>
        </div>
    );
}
