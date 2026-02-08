export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-900 p-6 flex flex-col gap-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="h-8 w-48 bg-gray-800 rounded-lg"></div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="h-64 bg-gray-800 rounded-2xl"></div>
                <div className="h-64 bg-gray-800 rounded-2xl"></div>
                <div className="h-64 bg-gray-800 rounded-2xl"></div>
            </div>

            {/* List Skeleton */}
            <div className="space-y-4">
                <div className="h-20 bg-gray-800 rounded-xl w-full"></div>
                <div className="h-20 bg-gray-800 rounded-xl w-full"></div>
                <div className="h-20 bg-gray-800 rounded-xl w-full"></div>
            </div>
        </div>
    );
}
