import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
// import { Camera, Calendar, Play, Heart, Award, ArrowRight, Loader2 } from "lucide-react";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import { services } from "../config/services";
import API from "../services/api";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/projects")
      .then((res) => {
        // Just take the first 3 for the home page showcase
        setFeaturedProjects(res.data.slice(0, 3));
      })
      .catch((err) => console.error("Error loading home projects:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F0F] text-[#F5F5F5]" id="home_page_root">
      <Navbar />

      {/* Hero Section */}
      <header className="relative py-24 sm:py-32 overflow-hidden border-b border-[#2A2A2A] bg-linear-to-b from-[#141414] to-[#0F0F0F]" id="hero_header">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600"
            alt="Intimate Wedding Photography Capture"
            className="w-full h-full object-cover filter grayscale scale-102"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-[#141414]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-[10px] font-mono font-medium tracking-widest uppercase mb-6"
          >
            <Award className="h-3.0 w-3.0" />
            <span>Award-Winning Boutique Photography Studio</span>
          </motion.div> */}

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-[#F5F5F5] leading-tight"
          >
            ENDLESS Moments. <br />
            <span className="font-serif italic font-normal text-[#D4AF37]">Capture your moments</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans"
          >
            Professional photography and cinematic storytelling for the moments you want to keep forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/contact"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 rounded-sm bg-[#D4AF37] text-black font-semibold text-sm uppercase tracking-wider hover:bg-[#c49f2a] hover:scale-[1.01] transition-all duration-200 cursor-pointer"
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>Book Consultation</span>
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 rounded-sm bg-[#141414] border border-[#2A2A2A] text-gray-300 font-semibold text-sm uppercase tracking-wider hover:bg-[#1A1A1A] transition-colors cursor-pointer"
            >
              <span>Explore Portfolio</span>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Services Grid Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#2A2A2A]" id="services_section">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">Core Expertise</h2>
          <p className="text-2xl sm:text-4xl font-serif italic font-light text-white mt-1.5 tracking-tight">Structured Shoot Modules</p>
          <div className="h-[1px] w-12 bg-[#D4AF37]/80 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 bg-[#141414] border border-[#2A2A2A] rounded-sm hover:border-[#D4AF37]/50 transition-colors duration-300"
            >
              <div className="p-2.5 bg-[#D4AF37]/5 rounded-sm border border-[#D4AF37]/20 inline-block mb-4">
                <service.icon className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <h3 className="text-base font-serif italic text-gray-100 tracking-wide mb-2">{service.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Portfolio Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" id="portfolio_section">
        <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between mb-12">
          <div>
            <h2 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">Curated Work</h2>
            <p className="text-2xl sm:text-4xl font-serif italic font-light text-white mt-1.5 tracking-tight">Featured Showcases</p>
          </div>
          <Link
            to="/projects"
            className="flex items-center text-xs uppercase font-mono tracking-wider font-bold text-[#D4AF37] hover:text-[#e4be4a] mt-2 sm:mt-0 transition-all cursor-pointer group"
          >
            <span>View all collections</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 bg-[#141414] border border-[#2A2A2A] rounded-sm">
            <Loader2 className="h-6 w-6 text-[#D4AF37] animate-spin mr-3" />
            <span className="text-xs text-gray-400 font-mono">Retrieving visual catalog from database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative flex flex-col bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden"
              >
                <div className="aspect-video w-full overflow-hidden bg-black relative h-64 border-b border-[#2A2A2A]">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 filter saturate-75 group-hover:saturate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-base font-serif italic text-white tracking-wide mb-2 group-hover:text-[#D4AF37] transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Consult Banner */}
      <section className="bg-linear-to-r from-[#D4AF37]/5 to-[#D4AF37]/10 py-16 border-t border-b border-[#2A2A2A] w-full" id="consultation_banner">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-serif italic font-light text-white tracking-tight">Need a customized, professional photoshoot package?</h2>
          <p className="text-xs text-gray-400 mt-2 max-w-lg mx-auto">
            Submit your event timeline and requirements. We offer complimentary consultations and budget estimations.
          </p>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 rounded-sm bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#c49f2a] hover:scale-[1.01] transition-all cursor-pointer"
            >
              <span>Build A Request</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
