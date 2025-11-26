import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
    FaCheckCircle,
    FaBug,
    FaShieldAlt,
    FaTachometerAlt,
    FaFlask,
    FaFolder,
    FaFileCode,
    FaChevronRight,
    FaChevronDown,
    FaArrowLeft
} from "react-icons/fa";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";

interface ReviewResultsPageProps {
    onBack?: () => void;
}

interface FileNode {
    name: string;
    path: string;
    type: 'blob' | 'tree';
    children?: FileNode[];
}

const buildFileTree = (items: any[]): FileNode[] => {
    const root: FileNode[] = [];

    // Sort items so folders come first, then files
    const sortedItems = [...items].sort((a, b) => {
        if (a.type === b.type) return a.path.localeCompare(b.path);
        return a.type === 'tree' ? -1 : 1;
    });

    // Helper to find or create a node at a specific level
    const findOrCreateNode = (level: FileNode[], name: string, type: 'blob' | 'tree', path: string): FileNode => {
        let node = level.find(n => n.name === name);
        if (!node) {
            node = { name, path, type, children: [] };
            level.push(node);
        }
        return node;
    };

    sortedItems.forEach(item => {
        const parts = item.path.split('/');
        let currentLevel = root;

        parts.forEach((part: string, index: number) => {
            const isLast = index === parts.length - 1;
            const type = isLast ? (item.type === 'tree' ? 'tree' : 'blob') : 'tree';
            const path = parts.slice(0, index + 1).join('/');

            const node = findOrCreateNode(currentLevel, part, type, path);

            if (type === 'tree') {
                if (!node.children) node.children = [];
                currentLevel = node.children;
            }
        });
    });

    // Recursive sort function
    const sortNodes = (nodes: FileNode[]) => {
        nodes.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'tree' ? -1 : 1;
        });
        nodes.forEach(node => {
            if (node.children) sortNodes(node.children);
        });
    };

    sortNodes(root);
    return root;
};

const FileTreeItem = ({ node, depth = 0, onFileClick, selectedPath }: { node: FileNode, depth?: number, onFileClick: (node: FileNode) => void, selectedPath: string | null }) => {
    const [isOpen, setIsOpen] = useState(depth < 1); // Open top level by default

    const handleClick = () => {
        if (node.type === 'tree') {
            setIsOpen(!isOpen);
        } else {
            onFileClick(node);
        }
    };

    return (
        <div>
            <div
                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${selectedPath === node.path ? "bg-blue-600/20 text-blue-400" : "text-gray-300 hover:bg-[#1e293b]"}`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={handleClick}
            >
                <div className="w-4 flex justify-center flex-shrink-0">
                    {node.type === 'tree' && (
                        isOpen ? <FaChevronDown className="text-[10px] text-gray-500" /> : <FaChevronRight className="text-[10px] text-gray-500" />
                    )}
                </div>
                {node.type === 'tree' ? <FaFolder className="text-blue-500 flex-shrink-0" /> : <FaFileCode className="text-gray-400 flex-shrink-0" />}
                <span className="text-sm truncate select-none">{node.name}</span>
            </div>
            {isOpen && node.children && (
                <div>
                    {node.children.map(child => (
                        <FileTreeItem key={child.path} node={child} depth={depth + 1} onFileClick={onFileClick} selectedPath={selectedPath} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function ReviewResultsPage({ onBack }: ReviewResultsPageProps) {
    const location = useLocation();
    const { repo, fileTree } = location.state || {};
    const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
    const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
    const [isLoadingFile, setIsLoadingFile] = useState(false);

    const treeData = useMemo(() => {
        if (fileTree) {
            return buildFileTree(fileTree);
        }
        return null;
    }, [fileTree]);

    const handleFileClick = async (node: FileNode) => {
        if (node.type === 'blob') {
            setSelectedFilePath(node.path);
            setIsLoadingFile(true);
            try {
                const data = await authService.getGithubFileContent(repo.owner.login, repo.name, node.path);
                if (data.success) {
                    setSelectedFileContent(data.data);
                } else {
                    toast.error(data.message || "Failed to fetch file content");
                }
            } catch (error) {
                console.error("Fetch file content error:", error);
                toast.error("Failed to fetch file content");
            } finally {
                setIsLoadingFile(false);
            }
        }
    };

    // Default code lines (dummy data)
    const defaultCodeLines = [
        "// Select a file to view its content",
        "function calculateTotal(items) {",
        "    let total = 0;",
        "    for (var i = 0; i < items.length; i++) {",
        "        total = items[i].price; // Bug: Should be +=",
        "    }",
        "    return total;",
        "}"
    ];

    const codeLines = selectedFileContent ? selectedFileContent.split('\n') : defaultCodeLines;

    return (
        <div className="h-full flex">
            {/* File Tree Sidebar */}
            <div className="w-64 bg-[#0f1623] border-r border-gray-800 flex flex-col">
                <div className="h-14 flex items-center px-4 border-b border-gray-800">
                    <button
                        onClick={onBack}
                        className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <FaArrowLeft /> Back to Dashboard
                    </button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                        {repo ? repo.name : "Files"}
                    </h3>
                    <div className="space-y-0.5">
                        {treeData ? (
                            treeData.map(node => (
                                <FileTreeItem
                                    key={node.path}
                                    node={node}
                                    onFileClick={handleFileClick}
                                    selectedPath={selectedFilePath}
                                />
                            ))
                        ) : (
                            <div className="text-gray-500 text-sm text-center mt-10">No files found</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-400 text-sm font-medium">Score</span>
                                <FaCheckCircle className="text-green-500" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">92</span>
                                <span className="text-gray-500 text-sm">/100</span>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                                <div className="h-full bg-green-500 w-[92%]"></div>
                            </div>
                        </div>

                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-400 text-sm font-medium">Bugs</span>
                                <FaBug className="text-red-500" />
                            </div>
                            <span className="text-3xl font-bold text-white">3</span>
                        </div>

                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-400 text-sm font-medium">Security</span>
                                <FaShieldAlt className="text-orange-500" />
                            </div>
                            <span className="text-3xl font-bold text-white">1</span>
                        </div>

                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-400 text-sm font-medium">Performance</span>
                                <FaTachometerAlt className="text-blue-500" />
                            </div>
                            <span className="text-3xl font-bold text-white">5</span>
                        </div>

                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-400 text-sm font-medium">Code Smells</span>
                                <FaFlask className="text-purple-500" />
                            </div>
                            <span className="text-3xl font-bold text-white">12</span>
                        </div>
                    </div>

                    {/* Tabs & Code Viewer */}
                    <div className="flex flex-col min-h-[600px]">
                        {/* Tabs */}
                        <div className="flex items-center gap-6 border-b border-gray-800 mb-6 overflow-x-auto">
                            {["Issues (All)", "Bugs", "Security", "Performance", "Best Practices", "Refactored Code"].map((tab, idx) => (
                                <button
                                    key={tab}
                                    className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors relative ${idx === 0 ? "text-blue-500" : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {tab}
                                    {idx === 0 && <span className="ml-2 bg-blue-500/20 text-blue-400 text-xs px-1.5 py-0.5 rounded-full">21</span>}
                                    {tab === "Bugs" && <span className="ml-2 bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">3</span>}
                                    {tab === "Security" && <span className="ml-2 bg-orange-500/20 text-orange-400 text-xs px-1.5 py-0.5 rounded-full">1</span>}
                                    {tab === "Performance" && <span className="ml-2 bg-blue-500/20 text-blue-400 text-xs px-1.5 py-0.5 rounded-full">5</span>}
                                    {idx === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Code Viewer */}
                            <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#1f2937]/30">
                                    <span className="text-xs text-gray-400 font-mono">
                                        {selectedFilePath || "Select a file"}
                                    </span>
                                    {isLoadingFile && <span className="text-xs text-blue-400">Loading...</span>}
                                </div>
                                <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                                    {codeLines.map((line, idx) => (
                                        <div key={idx} className="flex hover:bg-[#1f2937]/50">
                                            <span className="w-8 text-gray-600 text-right mr-4 select-none flex-shrink-0">{idx + 1}</span>
                                            <pre className="text-gray-300 whitespace-pre-wrap break-all">
                                                {line}
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Issues Sidebar */}
                            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-gray-800">
                                    <h2 className="font-semibold text-white">Issues Found</h2>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {/* Issue 1 */}
                                    <div className="bg-[#1f2937]/50 border border-gray-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded uppercase">Bug</span>
                                            <span className="text-gray-500 text-xs">Line 4</span>
                                        </div>
                                        <h3 className="text-gray-200 font-medium text-sm mb-1">Incorrect Assignment</h3>
                                        <p className="text-gray-400 text-xs mb-3">Variable `total` is assigned instead of accumulated.</p>
                                        <button className="text-blue-400 text-xs hover:underline">Quick Fix: Change `=` to `+=`</button>
                                    </div>

                                    {/* Issue 2 */}
                                    <div className="bg-[#1f2937]/50 border border-gray-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded uppercase">Performance</span>
                                            <span className="text-gray-500 text-xs">Line 9</span>
                                        </div>
                                        <h3 className="text-gray-200 font-medium text-sm mb-1">Nested Loop</h3>
                                        <p className="text-gray-400 text-xs mb-3">Inefficient nested loop can cause performance degradation.</p>
                                        <button className="text-blue-400 text-xs hover:underline">Suggestion: Refactor logic</button>
                                    </div>

                                    {/* Issue 3 */}
                                    <div className="bg-[#1f2937]/50 border border-gray-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-0.5 rounded uppercase">Code Smell</span>
                                            <span className="text-gray-500 text-xs">Line 3</span>
                                        </div>
                                        <h3 className="text-gray-200 font-medium text-sm mb-1">`var` declaration</h3>
                                        <p className="text-gray-400 text-xs mb-3">`var` is function-scoped and can lead to unexpected behavior.</p>
                                        <button className="text-blue-400 text-xs hover:underline">Quick Fix: Use `let` instead</button>
                                    </div>

                                    {/* Issue 4 */}
                                    <div className="bg-[#1f2937]/50 border border-gray-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-0.5 rounded uppercase">Security</span>
                                            <span className="text-gray-500 text-xs">Line 15</span>
                                        </div>
                                        <h3 className="text-gray-200 font-medium text-sm mb-1">Potential XSS</h3>
                                        <p className="text-gray-400 text-xs mb-3">Rendering unsanitized data can lead to security risks.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
