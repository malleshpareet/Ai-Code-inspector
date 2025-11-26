import { MdSecurity, MdSpeed, MdBugReport, MdCode } from "react-icons/md";

export default function Features() {
    const features = [
        {
            icon: <MdBugReport className="text-3xl text-blue-400" />,
            title: "Automated Bug Detection",
            description: "Catch subtle errors and logical flaws before they impact your users."
        },
        {
            icon: <MdSecurity className="text-3xl text-blue-400" />,
            title: "Security Vulnerability Analysis",
            description: "Scan for common exploits and security risks like the OWASP Top 10."
        },
        {
            icon: <MdSpeed className="text-3xl text-blue-400" />,
            title: "Performance Optimization",
            description: "Identify inefficient code and get actionable suggestions for improvement."
        },
        {
            icon: <MdCode className="text-3xl text-blue-400" />,
            title: "Code Style & Consistency",
            description: "Enforce team standards automatically and maintain a clear codebase."
        }
    ];

    return (
        <section id="features" className="py-24 px-6 bg-[#0b1120]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Find What Matters, Instantly
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Our AI-powered analysis goes beyond simple linting to find complex bugs, security flaws, and performance bottlenecks before they ever reach production.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-[#111827] border border-gray-800 p-8 rounded-2xl hover:border-blue-500/30 transition duration-300 group"
                        >
                            <div className="w-14 h-14 rounded-xl bg-blue-900/20 flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-3">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
