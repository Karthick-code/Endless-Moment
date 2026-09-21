import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Camera, Menu, X, LogOut, Sliders } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // You can set this to your logo URL, or import a local image path.
  // By default, it looks for logo.png in your public or build root folder.
  const logoSrc = "/logo.png";

  const navLinks = [
    { name: "Portfolio", path: "/" },
    { name: "All Works", path: "/projects" },
    { name: "Book Session", path: "/contact" }
  ];

  const activeClass = "text-[#D4AF37] font-medium tracking-wide";
  const inactiveClass = "text-gray-400 hover:text-[#D4AF37] transition-all duration-200 tracking-wide";

  return (
    <nav className="sticky top-0 z-50 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#2A2A2A]" id="navbar_container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Brand with Segmented Pill Design */}
          <Link to="/" className="flex items-center focus:outline-none group select-none" id="brand_logo_link">
            <div className="flex items-center space-x-1.5 sm:space-x-2" id="segmented_brand_badge">
              {/* ENDLESS Moments Pill */}
              <div className="px-2.5 py-1 bg-[#141414]/80 border border-[#2A2A2A] rounded-lg flex flex-col justify-center items-center text-center shadow-md transition-all duration-300 group-hover:border-[#D4AF37]/30 group-hover:bg-[#D4AF37]/5">
                <span className="font-serif italic text-xs sm:text-sm font-medium text-[#F5F5F5] tracking-wide leading-tight">ENDLESS</span>
                <span className="text-[#D4AF37] text-[7px] sm:text-[8px] font-bold uppercase tracking-widest font-mono leading-none mt-0.5">Moments</span>
              </div>
              
              {/* Amperstand Separator */}
              {/* <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-md flex items-center justify-center text-[#D4AF37] font-serif italic text-xs sm:text-sm font-black shadow-inner transition-all duration-300 group-hover:bg-[#D4AF37]/20">
                &
              </div> */}

              {/* ENDLESS Moments Pill */}
              {/* <div className="px-2.5 py-1 bg-[#141414]/80 border border-[#2A2A2A] rounded-lg flex flex-col justify-center items-center text-center shadow-md transition-all duration-300 group-hover:border-[#D4AF37]/30 group-hover:bg-[#D4AF37]/5">
                <span className="font-serif italic text-xs sm:text-sm font-medium text-[#F5F5F5] tracking-wide leading-tight">ENDLESS Moments</span>
                <span className="text-[#D4AF37] text-[7px] sm:text-[8px] font-bold uppercase tracking-widest font-mono leading-none mt-0.5">Photography</span>
              </div> */}
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8" id="desktop_nav_links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={location.pathname === link.path ? activeClass : inactiveClass}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4 border-l border-[#2A2A2A] pl-6 ml-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 text-[#D4AF37] hover:text-[#e4be4a] text-xs uppercase font-mono tracking-wider font-semibold transition-colors"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>CRM Console</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-400 text-xs uppercase font-mono tracking-wider font-semibold transition-colors cursor-pointer"
                  title="Logout Session"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Exit</span>
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-[#D4AF37] focus:outline-none"
              id="mobile_menu_trigger"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F0F0F] border-b border-[#2A2A2A] px-4 pt-2 pb-6 space-y-3" id="mobile_nav_dropdown">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block py-2 text-base ${location.pathname === link.path ? "text-[#D4AF37] font-semibold" : "text-gray-400"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated && (
            <div className="border-t border-[#2A2A2A] pt-4 mt-2 space-y-3">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 py-2 text-[#D4AF37] font-mono text-xs uppercase tracking-widest font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sliders className="h-4 w-4" />
                <span>CRM Control Panel</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 py-2 text-red-400 text-left cursor-pointer font-mono text-xs uppercase tracking-widest font-bold"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
