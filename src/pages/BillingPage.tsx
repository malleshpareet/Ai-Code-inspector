import { useState, useEffect } from 'react';
import { FaCheck } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { subscriptionService } from '../services/subscriptionService';
import type { Plan, Subscription } from '../services/subscriptionService';
import toast from 'react-hot-toast';

interface BillingPageProps {
    onBack: () => void;
    embedded?: boolean;
}

export default function BillingPage({ onBack, embedded = false }: BillingPageProps) {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [plansData, subData] = await Promise.all([
                subscriptionService.getPlans(),
                subscriptionService.getCurrentSubscription()
            ]);
            setPlans(plansData);
            setSubscription(subData);
        } catch (error) {
            console.error("Failed to fetch billing data", error);
            toast.error("Failed to load billing information");
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (plan: Plan) => {
        if (subscription?.plan === plan.name.toLowerCase() && subscription?.status === 'active') {
            toast("You are already subscribed to this plan");
            return;
        }

        setProcessingPlanId(plan._id);
        try {
            // 1. Create Order
            const orderData = await subscriptionService.createOrder(plan._id);
            const { order } = orderData;

            // Handle Free Plan (Auto-activate)
            if (order.is_free) {
                await subscriptionService.verifyPayment({
                    razorpay_order_id: order.id,
                    razorpay_payment_id: `free_pay_${Date.now()}`,
                    razorpay_signature: 'free_plan_sig',
                    planId: plan._id
                });
                toast.success(`Successfully subscribed to ${plan.name} plan!`);
                fetchData();
                return;
            }

            // 2. Initialize Razorpay
            const options: any = {
                key: "rzp_test_RlFdwu46rHy2pz", // Enter the Key ID generated from the Dashboard
                amount: order.amount,
                currency: order.currency,
                name: "Code Inspector",
                description: `Subscription for ${plan.name} Plan`,
                image: "https://your-logo-url.com/logo.png", // Optional
                // Only include order_id if it's a real order (not a mock one)
                ...(order.id && !order.id.startsWith('order_mock_') ? { order_id: order.id } : {}),
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment
                        await subscriptionService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: plan._id
                        });

                        toast.success(`Successfully subscribed to ${plan.name} plan!`);
                        fetchData(); // Refresh state
                    } catch (verifyError: any) {
                        console.error("Verification failed", verifyError);
                        toast.error("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: "User Name", // You can fetch this from user profile if available
                    email: "user@example.com",
                    contact: "9999999999"
                },
                notes: {
                    address: "Razorpay Corporate Office"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                toast.error(response.error.description || "Payment failed");
            });
            rzp1.open();

        } catch (error: any) {
            console.error("Subscription flow error", error);
            toast.error(error.response?.data?.message || "Failed to initiate subscription");
        } finally {
            setProcessingPlanId(null);
        }
    };

    const handleCancelClick = () => {
        setShowCancelConfirm(true);
    };

    const proceedWithCancellation = async () => {
        setShowCancelConfirm(false);
        setProcessing(true);
        try {
            await subscriptionService.cancelSubscription();
            toast.success("Subscription cancelled successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Cancellation failed");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className={`${embedded ? 'p-0' : 'min-h-screen p-6 md:p-12'} bg-[#0b1120] text-white font-sans flex items-center justify-center`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const currentPlanName = subscription?.plan ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : 'Free';
    const isSubscribed = subscription?.status === 'active';

    return (
        <div className={`${embedded ? 'p-0' : 'min-h-screen p-6 md:p-12'} bg-[#0b1120] text-white font-sans relative`}>
            {/* Confirmation Dialog */}
            {showCancelConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#1f2937] border border-gray-700 rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all scale-100">
                        <h3 className="text-xl font-bold text-white mb-2">Cancel Subscription?</h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Keep Subscription
                            </button>
                            <button
                                onClick={proceedWithCancellation}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-lg shadow-red-600/20"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                            You are currently on the <span className="text-blue-500 font-medium">{currentPlanName} Plan</span>.
                        </p>
                        {isSubscribed && subscription?.endDate && (
                            <p className="text-gray-400 text-sm">
                                Your subscription will renew on <span className="text-white font-medium">{new Date(subscription.endDate).toLocaleDateString()}</span>.
                            </p>
                        )}
                    </div>
                    <div className="flex gap-4">
                        {isSubscribed && currentPlanName !== 'Free' && (
                            <button
                                onClick={handleCancelClick}
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-gray-300 bg-[#1f2937] hover:bg-[#374151] rounded-lg transition-colors border border-gray-700 disabled:opacity-50"
                            >
                                Cancel Subscription
                            </button>
                        )}
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
                    {plans.map((plan) => {
                        const isCurrentPlan = subscription?.plan === plan.name.toLowerCase() && subscription?.status === 'active';
                        const isProcessingThisPlan = processingPlanId === plan._id;

                        return (
                            <div
                                key={plan._id}
                                className={`bg-[#111827] border ${plan.isPopular ? 'border-blue-500 shadow-xl shadow-blue-900/10' : 'border-gray-800'} rounded-xl p-6 flex flex-col relative`}
                            >
                                {plan.isPopular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wide">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                                <p className="text-gray-400 text-xs mb-6 h-8">{plan.description}</p>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-3xl font-bold">₹{plan.price}</span>
                                    <span className="text-gray-500 text-sm">/ {plan.interval}</span>
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                                            <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-[10px]"><FaCheck /></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={processingPlanId !== null || isCurrentPlan}
                                    className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors ${isCurrentPlan
                                        ? 'text-white bg-green-600 cursor-default'
                                        : plan.isPopular
                                            ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                                            : 'text-gray-300 bg-[#1f2937] hover:bg-[#374151] border border-gray-700'
                                        } disabled:opacity-70`}
                                >
                                    {isCurrentPlan ? 'Current Plan' : isProcessingThisPlan ? 'Processing...' : plan.price === 0 ? 'Get Started' : 'Subscribe'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Compare Features Table - Keeping static for now as it's purely presentational and complex to model dynamically without over-engineering */}
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
