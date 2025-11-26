import { SiNetflix, SiUber, SiSpotify, SiSlack, SiAirbnb } from "react-icons/si";

export default function TrustedBy() {
    return (
        <section className="py-10 bg-[#0b1120] border-y border-gray-800/50">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-gray-500 text-sm font-medium mb-8 uppercase tracking-wider">
                    Trusted by the world's most innovative companies
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <SiNetflix className="text-3xl md:text-4xl text-red-600 hover:opacity-100 transition" />
                    <SiUber className="text-3xl md:text-4xl text-white hover:opacity-100 transition" />
                    <SiSpotify className="text-3xl md:text-4xl text-green-500 hover:opacity-100 transition" />
                    <SiSlack className="text-3xl md:text-4xl text-purple-500 hover:opacity-100 transition" />
                    <SiAirbnb className="text-3xl md:text-4xl text-pink-500 hover:opacity-100 transition" />
                </div>
            </div>
        </section>
    );
}
