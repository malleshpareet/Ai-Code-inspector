interface LeftSectionProps {
  image?: string;
}

export default function LeftSection({
  image = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}: LeftSectionProps) {
  return (
    <div className="flex flex-col justify-center h-full">
      <div className="flex items-center gap-3 mb-2">
        <img
          src="/src/assets/ChatGPT Image Nov 23, 2025, 02_40_14 PM (1).png"
          alt="AI Code Inspector Logo"
          className="w-16 h-16 object-contain"
        />
        <h1 className="text-white text-2xl font-bold tracking-tight">
          AI Code Inspector
        </h1>
      </div>

      <p className="text-gray-400 text-lg mb-10">
        Smarter Code. Faster Reviews.
      </p>

      <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
        {/* Placeholder for the swirl image. Using a gradient for now. */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-900">
          {/* Simulating the swirl with a radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50"></div>
        </div>
        <img
          src={image}
          alt="Abstract Visual"
          className="w-full h-full object-cover opacity-80 hover:scale-105 transition duration-700"
        />
      </div>
    </div>
  );
}
