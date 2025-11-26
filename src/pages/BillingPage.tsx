import { FaCheck } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";

interface BillingPageProps {
    onBack: () => void;
    embedded?: boolean;
}

export default function BillingPage({ onBack, embedded = false }: BillingPageProps) {
    return (
        <div className={`${embedded ? 'p-0' : 'min-h-screen p-6 md:p-12'} bg-[#0b1120] text-white font-sans`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    {!embedded && (
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                        >
                            <IoMdArrowBack /> Back to Home
                        </button>
                    )}
                    <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
                    <p className="text-gray-400">Manage your plan and billing details.</p>
                </div>

                {/* Current Plan Section */}
                <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Current Plan</h2>
                        <p className="text-gray-400 text-sm mb-1">
                            You are currently on the <span className="text-blue-500 font-medium">Pro Plan</span>.
                        </p>
                        <p className="text-gray-400 text-sm">
                            Your subscription will renew on <span className="text-white font-medium">August 25, 2024</span>.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 text-sm font-medium text-gray-300 bg-[#1f2937] hover:bg-[#374151] rounded-lg transition-colors border border-gray-700">
                            Cancel Subscription
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg shadow-blue-600/20">
                            Manage Payment
                        </button>
                    </div>
                </div>

                {/* Plans Selection Header */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold mb-2">Choose the plan that's right for you</h2>
                    <p className="text-gray-400">Upgrade, downgrade or cancel anytime.</p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {/* Free Plan */}
                    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 flex flex-col">
                        <h3 className="font-semibold text-lg mb-2">Free</h3>
                        <p className="text-gray-400 text-xs mb-6 h-8">For individual developers and hobby projects.</p>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-3xl font-bold">$0</span>
                            <span className="text-gray-500 text-sm">/ month</span>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]"><FaCheck /></div>
                                1 User
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]"><FaCheck /></div>
                                Up to 3 repositories
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]"><FaCheck /></div>
                                Basic code analysis
                            </li>
                        </ul>

                        <button className="w-full py-2.5 text-sm font-medium text-gray-300 bg-[#1f2937] hover:bg-[#374151] rounded-lg transition-colors border border-gray-700">
                            Downgrade to Free
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-[#111827] border border-blue-500 rounded-xl p-6 flex flex-col relative shadow-xl shadow-blue-900/10">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wide">
                            Most Popular
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Pro</h3>
                        <p className="text-gray-400 text-xs mb-6 h-8">For professional developers and freelancers.</p>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-3xl font-bold">$19</span>
                            <span className="text-gray-500 text-sm">/ month</span>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]"><FaCheck /></div>
                                1 User
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]"><FaCheck /></div>
                                Unlimited repositories
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]"><FaCheck /></div>
                                Advanced AI analysis
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]"><FaCheck /></div>
                                Priority support
                            </li>
                        </ul>

                        <button className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg shadow-blue-600/20">
                            Your Current Plan
                        </button>
                    </div>

                    {/* Team Plan */}
                    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 flex flex-col">
                        <h3 className="font-semibold text-lg mb-2">Team</h3>
                        <p className="text-gray-400 text-xs mb-6 h-8">For growing teams and businesses.</p>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-3xl font-bold">$49</span>
                            <span className="text-gray-500 text-sm">/ month</span>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]"><FaCheck /></div>
                                Up to 5 Users
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]"><FaCheck /></div>
                                Everything in Pro
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]"><FaCheck /></div>
                                Team collaboration features
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]"><FaCheck /></div>
                                Centralized billing
                            </li>
                        </ul>

                        <button className="w-full py-2.5 text-sm font-medium text-gray-300 bg-[#1f2937] hover:bg-[#374151] rounded-lg transition-colors border border-gray-700">
                            Upgrade to Team
                        </button>
                    </div>
                </div>

                {/* Compare Features Table */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-center mb-8">Compare all features</h2>

                    <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
                        <div className="grid grid-cols-4 p-4 border-b border-gray-800 bg-[#1f2937]/50 text-sm font-semibold text-gray-300">
                            <div className="pl-4">Features</div>
                            <div className="text-center">Free</div>
                            <div className="text-center">Pro</div>
                            <div className="text-center">Team</div>
                        </div>

                        {/* Row 1 */}
                        <div className="grid grid-cols-4 p-4 border-b border-gray-800 text-sm text-gray-400 hover:bg-[#1f2937]/30 transition-colors">
                            <div className="pl-4 text-gray-300">Public Repositories</div>
                            <div className="text-center">Unlimited</div>
                            <div className="text-center">Unlimited</div>
                            <div className="text-center">Unlimited</div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-4 p-4 border-b border-gray-800 text-sm text-gray-400 hover:bg-[#1f2937]/30 transition-colors">
                            <div className="pl-4 text-gray-300">Private Repositories</div>
                            <div className="text-center">3</div>
                            <div className="text-center">Unlimited</div>
                            <div className="text-center">Unlimited</div>
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-4 p-4 border-b border-gray-800 text-sm text-gray-400 hover:bg-[#1f2937]/30 transition-colors">
                            <div className="pl-4 text-gray-300">AI Code Suggestions</div>
                            <div className="text-center flex justify-center"><FaCheck className="text-green-500 text-xs" /></div>
                            <div className="text-center flex justify-center"><FaCheck className="text-green-500 text-xs" /></div>
                            <div className="text-center flex justify-center"><FaCheck className="text-green-500 text-xs" /></div>
                        </div>

                        {/* Row 4 */}
                        <div className="grid grid-cols-4 p-4 border-b border-gray-800 text-sm text-gray-400 hover:bg-[#1f2937]/30 transition-colors">
                            <div className="pl-4 text-gray-300">Security Vulnerability Scans</div>
                            <div className="text-center">—</div>
                            <div className="text-center flex justify-center"><FaCheck className="text-green-500 text-xs" /></div>
                            <div className="text-center flex justify-center"><FaCheck className="text-green-500 text-xs" /></div>
                        </div>

                        {/* Row 5 */}
                        <div className="grid grid-cols-4 p-4 border-b border-gray-800 text-sm text-gray-400 hover:bg-[#1f2937]/30 transition-colors">
                            <div className="pl-4 text-gray-300">Performance Analysis</div>
                            <div className="text-center">—</div>
                            <div className="text-center flex justify-center"><FaCheck className="text-green-500 text-xs" /></div>
                            <div className="text-center flex justify-center"><FaCheck className="text-green-500 text-xs" /></div>
                        </div>

                        {/* Row 6 */}
                        <div className="grid grid-cols-4 p-4 text-sm text-gray-400 hover:bg-[#1f2937]/30 transition-colors">
                            <div className="pl-4 text-gray-300">Team Collaboration Tools</div>
                            <div className="text-center">—</div>
                            <div className="text-center">—</div>
                            <div className="text-center flex justify-center"><FaCheck className="text-green-500 text-xs" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
