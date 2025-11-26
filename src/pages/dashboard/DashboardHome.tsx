import { FaPlus } from "react-icons/fa";

interface DashboardHomeProps {
    onStartNewReview: () => void;
    onManageSubscription: () => void;
}

export default function DashboardHome({ onStartNewReview, onManageSubscription }: DashboardHomeProps) {
    const stats = [
        { label: "Reviews this month", value: "128", sub: "" },
        { label: "Issues found", value: "42", sub: "" },
        { label: "Critical Issues", value: "5", sub: "" },
        { label: "Avg. Review Time", value: "3.2m", sub: "" },
    ];

    const reviews = [
        { name: "webapp-main-feature-auth", status: "Completed", issues: "5 Critical Issues", color: "text-green-500", dot: "bg-green-500" },
        { name: "api-refactor-billing-endpoints", status: "In Progress", issues: "-", color: "text-yellow-500", dot: "bg-yellow-500" },
        { name: "mobile-v2-onboarding-flow", status: "Completed", issues: "12 Issues", color: "text-green-500", dot: "bg-green-500" },
        { name: "docs-update-sdk-guide", status: "Failed", issues: "Build Error", color: "text-red-500", dot: "bg-red-500" },
    ];

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Welcome back, Alex!</h1>
                    <p className="text-gray-400">Here's a summary of your recent code review activity.</p>
                </div>
                <button
                    onClick={onStartNewReview}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-lg shadow-blue-600/20"
                >
                    <FaPlus className="text-sm" /> Start New Code Review
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-[#111827] border border-gray-800 rounded-xl p-6">
                        <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
                        <div className="text-3xl font-bold text-white">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Reviews */}
                <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-lg font-semibold text-white">Recent Reviews</h2>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <tbody className="divide-y divide-gray-800">
                                {reviews.map((review, idx) => (
                                    <tr key={idx} className="hover:bg-[#1f2937]/50 transition-colors">
                                        <td className="p-5 font-medium text-white">{review.name}</td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${review.dot}`}></div>
                                                <span className="text-gray-300">{review.status}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-gray-400 text-right">{review.issues}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Plan & Limits */}
                <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 flex flex-col">
                    <h2 className="text-lg font-semibold text-white mb-6">Plan & Limits</h2>
                    <p className="text-gray-400 text-sm mb-6">
                        You are on the <span className="text-blue-400 font-medium">Pro Plan</span>.
                    </p>

                    <div className="space-y-6 mb-8">
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-gray-400">Reviews Used</span>
                                <span className="text-gray-300">750 / 1000</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-3/4 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-gray-400">Team Members</span>
                                <span className="text-gray-300">3 / 5</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-3/5 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onManageSubscription}
                        className="mt-auto w-full bg-[#1f2937] hover:bg-[#374151] text-blue-400 font-medium py-3 rounded-lg transition border border-gray-700 hover:border-gray-600"
                    >
                        Manage Subscription
                    </button>
                </div>
            </div>
        </>
    );
}
