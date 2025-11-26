import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
    FaThLarge,
    FaPlus,
    FaHistory,
    FaCreditCard,
    FaUser,
    FaBell
} from "react-icons/fa";

export default function Dashboard() {
    const location = useLocation();
    const isReviewResults = location.pathname.includes("/results");

    return (
        <div className="min-h-screen bg-[#0b1120] flex font-sans text-gray-100">
            {/* Sidebar */}
            {!isReviewResults && (
                <aside className="w-64 bg-[#0f1623] border-r border-gray-800 flex flex-col">
                    <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-800">
                        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">AI</div>
                        <span className="font-bold text-lg tracking-tight">AI Code Inspector</span>
                    </div>

                    <nav className="flex-1 py-6 px-3 space-y-1">
                        <NavLink
                            to="/dashboard"
                            end
                            className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-[#1e293b] text-blue-400" : "text-gray-400 hover:text-white hover:bg-[#1e293b]/50"}`}
                        >
                            <FaThLarge /> Dashboard
                        </NavLink>
                        <NavLink
                            to="/dashboard/new-review"
                            className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-[#1e293b] text-blue-400" : "text-gray-400 hover:text-white hover:bg-[#1e293b]/50"}`}
                        >
                            <FaPlus /> New Review
                        </NavLink>
                        <NavLink
                            to="/dashboard/history"
                            className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-[#1e293b] text-blue-400" : "text-gray-400 hover:text-white hover:bg-[#1e293b]/50"}`}
                        >
                            <FaHistory /> History
                        </NavLink>
                        <NavLink
                            to="/dashboard/billing"
                            className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-[#1e293b] text-blue-400" : "text-gray-400 hover:text-white hover:bg-[#1e293b]/50"}`}
                        >
                            <FaCreditCard /> Billing
                        </NavLink>
                        <NavLink
                            to="/dashboard/profile"
                            className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-[#1e293b] text-blue-400" : "text-gray-400 hover:text-white hover:bg-[#1e293b]/50"}`}
                        >
                            <FaUser /> Profile
                        </NavLink>
                    </nav>
                </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar */}
                <header className="h-20 border-b border-gray-800 bg-[#0b1120] flex items-center justify-end px-8 gap-6">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-blue-600/20">
                        Upgrade
                    </button>
                    <button className="text-gray-400 hover:text-white transition relative">
                        <FaBell className="text-xl" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0b1120]"></span>
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 border border-white/10 cursor-pointer"></div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
