import { FaCheck } from "react-icons/fa";
import { useState } from "react";

interface Currency {
    code: string;
    symbol: string;
    country: string;
    flag: string;
    rate: number;
}

const currencies: Currency[] = [
    { code: "USD", symbol: "$", country: "United States", flag: "", rate: 1 },
    { code: "EUR", symbol: "€", country: "Europe", flag: "", rate: 0.92 },
    { code: "GBP", symbol: "£", country: "United Kingdom", flag: "", rate: 0.79 },
    { code: "INR", symbol: "₹", country: "India", flag: "", rate: 83 },
];

interface PricingProps {
    onExplorePlansClick?: () => void;
}

export default function Pricing({ onExplorePlansClick }: PricingProps) {
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const convertPrice = (usdPrice: number): string => {
        const converted = usdPrice * selectedCurrency.rate;
        return Math.round(converted).toString();
    };

    return (
        <section id="pricing" className="py-24 px-6 bg-[#0b1120]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Choose the plan that's right for you. Get started for free, no credit card required.
                    </p>

                    {/* Currency Selector */}
                    <div className="flex justify-center">
                        <div className="relative inline-block">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 bg-[#1f2937] hover:bg-[#374151] text-white px-4 py-2.5 rounded-lg border border-gray-700 transition-all duration-200"
                            >
                                <span className="text-xl">{selectedCurrency.flag}</span>
                                <span className="font-medium">{selectedCurrency.code}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full mt-2 left-0 right-0 bg-[#1f2937] border border-gray-700 rounded-lg shadow-2xl shadow-black/50 overflow-hidden z-50 min-w-[200px]">
                                    {currencies.map((currency) => (
                                        <button
                                            key={currency.code}
                                            onClick={() => {
                                                setSelectedCurrency(currency);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selectedCurrency.code === currency.code
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-[#374151]'
                                                }`}
                                        >
                                            <span className="text-xl">{currency.flag}</span>
                                            <div className="flex-1">
                                                <div className="font-medium">{currency.code}</div>
                                                <div className="text-xs opacity-75">{currency.country}</div>
                                            </div>
                                            {selectedCurrency.code === currency.code && (
                                                <FaCheck className="text-sm" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 flex flex-col">
                        <h3 className="text-white font-semibold text-xl mb-2">Free</h3>
                        <p className="text-gray-400 text-sm mb-6">For individuals and hobby projects.</p>
                        <div className="text-white text-4xl font-bold mb-6">
                            {selectedCurrency.symbol}0<span className="text-gray-500 text-lg font-normal">/month</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs"><FaCheck /></div>
                                1 User
                            </li>
                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs"><FaCheck /></div>
                                3 Projects
                            </li>
                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs"><FaCheck /></div>
                                Basic code analysis
                            </li>
                        </ul>

                        <button className="w-full bg-[#1f2937] hover:bg-[#374151] text-white py-3 rounded-lg font-medium transition">
                            Get Started
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-[#111827] border border-blue-500/50 rounded-2xl p-8 flex flex-col relative shadow-2xl shadow-blue-900/20">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            Most Popular
                        </div>
                        <h3 className="text-white font-semibold text-xl mb-2">Pro</h3>
                        <p className="text-gray-400 text-sm mb-6">For professional developers and freelancers.</p>
                        <div className="text-white text-4xl font-bold mb-6">
                            {selectedCurrency.symbol}{convertPrice(29)}<span className="text-gray-500 text-lg font-normal">/month</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs"><FaCheck /></div>
                                Unlimited Projects
                            </li>
                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs"><FaCheck /></div>
                                Advanced Security Scans
                            </li>
                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs"><FaCheck /></div>
                                Performance Optimization
                            </li>
                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs"><FaCheck /></div>
                                Priority Support
                            </li>
                        </ul>

                        <button
                            onClick={onExplorePlansClick}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition shadow-lg shadow-blue-600/25"
                        >
                            Explore Plans
                        </button>
                    </div>

                    {/* Teams Plan */}
                    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 flex flex-col">
                        <h3 className="text-white font-semibold text-xl mb-2">Teams</h3>
                        <p className="text-gray-400 text-sm mb-6">For organizations and development teams.</p>
                        <div className="text-white text-3xl font-bold mb-6">
                            Contact Us
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs"><FaCheck /></div>
                                Everything in Pro
                            </li>
                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs"><FaCheck /></div>
                                Team Management
                            </li>
                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs"><FaCheck /></div>
                                SSO & Advanced Security
                            </li>
                            <li className="flex items-center gap-3 text-gray-300 text-sm">
                                <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs"><FaCheck /></div>
                                Dedicated Support
                            </li>
                        </ul>

                        <button className="w-full bg-[#1f2937] hover:bg-[#374151] text-white py-3 rounded-lg font-medium transition">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
