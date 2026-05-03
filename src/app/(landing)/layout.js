import Navbar from "@/components/landing_page/Navbar";
import Footer from "@/components/landing_page/Footer";

export default function LandingLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
