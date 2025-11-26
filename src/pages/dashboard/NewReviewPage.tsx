import { useState, useEffect, useCallback } from "react";
import { FaCloudUploadAlt, FaFileCode, FaPaste, FaBolt, FaGithub, FaSearch, FaCodeBranch, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { useLoader } from "../../context/LoaderContext";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";

interface NewReviewPageProps {
    onRunReview?: () => void;
}

interface GithubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    language: string;
    stars: number;
    updated_at: string;
    default_branch: string;
    owner: {
        login: string;
    }
}

export default function NewReviewPage({ onRunReview }: NewReviewPageProps) {
    const [activeTab, setActiveTab] = useState<"upload" | "paste" | "github">("upload");
    const [repos, setRepos] = useState<GithubRepo[]>([]);
    const [isLoadingRepos, setIsLoadingRepos] = useState(false);
    const [isGithubConnected, setIsGithubConnected] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);
    const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);

    const { showLoader, hideLoader } = useLoader();
    const navigate = useNavigate();

    const fetchRepos = useCallback(async () => {
        setIsLoadingRepos(true);
        try {
            const data = await authService.getGithubRepos();
            if (data.success) {
                setRepos(data.data);
                setIsGithubConnected(true);
            } else {
                // If 400/401, it means not connected or token expired
                setIsGithubConnected(false);
            }
        } catch (error) {
            console.error("Fetch repos error:", error);
            setIsGithubConnected(false);
        } finally {
            setIsLoadingRepos(false);
        }
    }, []);

    const handleGithubCallback = useCallback(async (code: string) => {
        showLoader();
        try {
            const data = await authService.linkGithub(code);
            if (data.success) {
                toast.success("GitHub account connected successfully!");
                setIsGithubConnected(true);
                setActiveTab("github");
                fetchRepos();
            } else {
                toast.error(data.message || "Failed to connect GitHub account");
            }
        } catch (error) {
            console.error("GitHub link error:", error);
            toast.error("Failed to connect to GitHub");
        } finally {
            hideLoader();
        }
    }, [fetchRepos, showLoader, hideLoader]);

    // Check for GitHub code on mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // Clear the code from URL
            window.history.replaceState({}, document.title, window.location.pathname);
            handleGithubCallback(code);
        }
    }, [handleGithubCallback]);

    // Check connection status when tab changes to github
    useEffect(() => {
        if (activeTab === "github") {
            fetchRepos();
        }
    }, [activeTab, fetchRepos]);

    const handleConnectGithub = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const redirectUri = window.location.origin + "/dashboard/new-review";
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user:email`;
    };

    const handleDisconnectGithub = () => {
        setIsDisconnectModalOpen(true);
    };

    const confirmDisconnect = async () => {
        showLoader();
        try {
            const data = await authService.unlinkGithub();
            if (data.success) {
                toast.success("GitHub account disconnected successfully");
                setIsGithubConnected(false);
                setRepos([]);
                setSelectedRepo(null);
            } else {
                toast.error(data.message || "Failed to disconnect GitHub account");
            }
        } catch (error) {
            console.error("Disconnect GitHub error:", error);
            toast.error("Failed to disconnect GitHub account");
        } finally {
            hideLoader();
        }
    };

    const handleRunReview = async () => {
        if (activeTab === "github" && selectedRepo) {
            showLoader();
            try {
                const data = await authService.getGithubRepoTree(selectedRepo.owner.login, selectedRepo.name, selectedRepo.default_branch);
                if (data.success) {
                    navigate("/dashboard/results", {
                        state: {
                            repo: selectedRepo,
                            fileTree: data.data
                        }
                    });
                } else {
                    toast.error(data.message || "Failed to fetch repository files");
                }
            } catch (error) {
                console.error("Run review error:", error);
                toast.error("Failed to start code review");
            } finally {
                hideLoader();
            }
        } else {
            // For other tabs, just call the prop or navigate (placeholder for now)
            if (onRunReview) onRunReview();
        }
    };

    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col items-center max-w-4xl mx-auto pt-8 pb-20">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">Start a New Code Review</h1>
                <p className="text-gray-400">Upload a file, paste your code, or import from GitHub to get started.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800 w-full mb-8">
                <button
                    onClick={() => setActiveTab("upload")}
                    className={`flex-1 pb-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === "upload" ? "text-blue-500" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <FaFileCode /> Upload File
                    {activeTab === "upload" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("paste")}
                    className={`flex-1 pb-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === "paste" ? "text-blue-500" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <FaPaste /> Paste Code
                    {activeTab === "paste" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("github")}
                    className={`flex-1 pb-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === "github" ? "text-blue-500" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <FaGithub /> Import from GitHub
                    {activeTab === "github" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                    )}
                </button>
            </div>

            {/* Upload Area */}
            {activeTab === "upload" && (
                <div className="w-full border-2 border-dashed border-gray-700 rounded-xl bg-[#111827]/50 p-12 flex flex-col items-center justify-center mb-12 hover:border-blue-500/50 hover:bg-[#111827] transition-all cursor-pointer group">
                    <div className="w-16 h-16 rounded-full bg-[#1f2937] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FaCloudUploadAlt className="text-3xl text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="text-white font-medium mb-1">Drag & drop files here</h3>
                    <p className="text-gray-500 text-sm mb-4">or <span className="text-blue-500 hover:underline">click to upload</span></p>
                    <p className="text-gray-600 text-xs">Supported formats: JS, PY, JAVA, HTML, CSS (Max 5MB)</p>
                </div>
            )}

            {/* Paste Area */}
            {activeTab === "paste" && (
                <div className="w-full mb-12">
                    <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-800 bg-[#1f2937]/30 text-xs text-gray-400 font-medium">
                            Paste your code below
                        </div>
                        <textarea
                            className="w-full h-64 bg-[#0b1120] text-gray-300 p-4 font-mono text-sm focus:outline-none resize-none placeholder-gray-600"
                            placeholder="< Your code goes here >"
                        ></textarea>
                    </div>
                </div>
            )}

            {/* GitHub Area */}
            {activeTab === "github" && (
                <div className="w-full mb-12">
                    {!isGithubConnected ? (
                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-[#1f2937] flex items-center justify-center mb-6">
                                <FaGithub className="text-4xl text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Connect to GitHub</h3>
                            <p className="text-gray-400 text-sm mb-8 text-center max-w-md">
                                Connect your GitHub account to easily browse and import your repositories directly.
                            </p>

                            <button
                                onClick={handleConnectGithub}
                                className="bg-[#24292e] hover:bg-[#2f363d] text-white px-8 py-3 rounded-lg font-medium transition flex items-center gap-3 border border-gray-700 shadow-lg hover:shadow-xl"
                            >
                                <FaGithub className="text-xl" />
                                Connect GitHub Account
                            </button>
                        </div>
                    ) : (
                        <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden flex flex-col h-[500px]">
                            {/* Search Bar & Disconnect */}
                            <div className="p-4 border-b border-gray-800 bg-[#1f2937]/30 flex items-center gap-3 justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <FaSearch className="text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search repositories..."
                                        className="bg-transparent border-none focus:outline-none text-white text-sm w-full placeholder-gray-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleDisconnectGithub}
                                    className="text-xs text-red-400 hover:text-red-300 hover:underline px-2"
                                >
                                    Disconnect
                                </button>
                            </div>

                            {/* Repo List */}
                            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                {isLoadingRepos ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                        <p className="text-sm">Loading repositories...</p>
                                    </div>
                                ) : filteredRepos.length > 0 ? (
                                    filteredRepos.map(repo => (
                                        <div
                                            key={repo.id}
                                            onClick={() => setSelectedRepo(repo)}
                                            className={`p-4 rounded-lg cursor-pointer transition border ${selectedRepo?.id === repo.id
                                                ? "bg-blue-600/10 border-blue-500/50"
                                                : "bg-transparent border-transparent hover:bg-[#1f2937]"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`font-medium ${selectedRepo?.id === repo.id ? "text-blue-400" : "text-gray-200"}`}>
                                                    {repo.full_name}
                                                </h4>
                                                {repo.language && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#1f2937] text-gray-400 border border-gray-700">
                                                        {repo.language}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-1 mb-2">{repo.description || "No description"}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <FaStar className="text-yellow-500/70" /> {repo.stars}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaCodeBranch /> {repo.default_branch}
                                                </span>
                                                <span>
                                                    Updated {new Date(repo.updated_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                        <p>No repositories found matching "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer / Selection Status */}
                            {selectedRepo && (
                                <div className="p-4 border-t border-gray-800 bg-[#1f2937]/50 flex justify-between items-center">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FaGithub className="text-gray-400 flex-shrink-0" />
                                        <span className="text-sm text-white truncate font-medium">{selectedRepo.full_name}</span>
                                    </div>
                                    <span className="text-xs text-green-400 font-medium px-2 py-1 bg-green-400/10 rounded border border-green-400/20 whitespace-nowrap">
                                        Ready to review
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* OR Divider */}
            <div className="w-full flex items-center gap-4 mb-8">
                <div className="h-px bg-gray-800 flex-1"></div>
                <span className="text-gray-500 text-xs font-medium">OR</span>
                <div className="h-px bg-gray-800 flex-1"></div>
            </div>

            {/* Settings & Action */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Language</label>
                    <select
                        className="w-full bg-[#111827] border border-gray-700 text-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 text-sm appearance-none"
                        value={selectedRepo?.language || "Autodetect"}
                        disabled
                    >
                        <option value="Autodetect">Autodetect</option>
                        {selectedRepo?.language && <option value={selectedRepo.language}>{selectedRepo.language}</option>}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">AI Engine</label>
                    <select className="w-full bg-[#111827] border border-gray-700 text-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 text-sm appearance-none">
                        <option>Gemini 2.0 Flash (Recommended)</option>
                    </select>
                </div>
            </div>

            <div className="w-full flex justify-end">
                <button
                    onClick={handleRunReview}
                    disabled={activeTab === "github" && !selectedRepo}
                    className={`px-8 py-3 rounded-lg font-medium transition shadow-lg flex items-center gap-2 ${activeTab === "github" && !selectedRepo
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                        }`}
                >
                    <FaBolt /> Run Code Review
                </button>
            </div>

            <ConfirmationModal
                isOpen={isDisconnectModalOpen}
                onClose={() => setIsDisconnectModalOpen(false)}
                onConfirm={confirmDisconnect}
                title="Disconnect GitHub Account"
                message="Are you sure you want to disconnect your GitHub account? You will lose access to your repositories until you connect again."
                confirmText="Disconnect"
                isDangerous={true}
            />
        </div >
    );
}
