import { FaTwitter, FaGithub, FaLinkedin, FaDiscord } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#0b1120] border-t border-gray-800 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-blue-400 transition">Features</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Pricing</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Integrations</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Docs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-blue-400 transition">Case Studies</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">API Reference</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Security</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">System Status</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-blue-400 transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        © 2024 AI Code Inspector. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-gray-400">
                        <a href="#" className="hover:text-white transition"><FaTwitter /></a>
                        <a href="#" className="hover:text-white transition"><FaGithub /></a>
                        <a href="#" className="hover:text-white transition"><FaLinkedin /></a>
                        <a href="#" className="hover:text-white transition"><FaDiscord /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
