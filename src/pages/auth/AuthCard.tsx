import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Snackbar from "../../components/ui/Snackbar";
import { useLoader } from "../../context/LoaderContext";
import { authService } from "../../services/authService";

interface AuthCardProps {
  onSignInClick: () => void;
  onLogin: (email: string, pass: string) => void;
}

// Extend Window interface for Google Sign-In
declare global {
  interface Window {
    google: any;
  }
}

export default function AuthCard({ onSignInClick, onLogin }: AuthCardProps) {
  const { showLoader, hideLoader, isLoading } = useLoader();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        showSnackbar("GitHub signup successful! Redirecting...", "success");
        // Store token and user data
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Redirect to dashboard
        setTimeout(() => {
          hideLoader();
          onLogin(data.data.user.email, "");
        }, 2000);
      } else {
        showSnackbar(data.message || "GitHub signup failed", "error");
        hideLoader();
      }
    } catch (err) {
      showSnackbar("Failed to connect to server. Please try again.", "error");
      console.error("GitHub signup error:", err);
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
      // We render it into the invisible div overlaying the custom button
      const parent = document.getElementById("google-signup-button");
      if (parent) {
        window.google.accounts.id.renderButton(
          parent,
          {
            theme: "filled_black",
            size: "large",
            width: parent.clientWidth, // Match container width
            text: "signup_with",
            type: "standard"
          }
        );
      }
    }
  }, []);

  const handleGithubClick = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    // Redirect to /signup page to handle the callback
    const redirectUri = window.location.origin + "/signup";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  };

  const handleGoogleLogin = async (response: any) => {
    showLoader();
    try {
      const data = await authService.googleLogin(response.credential);

      if (data.success) {
        showSnackbar("Google signup successful! Redirecting...", "success");
        // Store token and user data
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Redirect to dashboard
        setTimeout(() => {
          hideLoader();
          onLogin(data.data.user.email, "");
        }, 2000);
      } else {
        showSnackbar(data.message || "Google signup failed", "error");
        hideLoader();
      }
    } catch (err) {
      showSnackbar("Failed to connect to server. Please try again.", "error");
      console.error("Google signup error:", err);
      hideLoader();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      showSnackbar("Please fill in all fields", "error");
      return;
    }

    if (password !== confirmPassword) {
      showSnackbar("Passwords do not match", "error");
      return;
    }

    if (password.length < 6) {
      showSnackbar("Password must be at least 6 characters", "error");
      return;
    }

    showLoader();

    try {
      const data = await authService.register({ name, email, password });

      if (data.success) {
        showSnackbar("Account created successfully! Redirecting to login...", "success");
        // Store token and user data
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        // Redirect to login after 2 seconds
        setTimeout(() => {
          onSignInClick();
        }, 2000);
      } else {
        showSnackbar(data.message || "Registration failed", "error");
      }
    } catch (err) {
      showSnackbar("Failed to connect to server. Please try again.", "error");
      console.error("Registration error:", err);
    } finally {
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

      <div className="flex justify-center">
        <div className="w-full bg-[#1e293b] border border-gray-700/50 
          shadow-2xl rounded-2xl p-8 md:p-10">

          <h2 className="text-white text-2xl font-semibold">Create your account</h2>
          <p className="text-gray-400 text-sm mt-1 mb-4">
            Get Started with AI Code Inspector
          </p>

          <div className="relative w-full mb-3">
            <button className="w-full flex items-center justify-center gap-2 
              bg-[#1e293b] border border-gray-600 text-gray-200 py-2.5 rounded-full pointer-events-none">
              <FcGoogle className="text-xl" />
              Sign up with Google
            </button>
            <div id="google-signup-button" className="absolute inset-0 opacity-0 z-10 overflow-hidden rounded-full"></div>
          </div>

          <button
            onClick={handleGithubClick}
            className="w-full flex items-center justify-center gap-2 
            bg-[#1e293b] border border-gray-600 text-gray-200 py-2.5 rounded-full">
            <FaGithub className="text-xl" />
            Sign up with GitHub
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <span className="flex-1 h-px bg-gray-700"></span>
            <span className="text-gray-400 text-xs">OR</span>
            <span className="flex-1 h-px bg-gray-700"></span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#0b1120] border border-gray-700 rounded-lg text-gray-200 px-3 py-2
                  placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0b1120] border border-gray-700 rounded-lg text-gray-200 px-3 py-2
                  placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0b1120] border border-gray-700 rounded-lg text-gray-200 px-3 py-2
                  placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#0b1120] border border-gray-700 rounded-lg text-gray-200 px-3 py-2
                  placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition 
                text-white py-2.5 rounded-full mt-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-gray-500 text-xs mt-4">
            By creating an account, you agree to our
            <span className="text-blue-400 cursor-pointer"> Terms of Service </span>
            and
            <span className="text-blue-400 cursor-pointer"> Privacy Policy</span>.
          </p>

          <p className="text-gray-400 mt-4 text-sm">
            Already have an account?{" "}
            <button onClick={onSignInClick} className="text-blue-400 cursor-pointer hover:underline">Sign In</button>
          </p>

        </div>
      </div>
    </>
  );
}