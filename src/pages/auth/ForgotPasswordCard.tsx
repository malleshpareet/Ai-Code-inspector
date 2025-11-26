import { MdEmail } from "react-icons/md";

interface ForgotPasswordCardProps {
    onSignInClick: () => void;
}

export default function ForgotPasswordCard({ onSignInClick }: ForgotPasswordCardProps) {
    return (
        <div className="w-full bg-[#1e293b] border border-gray-700/50 shadow-2xl rounded-2xl p-8 md:p-10">
            <h2 className="text-white text-3xl font-bold mb-2">Forgot Password?</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Enter the email address associated with your account, and we'll send you a link to reset your password.
            </p>

            <form className="space-y-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg pl-4 pr-10 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                            <MdEmail className="text-xl" />
                        </div>
                    </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg shadow-blue-600/20">
                    Send Reset Link
                </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-8">
                Remember your password?{" "}
                <button onClick={onSignInClick} className="text-blue-500 hover:text-blue-400 font-medium hover:underline">
                    Sign In
                </button>
            </p>
        </div>
    );
}
