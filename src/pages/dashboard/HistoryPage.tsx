import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaSearch,
    FaCheckCircle,
    FaExclamationCircle,
    FaSpinner
} from "react-icons/fa";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";

export default function HistoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await authService.getHistory();
                if (response.success) {
                    setHistoryData(response.data);
                } else {
                    toast.error("Failed to load history");
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
                toast.error("Failed to load history");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleViewReport = async (id: string) => {
        const toastId = toast.loading("Loading report...");
        try {
            const response = await authService.getReviewById(id);
            if (response.success) {
                const review = response.data;
                // Store in sessionStorage to pass to ReviewResultsPage
                sessionStorage.setItem('reviewResults', JSON.stringify({
                    code: review.code,
                    filename: review.title,
                    repoName: review.repoName,
                    results: review.results
                }));
                toast.dismiss(toastId);
                navigate('/dashboard/results', {
                    state: {
                        isHistory: true,
                        reviewId: id // Optional: pass ID if needed for future
                    }
                });
            } else {
                toast.error("Failed to fetch review details", { id: toastId });
            }
        } catch (error) {
            console.error("Failed to fetch review details:", error);
            toast.error("Failed to fetch review details", { id: toastId });
        }
    };

    const filteredHistory = historyData.filter(item =>
        item.repo.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <FaSpinner className="animate-spin" /> Loading history...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredHistory.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No reviews found.
                                    </td>
                                </tr>
                            ) : (
                                filteredHistory.map((item) => (
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
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.score !== null ? (
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${item.scoreColor}`}></div>
                                                    <span className="text-white font-bold">{item.score}</span>
                                                    <span className="text-gray-500 text-xs">/100</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 capitalize">{item.language}</td>
                                        <td className="px-6 py-4 text-gray-400">{item.date}</td>
                                        <td className="px-6 py-4 text-gray-300">{item.issues !== null ? item.issues : "-"}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewReport(item.id)}
                                                className="text-blue-400 hover:text-blue-300 font-medium text-sm transition"
                                            >
                                                View Report
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simplified for now) */}
                {!isLoading && filteredHistory.length > 0 && (
                    <div className="border-t border-gray-800 p-4 flex items-center justify-between mt-auto bg-[#1f2937]/30">
                        <div className="text-gray-400 text-sm">
                            Showing <span className="text-white font-medium">1</span> to <span className="text-white font-medium">{filteredHistory.length}</span> of <span className="text-white font-medium">{filteredHistory.length}</span> results
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
