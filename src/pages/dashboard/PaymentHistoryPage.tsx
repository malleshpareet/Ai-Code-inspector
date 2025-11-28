import { useState, useEffect } from 'react';
import { subscriptionService } from '../../services/subscriptionService';
import { FaHistory, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Payment {
    _id: string;
    plan: {
        name: string;
        price: number;
    };
    amount: number;
    currency: string;
    status: 'success' | 'failed' | 'pending';
    razorpayPaymentId: string;
    createdAt: string;
}

export default function PaymentHistoryPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await subscriptionService.getPaymentHistory();
            setPayments(data);
        } catch (error) {
            console.error("Failed to fetch payment history", error);
            toast.error("Failed to load payment history");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-white">Payment History</h1>
                <p className="text-gray-400">View your past transactions and invoices.</p>
            </div>

            {payments.length === 0 ? (
                <div className="bg-[#111827] border border-gray-800 rounded-xl p-12 text-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                        <FaHistory />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No payment history</h3>
                    <p className="text-gray-400">You haven't made any payments yet.</p>
                </div>
            ) : (
                <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-[#1f2937] text-gray-200 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Plan</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Payment ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {payments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-[#1f2937]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                            <span className="block text-xs text-gray-500">
                                                {new Date(payment.createdAt).toLocaleTimeString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">
                                            {payment.plan?.name || 'Unknown Plan'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {payment.currency === 'USD' ? '$' : '₹'}{payment.amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${payment.status === 'success' ? 'bg-green-500/10 text-green-500' :
                                                    payment.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                {payment.status === 'success' && <FaCheckCircle />}
                                                {payment.status === 'failed' && <FaTimesCircle />}
                                                {payment.status === 'pending' && <FaClock />}
                                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                            {payment.razorpayPaymentId || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
