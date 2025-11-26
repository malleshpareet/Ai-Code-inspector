import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaRobot, FaUser, FaCode, FaLightbulb, FaBug, FaPlus, FaTrash, FaHistory } from "react-icons/fa";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface ChatSession {
    id: string;
    title: string;
    timestamp: Date;
    preview: string;
}

export default function AIAssistantPage() {
    const [selectedModel, setSelectedModel] = useState<'gemini' | 'grok'>('gemini');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your AI Code Assistant powered by Google Gemini. I can help you with code reviews, debugging, optimization suggestions, and answering programming questions. How can I assist you today?",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([
        {
            id: "1",
            title: "Code Review Help",
            timestamp: new Date(Date.now() - 86400000),
            preview: "How to optimize my React component..."
        },
        {
            id: "2",
            title: "Bug Fixing",
            timestamp: new Date(Date.now() - 172800000),
            preview: "TypeError in async function..."
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");
        setIsTyping(true);

        try {
            // Prepare conversation history for context
            const conversationHistory = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Call real Gemini or Grok API
            const response = await authService.chat(inputMessage, conversationHistory, selectedModel);

            if (response.success) {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: response.data.message,
                    timestamp: new Date(response.data.timestamp)
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                toast.error(response.message || "Failed to get AI response");
            }
        } catch (error) {
            console.error("Chat error:", error);
            toast.error("Failed to communicate with AI assistant");
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleNewChat = () => {
        setMessages([
            {
                id: "1",
                role: "assistant",
                content: "Hello! I'm your AI Code Assistant powered by Google Gemini. How can I help you today?",
                timestamp: new Date()
            }
        ]);
    };

    const handleDeleteSession = (sessionId: string) => {
        setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    };

    const quickPrompts = [
        { icon: <FaCode />, text: "Review my code", color: "blue" },
        { icon: <FaBug />, text: "Find bugs", color: "red" },
        { icon: <FaLightbulb />, text: "Optimize performance", color: "yellow" },
    ];

    return (
        <div className="h-full flex bg-[#0b1120] overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header - Fixed */}
                <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-gray-800 px-6 py-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <FaRobot className="text-white text-lg" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">AI Code Assistant</h1>
                                <p className="text-sm text-gray-400">Powered by Advanced AI</p>
                            </div>
                        </div>

                        {/* Model Selector */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-400">Model:</label>
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value as 'gemini' | 'grok')}
                                className="bg-[#1e293b] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition text-sm"
                            >
                                <option value="gemini">Google Gemini</option>
                                <option value="grok">Grok (xAI)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Messages Container - Scrollable Only */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                            >
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === "assistant"
                                    ? "bg-gradient-to-br from-blue-500 to-purple-600"
                                    : "bg-gradient-to-br from-orange-400 to-pink-500"
                                    }`}>
                                    {message.role === "assistant" ? (
                                        <FaRobot className="text-white text-sm" />
                                    ) : (
                                        <FaUser className="text-white text-sm" />
                                    )}
                                </div>

                                {/* Message Bubble */}
                                <div className={`flex-1 max-w-3xl ${message.role === "user" ? "flex justify-end" : ""}`}>
                                    <div className={`rounded-2xl px-5 py-3 ${message.role === "assistant"
                                        ? "bg-[#1e293b] text-gray-100"
                                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                        }`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                        <span className="text-xs opacity-60 mt-2 block">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <FaRobot className="text-white text-sm" />
                                </div>
                                <div className="bg-[#1e293b] rounded-2xl px-5 py-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Quick Prompts - Fixed above input */}
                {messages.length === 1 && (
                    <div className="px-6 pb-4 flex-shrink-0">
                        <div className="max-w-4xl mx-auto">
                            <p className="text-sm text-gray-400 mb-3">Quick actions:</p>
                            <div className="flex gap-3 flex-wrap">
                                {quickPrompts.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInputMessage(prompt.text)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#2d3b52] text-gray-300 text-sm transition border border-gray-700 hover:border-${prompt.color}-500/50`}
                                    >
                                        <span className={`text-${prompt.color}-400`}>{prompt.icon}</span>
                                        {prompt.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Input Area - Fixed at bottom */}
                <div className="border-t border-gray-800 bg-[#0f1623] px-6 py-4 flex-shrink-0">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex gap-3 items-end">
                            <div className="flex-1 bg-[#1e293b] rounded-2xl border border-gray-700 focus-within:border-blue-500 transition">
                                <textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything about your code..."
                                    className="w-full bg-transparent text-gray-100 placeholder-gray-500 px-5 py-3 resize-none focus:outline-none max-h-32"
                                    rows={1}
                                    style={{
                                        minHeight: "44px",
                                        height: "auto"
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isTyping}
                                className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white flex items-center justify-center transition shadow-lg disabled:cursor-not-allowed flex-shrink-0"
                            >
                                <FaPaperPlane className="text-sm" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Press Enter to send, Shift+Enter for new line
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat History Sidebar - Right */}
            <div className="w-72 bg-[#0f1623] border-l border-gray-800 flex flex-col flex-shrink-0">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FaHistory className="text-blue-400" />
                            <h2 className="font-semibold text-white">Chat History</h2>
                        </div>
                    </div>
                    <button
                        onClick={handleNewChat}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-lg flex items-center justify-center gap-2"
                    >
                        <FaPlus className="text-sm" /> New Chat
                    </button>
                </div>

                {/* Chat Sessions List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {chatSessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-[#1e293b] hover:bg-[#2d3b52] rounded-lg p-3 cursor-pointer transition group"
                        >
                            <div className="flex items-start justify-between mb-1">
                                <h3 className="text-sm font-medium text-white truncate flex-1">{session.title}</h3>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSession(session.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition ml-2"
                                >
                                    <FaTrash className="text-xs" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 truncate mb-1">{session.preview}</p>
                            <span className="text-xs text-gray-500">
                                {session.timestamp.toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
