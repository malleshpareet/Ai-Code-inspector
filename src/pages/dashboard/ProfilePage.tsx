import { useState, useEffect } from "react";
import { FaCopy } from "react-icons/fa";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { useLoader } from "../../context/LoaderContext";

export default function ProfilePage() {
    const { showLoader, hideLoader } = useLoader();
    const [darkMode, setDarkMode] = useState(true);

    // Profile fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    // Password fields
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Fetch profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await authService.getProfile();
                if (data.success && data.data?.user) {
                    const u = data.data.user;
                    setName(u.name || '');
                    setEmail(u.email || '');
                    // If username exists, use it. If not, derive from email (before @)
                    if (u.username) {
                        setUsername(u.username);
                    } else if (u.email) {
                        setUsername(u.email.split('@')[0]);
                    }
                }
            } catch (err) {
                console.error('Failed to load profile', err);
                toast.error('Failed to load profile');
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        showLoader();
        try {
            const result = await authService.updateProfile({ name, email, username });
            if (result.success) {
                toast.success('Profile updated successfully');
            } else {
                toast.error(result.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error updating profile');
        } finally {
            hideLoader();
        }
    };

    const handleUpdatePassword = async () => {
        showLoader();
        try {
            const result = await authService.updatePassword({ currentPassword, newPassword });
            if (result.success) {
                toast.success('Password updated successfully');
                setCurrentPassword('');
                setNewPassword('');
            } else {
                toast.error(result.message || 'Failed to update password');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error updating password');
        } finally {
            hideLoader();
        }
    };

    const handleDeleteAccount = async () => {
        showLoader();
        try {
            const result = await authService.deleteAccount();
            if (result.success) {
                toast.success('Account deleted');
                authService.logout();
                window.location.href = '/login';
            } else {
                toast.error(result.message || 'Failed to delete account');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error deleting account');
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Profile &amp; Account Settings</h1>
                <p className="text-gray-400">Manage your profile, password, and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Settings */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Details */}
                    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-1">Profile Details</h2>
                                <p className="text-gray-400 text-sm">Update your personal information.</p>
                            </div>
                            <button onClick={handleUpdateProfile} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                                Save Changes
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-gray-400 text-sm font-medium mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">Username</label>
                            <div className="flex items-center bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2.5">
                                <span className="text-gray-500 mr-1">codeinspector.ai/</span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="bg-transparent border-none p-0 text-white focus:ring-0 w-full focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-1">Change Password</h2>
                                <p className="text-gray-400 text-sm">For your security, we recommend using a strong password.</p>
                            </div>
                            <button onClick={handleUpdatePassword} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                                Update Password
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 text-sm font-medium mb-2">Current Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm font-medium mb-2">New Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* API Key */}
                    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-1">API Key</h2>
                                <p className="text-gray-400 text-sm">Use this key to integrate our services with your applications.</p>
                            </div>
                            <button className="flex items-center gap-2 bg-[#1f2937] hover:bg-[#374151] text-white px-4 py-2 rounded-lg text-sm font-medium transition border border-gray-700">
                                <FaCopy /> Generate New Key
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value="ci_sk_live_************************"
                                className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-3 text-gray-300 font-mono text-sm focus:outline-none"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                                <FaCopy />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Side Settings */}
                <div className="space-y-8">
                    {/* Account Settings */}
                    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Account Settings</h2>
                        <div className="flex items-center justify-between p-4 bg-[#1f2937]/50 rounded-lg border border-gray-800">
                            <div>
                                <div className="font-medium text-white mb-1">Dark Mode</div>
                                <div className="text-xs text-gray-400">Toggle between light and dark themes.</div>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${darkMode ? 'bg-blue-600' : 'bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                        <h2 className="text-xl font-semibold text-red-500 mb-2">Danger Zone</h2>
                        <p className="text-gray-400 text-sm mb-6">Be careful, these actions are irreversible.</p>
                        <button onClick={() => setShowDeleteModal(true)} className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition shadow-lg shadow-red-600/20">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1f2937] border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-2">Delete Account?</h3>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data including code reviews will be lost.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
