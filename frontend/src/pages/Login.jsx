import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, Mail, Loader2, AlertCircle, Camera, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");

  // Auto-forward if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorStatus("");

    if (!email.trim() || !password.trim()) {
      setErrorStatus("Please fulfill both email and password fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", {
        email: email.trim(),
        password: password.trim()
      });

      // Save token and email in Auth Context and LocalStorage
      login(res.data.token, res.data.email);

      // Transition to dashboard in clean flow
      navigate("/dashboard");
    } catch (err) {
      setErrorStatus(err.response?.data?.msg || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F0F] text-[#F5F5F5]" id="login_page_root">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 sm:p-8 relative overflow-hidden"
        >
          {/* Subtle branding decorative tag */}
          <div className="flex flex-col items-center justify-center mb-8 text-center pb-4 border-b border-[#2A2A2A]">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-serif italic text-base font-bold mb-3">
              Φ
            </div>
            <h2 className="text-xl font-serif italic text-white tracking-wide">Studio CRM Login</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#666] mt-1">Please authorize to manage inquiries and portfolios.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5" id="login_form">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">Manager Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans"
                  placeholder="e.g. admin@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">Secure Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Error notifications */}
            {errorStatus && (
              <div className="flex items-start space-x-2 p-3 bg-[#1A1111] border border-red-900/30 rounded-sm text-xs text-red-500 font-sans">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                <span>{errorStatus}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center p-3.5 rounded-sm bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#c49f2a] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Authorizing Node Session...</span>
                </>
              ) : (
                <>
                  <span>Enter Manager Console</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick instructions indicator to save clicks */}
          {/* <div className="mt-6 border-t border-[#2A2A2A] pt-4 text-center">
            <span className="text-[11px] text-gray-500 font-mono tracking-wide">
              Demo access: <em className="text-[#D4AF37] hover:underline font-semibold not-italic">admin@test.com</em> / <em className="text-[#D4AF37] hover:underline font-semibold not-italic">admin123</em>
            </span>
          </div> */}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
