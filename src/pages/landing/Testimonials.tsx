export default function Testimonials() {
    const testimonials = [
        {
            quote: "This tool has been a game-changer for our team. We're catching bugs we never would have seen and our review process is 3x faster.",
            name: "Sarah Johnson",
            role: "Lead Developer, TechCorp",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            quote: "AI Code Inspector identified a critical security vulnerability in our codebase that could have cost us millions. It paid for itself in the first week.",
            name: "Michael Chen",
            role: "CTO, FinSec",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            quote: "As a freelancer, maintaining code quality is everything. This tool is my secret weapon for delivering pristine code every time.",
            name: "Emily Rodriguez",
            role: "Freelance Full-Stack Developer",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ];

    return (
        <section className="py-24 px-6 bg-[#0b1120]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Loved by Developers Worldwide
                    </h2>
                    <p className="text-gray-400">
                        Don't just take our word for it. Here's what our users are saying about AI Code Inspector.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-[#111827] border border-gray-800 p-8 rounded-2xl flex flex-col"
                        >
                            <p className="text-gray-300 italic mb-6 flex-1">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                                />
                                <div>
                                    <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                                    <div className="text-gray-500 text-xs">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
