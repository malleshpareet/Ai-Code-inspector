import { useState } from "react";
import {
    FaSearch,
    FaCalendarAlt,
    FaCheckCircle,
    FaExclamationCircle,
    FaSpinner,
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";

export default function HistoryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const historyData = [
        {
            id: 1,
            status: "Completed",
            repo: "saas-dashboard / utils.js",
            branch: "main",
            score: 92,
            language: "JavaScript",
            date: "Oct 26, 2023",
            issues: 21,
            statusColor: "text-green-500",
            scoreColor: "text-green-500"
        },
        {
            id: 2,
            status: "In Progress",
            repo: "api-gateway / auth.go",
            branch: "feat/new-auth",
            score: null,
            language: "Go",
            date: "Oct 25, 2023",
            issues: null,
            statusColor: "text-yellow-500",
            scoreColor: "text-gray-500"
        },
        {
            id: 3,
            status: "Completed",
            repo: "mobile-app / store.ts",
            branch: "develop",
            score: 78,
            language: "TypeScript",
            date: "Oct 25, 2023",
            issues: 45,
            statusColor: "text-green-500",
            scoreColor: "text-orange-500"
        },
        {
            id: 4,
            status: "Failed",
            repo: "data-pipeline / process.py",
            branch: "main",
            score: null,
            language: "Python",
            date: "Oct 24, 2023",
            issues: null,
            statusColor: "text-red-500",
            scoreColor: "text-gray-500"
        },
        {
            id: 5,
            status: "Completed",
            repo: "website / components/Card.jsx",
            branch: "refactor/ui",
            score: 55,
            language: "JavaScript",
            date: "Oct 23, 2023",
            issues: 89,
            statusColor: "text-green-500",
            scoreColor: "text-red-500"
        }
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Review History</h1>
                <p className="text-gray-400">Browse and manage all past code reviews.</p>
            </div>

            {/* Filters */}
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                    <div className="md:col-span-4 relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by file or repository..."
                            className="w-full bg-[#1f2937] border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <select className="w-full bg-[#1f2937] border border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm appearance-none">
                            <option>All Languages</option>
                            <option>JavaScript</option>
                            <option>TypeScript</option>
                            <option>Python</option>
                            <option>Go</option>
                        </select>
                    </div>
                    <div className="md:col-span-4">
                        <select className="w-full bg-[#1f2937] border border-gray-700 text-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 text-sm appearance-none">
                            <option>Any Severity</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="mm/dd/yyyy"
                            className="w-full bg-[#1f2937] border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500 text-sm"
                        />
                        <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="mm/dd/yyyy"
                            className="w-full bg-[#1f2937] border border-gray-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500 text-sm"
                        />
                        <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-800 bg-[#1f2937]/50 text-gray-400 font-medium">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Repository / File</th>
                                <th className="px-6 py-4">Score</th>
                                <th className="px-6 py-4">Language</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Issues</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {historyData.map((item) => (
                                <tr key={item.id} className="hover:bg-[#1f2937]/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {item.status === "Completed" && <FaCheckCircle className="text-green-500 text-lg" />}
                                            {item.status === "In Progress" && <FaSpinner className="text-yellow-500 text-lg animate-spin" />}
                                            {item.status === "Failed" && <FaExclamationCircle className="text-red-500 text-lg" />}
                                            <span className="text-gray-300">{item.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium">{item.repo}</div>
                                        <div className="text-gray-500 text-xs">{item.branch}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.score !== null ? (
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${item.scoreColor === 'text-green-500' ? 'bg-green-500' : item.scoreColor === 'text-orange-500' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                                                <span className="text-white font-bold">{item.score}</span>
                                                <span className="text-gray-500 text-xs">/100</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{item.language}</td>
                                    <td className="px-6 py-4 text-gray-400">{item.date}</td>
                                    <td className="px-6 py-4 text-gray-300">{item.issues !== null ? item.issues : "-"}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-400 hover:text-blue-300 font-medium text-sm transition">
                                            {item.status === "Failed" ? "View Details" : "View Report"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-gray-800 p-4 flex items-center justify-between mt-auto bg-[#1f2937]/30">
                    <div className="text-gray-400 text-sm">
                        Showing <span className="text-white font-medium">1</span> to <span className="text-white font-medium">5</span> of <span className="text-white font-medium">42</span> results
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:bg-[#374151] hover:text-white transition">
                            <FaChevronLeft className="text-xs" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-medium transition shadow-lg shadow-blue-600/20">
                            1
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:bg-[#374151] hover:text-white transition">
                            2
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:bg-[#374151] hover:text-white transition">
                            3
                        </button>
                        <span className="text-gray-500 px-1">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:bg-[#374151] hover:text-white transition">
                            9
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:bg-[#374151] hover:text-white transition">
                            <FaChevronRight className="text-xs" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
