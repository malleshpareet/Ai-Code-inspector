import { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import Snackbar from "../../components/ui/Snackbar";
import { authService } from "../../services/authService";
import { useLoader } from "../../context/LoaderContext";

interface LoginCardProps {
    onSignUpClick: () => void;
    onForgotPasswordClick: () => void;
    onLogin: (email: string, pass: string) => void;
}

// Extend Window interface for Google Sign-In
declare global {
    interface Window {
        google: any;
    }
}

export default function LoginCard({ onSignUpClick, onForgotPasswordClick, onLogin }: LoginCardProps) {
    const { showLoader, hideLoader, isLoading } = useLoader();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        isOpen: false,
        message: "",
        type: "success" as "success" | "error" | "warning" | "info"
    });

    const showSnackbar = (message: string, type: "success" | "error" | "warning" | "info") => {
        setSnackbar({ isOpen: true, message, type });
    };

    const closeSnackbar = () => {
        setSnackbar({ ...snackbar, isOpen: false });
    };

    // Check for GitHub code on mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // Clear the code from URL to prevent re-submission on refresh
            window.history.replaceState({}, document.title, window.location.pathname);
            handleGithubCallback(code);
        }
    }, []);

    const handleGithubCallback = async (code: string) => {
        showLoader();
        try {
            const data = await authService.githubLogin(code);

            if (data.success) {
                showSnackbar("GitHub login successful! Redirecting...", "success");
                // Store token and user data
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("user", JSON.stringify(data.data.user));

                // Redirect to dashboard
                setTimeout(() => {
                    hideLoader();
                    onLogin(data.data.user.email, "");
                }, 2000);
            } else {
                showSnackbar(data.message || "GitHub login failed", "error");
                hideLoader();
            }
        } catch (err) {
            showSnackbar("Failed to connect to server. Please try again.", "error");
            console.error("GitHub login error:", err);
            hideLoader();
        }
    };

    // Initialize Google Sign-In
    useEffect(() => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleGoogleLogin
            });

            // Render the Google button
            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                {
                    theme: "filled_black",
                    size: "large",
                    width: "100%",
                    text: "continue_with"
                }
            );
        }
    }, []);

    const handleGithubClick = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        // Redirect to /login page to handle the callback
        const redirectUri = window.location.origin + "/login";
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    };

    const handleGoogleLogin = async (response: any) => {
        showLoader();
        try {
            const data = await authService.googleLogin(response.credential);

            if (data.success) {
                showSnackbar("Google login successful! Redirecting...", "success");
                // Store token and user data
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("user", JSON.stringify(data.data.user));

                // Redirect to dashboard
                setTimeout(() => {
                    hideLoader();
                    onLogin(data.data.user.email, "");
                }, 2000);
            } else {
                showSnackbar(data.message || "Google login failed", "error");
                hideLoader();
            }
        } catch (err) {
            showSnackbar("Failed to connect to server. Please try again.", "error");
            console.error("Google login error:", err);
            hideLoader();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            showSnackbar("Please fill in all fields", "error");
            return;
        }

        showLoader();

        try {
            const data = await authService.login({ email, password });

            if (data.success) {
                showSnackbar("Login successful! Redirecting...", "success");
                // Store token and user data
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("user", JSON.stringify(data.data.user));

                // Call the original onLogin handler after a short delay
                setTimeout(() => {
                    hideLoader();
                    onLogin(email, password);
                }, 2000);
            } else {
                showSnackbar(data.message || "Login failed", "error");
                hideLoader();
            }
        } catch (err) {
            showSnackbar("Failed to connect to server. Please try again.", "error");
            console.error("Login error:", err);
            hideLoader();
        }
    };

    return (
        <>
            {/* Snackbar Notification */}
            <Snackbar
                message={snackbar.message}
                type={snackbar.type}
                isOpen={snackbar.isOpen}
                onClose={closeSnackbar}
            />

            <div className="w-full bg-[#1e293b] border border-gray-700/50 shadow-2xl rounded-2xl p-8 md:p-10">
                <h2 className="text-white text-3xl font-bold mb-2">Welcome Back</h2>
                <p className="text-gray-400 text-sm mb-8">
                    Log in to continue to your dashboard.
                </p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <button type="button" onClick={onForgotPasswordClick} className="text-sm text-blue-500 hover:text-blue-400 hover:underline">
                                Forgot Password?
                            </button>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#1e293b] text-gray-500">OR</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={handleGithubClick}
                        className="flex items-center justify-center gap-2 bg-[#2d3748] hover:bg-[#374151] border border-gray-600 text-gray-200 py-2.5 rounded-lg transition"
                    >
                        <FaGithub className="text-xl" />
                        <span className="text-sm font-medium">Continue with GitHub</span>
                    </button>
                    <div id="google-signin-button" className="flex items-center justify-center"></div>
                </div>

                <p className="text-center text-gray-400 text-sm mt-8">
                    Don't have an account?{" "}
                    <button onClick={onSignUpClick} className="text-blue-500 hover:text-blue-400 font-medium hover:underline">
                        Sign Up
                    </button>
                </p>
            </div>
        </>
    );
}

