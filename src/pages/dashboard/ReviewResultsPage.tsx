import { useState, useMemo, useEffect } from "react";
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
    FaArrowLeft,
    FaCheck
} from "react-icons/fa";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReviewResultsPageProps {
    onBack?: () => void;
}

interface FileNode {
    name: string;
    path: string;
    type: 'blob' | 'tree';
    children?: FileNode[];
}

interface Issue {
    type: "Bug" | "Security" | "Performance" | "Code Smell";
    line: number;
    title: string;
    description: string;
    suggestion?: string;
}

const buildFileTree = (items: any[]): FileNode[] => {
    const root: FileNode[] = [];

    const sortedItems = [...items].sort((a, b) => {
        if (a.type === b.type) return a.path.localeCompare(b.path);
        return a.type === 'tree' ? -1 : 1;
    });

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
    const [isOpen, setIsOpen] = useState(depth < 1);

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
    // const navigate = useNavigate();
    const { repo, fileTree, isHistory } = location.state || {};
    const [currentRepo, setCurrentRepo] = useState<any | null>(repo || null);
    const [currentFileTree, setCurrentFileTree] = useState<any[] | null>(fileTree || null);
    const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
    const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
    const [isLoadingFile, setIsLoadingFile] = useState(false);
    const [reviewResults, setReviewResults] = useState<Issue[]>([]);
    const [isReviewing, setIsReviewing] = useState(false);
    const [activeTab, setActiveTab] = useState("All Issues");
    const [historyRepoName, setHistoryRepoName] = useState<string | null>(null);

    const treeData = useMemo(() => {
        if (currentFileTree) {
            return buildFileTree(currentFileTree);
        }
        return null;
    }, [currentFileTree]);

    useEffect(() => {
        const storedResults = sessionStorage.getItem('reviewResults');
        if (storedResults) {
            try {
                const { code, filename, results, repoName } = JSON.parse(storedResults);
                setSelectedFileContent(code);
                setSelectedFilePath(filename);
                setReviewResults(results.issues || []);
                if (repoName) setHistoryRepoName(repoName);
                sessionStorage.removeItem('reviewResults');
            } catch (error) {
                console.error("Error loading stored results:", error);
            }
        }
    }, []);

    // Fetch file tree for history view if missing
    useEffect(() => {
        const fetchTree = async () => {
            if (isHistory && !currentFileTree && historyRepoName) {
                try {
                    const [owner, repoName] = historyRepoName.split('/');
                    if (owner && repoName) {
                        // 1. Get repo details to find default branch
                        const repoData = await authService.getGithubRepo(owner, repoName);
                        if (repoData.success) {
                            setCurrentRepo(repoData.data);

                            // 2. Get file tree
                            const treeData = await authService.getGithubRepoTree(owner, repoName, repoData.data.default_branch);
                            if (treeData.success) {
                                setCurrentFileTree(treeData.data);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error fetching history file tree:", error);
                }
            }
        };
        fetchTree();
    }, [isHistory, currentFileTree, historyRepoName]);

    const handleFileClick = async (node: FileNode) => {
        if (node.type === 'blob') {
            setSelectedFilePath(node.path);
            setIsLoadingFile(true);
            setReviewResults([]);
            try {
                // Use currentRepo instead of repo
                if (!currentRepo) return;
                const data = await authService.getGithubFileContent(currentRepo.owner.login, currentRepo.name, node.path);
                if (data.success) {
                    setSelectedFileContent(data.data);
                    setIsReviewing(true);
                    try {
                        const reviewData = await authService.reviewCode(data.data, node.name);
                        if (reviewData.success) {
                            setReviewResults(reviewData.data);
                        } else {
                            toast.error("Failed to review code");
                        }
                    } catch (reviewError) {
                        console.error("Review error:", reviewError);
                        toast.error("Failed to review code");
                    } finally {
                        setIsReviewing(false);
                    }
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

    const handleDone = async () => {
        if (reviewResults.length === 0 && !selectedFileContent) {
            toast.error("No review results to save");
            return;
        }

        try {
            const score = Math.max(0, 100 - (reviewResults.length * 2));
            const status = score >= 80 ? 'completed' : score >= 50 ? 'in-progress' : 'failed';

            let language = "javascript";
            if (selectedFilePath) {
                const ext = selectedFilePath.split('.').pop()?.toLowerCase();
                if (ext === 'ts' || ext === 'tsx') language = 'typescript';
                else if (ext === 'py') language = 'python';
                else if (ext === 'go') language = 'go';
                else if (ext === 'java') language = 'java';
                else if (ext === 'cpp' || ext === 'c') language = 'c++';
            }

            await authService.saveReview({
                title: selectedFilePath || "Code Review",
                repoName: currentRepo ? currentRepo.name : undefined,
                code: selectedFileContent || "",
                language: language,
                status: status,
                results: {
                    score: score,
                    issues: reviewResults,
                    summary: `Found ${reviewResults.length} issues.`
                }
            });

            toast.success("Review report saved!");
            // navigate('/dashboard/history'); // Removed navigation as requested
        } catch (error) {
            console.error("Failed to save review:", error);
            toast.error("Failed to save review report");
        }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("Code Review Report", 14, 22);

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        const title = selectedFilePath || (currentRepo ? currentRepo.name : (historyRepoName || "Code Review"));
        doc.text(`Target: ${title}`, 14, 32);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);

        const score = reviewResults.length > 0 ? Math.max(0, 100 - (reviewResults.length * 5)) : 100;
        doc.setDrawColor(200, 200, 200);
        doc.line(14, 45, 196, 45);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Summary", 14, 55);

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(`Overall Score: ${score}/100`, 14, 65);
        doc.text(`Total Issues: ${reviewResults.length}`, 14, 70);
        doc.text(`Bugs: ${reviewResults.filter(i => i.type === 'Bug').length}`, 60, 65);
        doc.text(`Security: ${reviewResults.filter(i => i.type === 'Security').length}`, 60, 70);
        doc.text(`Performance: ${reviewResults.filter(i => i.type === 'Performance').length}`, 110, 65);
        doc.text(`Code Smells: ${reviewResults.filter(i => i.type === 'Code Smell').length}`, 110, 70);

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Detailed Issues", 14, 85);

        const tableData = reviewResults.map(issue => [
            issue.type,
            `Line ${issue.line}`,
            issue.title,
            issue.description
        ]);

        autoTable(doc, {
            startY: 90,
            head: [['Type', 'Location', 'Title', 'Description']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [63, 81, 181] },
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 20 },
                2: { cellWidth: 40 },
                3: { cellWidth: 'auto' }
            }
        });

        doc.save(`review-report-${new Date().getTime()}.pdf`);
        toast.success("Report downloaded!");
    };

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

    const tabs = ["All Issues", "Bugs", "Security", "Performance", "Code Smells"];

    const filteredResults = reviewResults.filter(issue => {
        if (activeTab === "All Issues") return true;
        if (activeTab === "Bugs") return issue.type === "Bug";
        if (activeTab === "Security") return issue.type === "Security";
        if (activeTab === "Performance") return issue.type === "Performance";
        if (activeTab === "Code Smells") return issue.type === "Code Smell";
        return true;
    });

    const getCount = (tab: string) => {
        if (tab === "All Issues") return reviewResults.length;
        if (tab === "Bugs") return reviewResults.filter(i => i.type === "Bug").length;
        if (tab === "Security") return reviewResults.filter(i => i.type === "Security").length;
        if (tab === "Performance") return reviewResults.filter(i => i.type === "Performance").length;
        if (tab === "Code Smells") return reviewResults.filter(i => i.type === "Code Smell").length;
        return 0;
    };

    return (
        <div className="h-full flex">
            <div className="w-64 bg-[#0f1623] border-r border-gray-800 flex flex-col">
                <div className="h-14 flex items-center justify-between px-4 border-b border-gray-800">
                    <button
                        onClick={onBack}
                        className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <FaArrowLeft /> Back
                    </button>
                    {isHistory && (
                        <button
                            onClick={handleExportPDF}
                            className="text-blue-500 hover:text-blue-400 flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <FaFileCode /> Export PDF
                        </button>
                    )}
                </div>
                <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                        {currentRepo ? currentRepo.name : (historyRepoName || "Files")}
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

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6 flex gap-4">
                        {currentFileTree && (
                            <button
                                onClick={async () => {
                                    setIsReviewing(true);
                                    try {
                                        const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.go', '.rb', '.php', '.swift', '.kt'];
                                        const codeFiles = currentFileTree.filter((item: any) =>
                                            item.type === 'blob' && codeExtensions.some(ext => item.path.endsWith(ext))
                                        ).slice(0, 10);

                                        if (codeFiles.length === 0) {
                                            toast.error("No code files found in this repository");
                                            setIsReviewing(false);
                                            return;
                                        }

                                        toast.success(`Analyzing ${codeFiles.length} files...`);

                                        const filesWithContent = await Promise.all(
                                            codeFiles.map(async (file: any) => {
                                                try {
                                                    if (!currentRepo) return null;
                                                    const data = await authService.getGithubFileContent(currentRepo.owner.login, currentRepo.name, file.path);
                                                    if (data.success) {
                                                        return {
                                                            path: file.path,
                                                            content: data.data,
                                                            filename: file.path.split('/').pop() || file.path
                                                        };
                                                    }
                                                    return null;
                                                } catch (error) {
                                                    console.error(`Failed to fetch ${file.path}:`, error);
                                                    return null;
                                                }
                                            })
                                        );

                                        const validFiles = filesWithContent.filter(f => f !== null);

                                        if (validFiles.length === 0) {
                                            toast.error("Failed to fetch file contents");
                                            setIsReviewing(false);
                                            return;
                                        }

                                        const reviewData = await authService.reviewProject(validFiles);

                                        if (reviewData.success) {
                                            const allIssues: Issue[] = [];
                                            Object.entries(reviewData.data.fileResults).forEach(([path, issues]: [string, any]) => {
                                                issues.forEach((issue: Issue) => {
                                                    allIssues.push({ ...issue, filePath: path } as any);
                                                });
                                            });
                                            setReviewResults(allIssues);
                                            setSelectedFilePath(null);
                                            setSelectedFileContent(null);

                                            toast.success(`Project analysis complete! Found ${reviewData.data.summary.totalIssues} issues across ${validFiles.length} files.`);
                                        } else {
                                            toast.error("Failed to analyze project");
                                        }
                                    } catch (error) {
                                        console.error("Project analysis error:", error);
                                        toast.error("Failed to analyze project");
                                    } finally {
                                        setIsReviewing(false);
                                    }
                                }}
                                disabled={isReviewing}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg flex items-center gap-2"
                            >
                                {isReviewing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                        Analyzing Project...
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle /> Full Project Review
                                    </>
                                )}
                            </button>
                        )}
                        {!isHistory && (
                            <button
                                onClick={handleDone}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg flex items-center gap-2"
                            >
                                <FaCheck /> Done
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-400 text-sm font-medium">Score</span>
                                <FaCheckCircle className="text-green-500" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">
                                    {reviewResults.length > 0 ? Math.max(0, 100 - (reviewResults.length * 5)) : 100}
                                </span>
                                <span className="text-gray-500 text-sm">/100</span>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                                <div
                                    className="h-full bg-green-500 transition-all duration-500"
                                    style={{ width: `${reviewResults.length > 0 ? Math.max(0, 100 - (reviewResults.length * 5)) : 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-400 text-sm font-medium">Bugs</span>
                                <FaBug className="text-red-500" />
                            </div>
                            <span className="text-3xl font-bold text-white">{reviewResults.filter(i => i.type === 'Bug').length}</span>
                        </div>

                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-400 text-sm font-medium">Security</span>
                                <FaShieldAlt className="text-orange-500" />
                            </div>
                            <span className="text-3xl font-bold text-white">{reviewResults.filter(i => i.type === 'Security').length}</span>
                        </div>

                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-400 text-sm font-medium">Performance</span>
                                <FaTachometerAlt className="text-blue-500" />
                            </div>
                            <span className="text-3xl font-bold text-white">{reviewResults.filter(i => i.type === 'Performance').length}</span>
                        </div>

                        <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-gray-400 text-sm font-medium">Code Smells</span>
                                <FaFlask className="text-purple-500" />
                            </div>
                            <span className="text-3xl font-bold text-white">{reviewResults.filter(i => i.type === 'Code Smell').length}</span>
                        </div>
                    </div>

                    <div className="flex flex-col min-h-[600px]">
                        <div className="flex items-center gap-6 border-b border-gray-800 mb-6 overflow-x-auto">
                            {tabs.map((tab) => {
                                const count = getCount(tab);
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors relative ${isActive ? "text-blue-500" : "text-gray-400 hover:text-white"
                                            }`}
                                    >
                                        {tab}
                                        {count > 0 && (
                                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-blue-500/20 text-blue-400" : "bg-gray-700 text-gray-400"
                                                }`}>
                                                {count}
                                            </span>
                                        )}
                                        {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#1f2937]/30">
                                    <span className="text-xs text-gray-400 font-mono">
                                        {selectedFilePath || "Select a file"}
                                    </span>
                                    {isLoadingFile && <span className="text-xs text-blue-400">Loading file...</span>}
                                    {isReviewing && <span className="text-xs text-purple-400 ml-2">Analyzing with Gemini...</span>}
                                </div>
                                <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                                    {codeLines.map((line, idx) => {
                                        const lineNumber = idx + 1;
                                        const issue = reviewResults.find(i => i.line === lineNumber);
                                        let bgClass = "hover:bg-[#1f2937]/50";

                                        if (issue) {
                                            if (issue.type === 'Bug') bgClass = "bg-red-500/10 hover:bg-red-500/20";
                                            else if (issue.type === 'Security') bgClass = "bg-orange-500/10 hover:bg-orange-500/20";
                                            else if (issue.type === 'Performance') bgClass = "bg-blue-500/10 hover:bg-blue-500/20";
                                            else if (issue.type === 'Code Smell') {
                                                if (issue.title.startsWith('Unused')) {
                                                    bgClass = "bg-gray-500/10 hover:bg-gray-500/20 opacity-75";
                                                } else {
                                                    bgClass = "bg-purple-500/10 hover:bg-purple-500/20";
                                                }
                                            }
                                        }

                                        return (
                                            <div key={idx} className={`flex ${bgClass} transition-colors group`}>
                                                <span className="w-8 text-gray-600 text-right mr-4 select-none flex-shrink-0 pt-[2px]">{lineNumber}</span>
                                                <div className="flex-1 min-w-0">
                                                    <SyntaxHighlighter
                                                        language="javascript"
                                                        style={atomDark}
                                                        customStyle={{
                                                            background: 'transparent',
                                                            padding: 0,
                                                            margin: 0,
                                                            opacity: issue?.title.startsWith('Unused') ? 0.6 : 1,
                                                            textDecoration: issue?.title.startsWith('Unused') ? 'line-through' : 'none'
                                                        }}
                                                        wrapLines={true}
                                                        wrapLongLines={true}
                                                        PreTag="div"
                                                        CodeTag="span"
                                                    >
                                                        {line || ' '}
                                                    </SyntaxHighlighter>

                                                    {issue && issue.suggestion && (
                                                        <div className="mt-1 mb-1 text-xs bg-[#111827]/80 p-2 rounded border border-green-500/30 text-green-400 backdrop-blur-sm">
                                                            <span className="font-bold text-green-500">Suggestion:</span> {issue.suggestion}
                                                        </div>
                                                    )}
                                                    {issue && !issue.suggestion && (
                                                        <div className="mt-1 mb-1 text-xs bg-[#111827]/80 p-2 rounded border border-yellow-500/30 text-yellow-400 backdrop-blur-sm">
                                                            <span className="font-bold text-yellow-500">Warning:</span> {issue.title}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-gray-800">
                                    <h2 className="font-semibold text-white">Issues Found</h2>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {isReviewing ? (
                                        <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                                            <p className="text-sm">AI is reviewing your code...</p>
                                        </div>
                                    ) : filteredResults.length > 0 ? (
                                        filteredResults.map((issue, idx) => (
                                            <div key={idx} className="bg-[#1f2937]/50 border border-gray-700 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${issue.type === 'Bug' ? 'bg-red-500/20 text-red-400' :
                                                        issue.type === 'Security' ? 'bg-orange-500/20 text-orange-400' :
                                                            issue.type === 'Performance' ? 'bg-blue-500/20 text-blue-400' :
                                                                'bg-purple-500/20 text-purple-400'
                                                        }`}>{issue.type}</span>
                                                    <span className="text-gray-500 text-xs">Line {issue.line}</span>
                                                </div>
                                                {(issue as any).filePath && !selectedFilePath && (
                                                    <div className="text-xs text-blue-400 mb-2 font-mono truncate flex items-center gap-1">
                                                        <FaFileCode className="flex-shrink-0" />
                                                        {(issue as any).filePath}
                                                    </div>
                                                )}
                                                <h3 className="text-gray-200 font-medium text-sm mb-1">{issue.title}</h3>
                                                <p className="text-gray-400 text-xs mb-3">{issue.description}</p>
                                                {issue.suggestion && (
                                                    <div className="text-blue-400 text-xs bg-blue-500/10 p-2 rounded border border-blue-500/20">
                                                        <span className="font-semibold">Suggestion:</span> {issue.suggestion}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500 mt-10">
                                            <p>{reviewResults.length > 0 ? "No issues found in this category." : "No issues found or select a file to review."}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
