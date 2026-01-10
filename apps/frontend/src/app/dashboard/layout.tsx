'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaSearch, FaBus, FaCalendarAlt, FaUser } from 'react-icons/fa';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isPassenger = pathname.includes('/passenger');

    return (
        <div className="flex flex-col min-h-screen bg-gray-900">
            <main className="flex-1 pb-24">
                {children}
            </main>

            {/* Modern Floating Navigation */}
            {isPassenger && (
                <div className="fixed bottom-6 left-4 right-4 z-50">
                    <nav className="bg-gray-800/90 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl py-3 px-2 flex justify-around items-center max-w-lg mx-auto">
                        <NavItem href="/dashboard/passenger" icon={<FaHome />} label="Home" active={pathname === '/dashboard/passenger'} />
                        <NavItem href="/dashboard/passenger/search" icon={<FaSearch />} label="Search" active={pathname === '/dashboard/passenger/search'} />
                        <NavItem href="/dashboard/passenger/trips" icon={<FaBus />} label="My Trips" active={pathname === '/dashboard/passenger/trips'} />
                        <NavItem href="/dashboard/passenger/dates" icon={<FaCalendarAlt />} label="Dates" active={pathname === '/dashboard/passenger/dates'} />
                        <NavItem href="/dashboard/passenger/profile" icon={<FaUser />} label="Profile" active={pathname === '/dashboard/passenger/profile'} />
                    </nav>
                </div>
            )}
        </div>
    );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`
                group flex flex-col items-center justify-center w-full relative transition-all duration-300
                ${active ? 'text-indigo-400 -translate-y-1' : 'text-gray-400 hover:text-gray-200'}
            `}
        >
            <div className={`
                p-2 rounded-full transition-all duration-300 mb-1
                ${active ? 'bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-transparent group-hover:bg-white/5'}
            `}>
                <span className="text-xl">{icon}</span>
            </div>
            <span className={`text-[10px] font-medium transition-all ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                {label}
            </span>
            {active && (
                <span className="absolute -bottom-2 w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></span>
            )}
        </Link>
    );
}
