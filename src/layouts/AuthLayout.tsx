import LeftSection from "../components/ui/LeftSection";

interface AuthLayoutProps {
    children: React.ReactNode;
    image?: string;
}

export default function AuthLayout({ children, image }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-[#0b1120] flex items-center justify-center px-6">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <LeftSection image={image} />
                {children}
            </div>
        </div>
    );
}
