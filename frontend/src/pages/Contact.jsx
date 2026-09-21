// import React, { useState } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import {
//   Mail,
//   Phone,
//   Facebook,
//   Instagram,
//   Calendar,
//   Clock,
//   CheckCircle2,
//   AlertCircle,
//   Loader2,
//   Terminal,
//   ShieldAlert,
//   Cpu,
//   Check,
//   Wifi,
//   Globe,
// } from "lucide-react";
// import API from "../services/api";
import { services } from "../config/services";
// import { Navbar } from "../components/Navbar";
// import { Footer } from "../components/Footer";

// export const Contact = () => {
//   // Form states
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [message, setMessage] = useState("");
//   const [service, setService] = useState("");
//   const [projectType, setProjectType] = useState("");

//   const [isLoading, setIsLoading] = useState(false);
//   const [formError, setFormError] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   // Advanced Visual Courier state tracking for more interesting feedback
//   const [dispatchLogs, setDispatchLogs] = useState([]);
//   const [mailResponse, setMailResponse] = useState(null);

//   const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormError("");

//     // Front-end validations
//     if (!name.trim()) {
//       setFormError("Name field is required so we know who to address.");
//       return;
//     }
//     if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setFormError("Please enter a valid email address.");
//       return;
//     }
//     if (!phone.trim()) {
//       setFormError(
//         "Phone number is required so our booking manager can text back.",
//       );
//       return;
//     }
//     if (!message.trim()) {
//       setFormError(
//         "Please leave a short message about your photoshoot timeline or theme request.",
//       );
//       return;
//     }

//     setIsLoading(true);
//     setDispatchLogs([]);
//     setMailResponse(null);

//     try {
//       // Step 1: Initialize local buffer
//       setDispatchLogs([
//         {
//           id: 1,
//           text: "Analyzing inputs & assembling data package structure...",
//           status: "pending",
//         },
//       ]);
//       await wait(550);

//       // Step 2: Establish Cryptographic check
//       setDispatchLogs((prev) => [
//         {
//           id: 1,
//           text: "Analyzing inputs & assembling data package structure...",
//           status: "success",
//         },
//         {
//           id: 2,
//           text: "Verifying secure courier routing to corporate mailbox...",
//           status: "pending",
//         },
//       ]);
//       await wait(600);

//       // Step 3: Trigger physical connection
//       setDispatchLogs((prev) => [
//         ...prev.slice(0, 1),
//         {
//           id: 2,
//           text: "Verifying secure courier routing to corporate mailbox...",
//           status: "success",
//         },
//         {
//           id: 3,
//           text: "POST core lead package to secure relational database store...",
//           status: "pending",
//         },
//       ]);

//       const res = await API.post("/leads", {
//         name: name.trim(),
//         email: email.trim(),
//         phone: phone.trim(),
//         service: service.trim(),
//         projectType: projectType.trim(),
//         message: message.trim(),
//       });

//       const mailResult = res.data?.mailStatus || {
//         mode: "failed",
//         recipient: "director",
//       };
//       setMailResponse(mailResult);

//       setDispatchLogs((prev) => [
//         ...prev.slice(0, 2),
//         {
//           id: 3,
//           text: "POST core lead package to secure relational database store...",
//           status: "success",
//         },
//         {
//           id: 4,
//           text: `Routing copy dynamically to owners mail [${mailResult.recipient || "owner@auraphotostudio.com"}]...`,
//           status: "pending",
//         },
//       ]);
//       await wait(750);

//       if (mailResult.mode === "live") {
//         setDispatchLogs((prev) => [
//           ...prev.slice(0, 3),
//           {
//             id: 4,
//             text: `Routing copy dynamically to owners mail [${mailResult.recipient}]...`,
//             status: "success",
//           },
//           {
//             id: 5,
//             text: `📨 Live EmailJS email successfully delivered! Session vision received safely.`,
//             status: "success",
//           },
//         ]);
//       } else if (mailResult.mode === "simulated") {
//         setDispatchLogs((prev) => [
//           ...prev.slice(0, 3),
//           {
//             id: 4,
//             text: `Routing copy dynamically to owners mail [${mailResult.recipient}]...`,
//             status: "success",
//           },
//           {
//             id: 5,
//             text: `📨 EmailJS dispatch triggered.`,
//             status: "warn",
//           },
//         ]);
//       } else {
//         setDispatchLogs((prev) => [
//           ...prev.slice(0, 3),
//           {
//             id: 4,
//             text: `Routing copy dynamically to owners mail [${mailResult.recipient || "owner"}]...`,
//             status: "success",
//           },
//           {
//             id: 5,
//             text: `⚠️ Mailer logged with warnings. EmailJS delivery should be verified.`,
//             status: "warn",
//           },
//         ]);
//       }

//       await wait(1200);
//       setIsSubmitted(true);
//       setName("");
//       setEmail("");
//       setPhone("");
//       setMessage("");
//       setService("");
//       setProjectType("");
//     } catch (err) {
//       console.error(err);
//       setDispatchLogs((prev) => [
//         ...prev.map((item) =>
//           item.status === "pending" ? { ...item, status: "failed" } : item,
//         ),
//         {
//           id: 99,
//           text: `Transmission aborted: ${err.response?.data?.msg || "Database node or protocol failure."}`,
//           status: "failed",
//         },
//       ]);
//       setFormError(
//         err.response?.data?.msg ||
//           "Failed to deliver inquiry. Please verify inputs or try again.",
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex flex-col bg-[#0F0F0F] text-[#F5F5F5]"
//       id="contact_page_root"
//     >
//       <Navbar />

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-grow">
//         <div className="text-center max-w-2xl mx-auto mb-16">
//           <h1 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
//             Inquire Session
//           </h1>
//           <p className="text-3xl sm:text-4xl font-serif italic font-light text-white mt-1.5 tracking-tight">
//             Secure Your Capture Date
//           </p>
//           <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">
//             Let us know your event specifics. Our representative answers within
//             4 hours with customizable quotes.
//           </p>
//         </div>

//         <div
//           className="grid grid-cols-1 lg:grid-cols-12 gap-12"
//           id="contact_layout_grid"
//         >
//           {/* Left Column: Direct Info */}
//           <div className="lg:col-span-5 space-y-8">
//             <div className="p-6 sm:p-8 bg-[#141414] border border-[#2A2A2A] rounded-sm">
//               <h3 className="text-base font-serif italic text-white mb-6 tracking-wide">
//                 Digital & Social Channels
//               </h3>

//               <div className="space-y-6">
//                 <div className="flex items-start space-x-4">
//                   <div className="p-2.5 bg-[#D4AF37]/5 rounded-sm border border-[#D4AF37]/10 shrink-0">
//                     <Instagram className="h-4 w-4 text-[#D4AF37]" />
//                   </div>
//                   <div>
//                     <h4 className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest mb-0.5">
//                       Instagram Profiles
//                     </h4>
//                     <p className="text-xs text-gray-400 leading-relaxed font-sans">
//                       <a
//                         href=""
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="hover:text-[#D4AF37] transition-colors"
//                       >
//                         @ENDLESS Moments ENDLESS Moments
//                       </a>
//                       <br />
//                       {/* {" "}
//                       &{" "} */}
//                       <a
//                         href="https://www.instagram.com/yugans.visuals?igsh=YTdhYW1waXptZ2V3"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="hover:text-[#D4AF37] transition-colors"
//                       >
//                         @ENDLESS Moments
//                       </a>{" "}
//                       <br />
//                       <span className="text-[10px] text-gray-600 font-mono">
//                         DM us anytime for active updates & stories
//                       </span>
//                     </p>
//                   </div>
//                 </div>

//                 {/* <div className="flex items-start space-x-4">
//                   <div className="p-2.5 bg-[#D4AF37]/5 rounded-sm border border-[#D4AF37]/10 shrink-0">
//                     <Facebook className="h-4 w-4 text-[#D4AF37]" />
//                   </div>
//                   <div>
//                     <h4 className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest mb-0.5">
//                       Facebook Pages
//                     </h4>
//                     <p className="text-xs text-gray-400 leading-relaxed font-sans">
//                       <a
//                         href=""
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="hover:text-[#D4AF37] transition-colors"
//                       >
//                         ENDLESS Moments
//                       </a>{" "}
//                       <br />
//                       <a
//                         href="https://facebook.com/yugas_photography"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="hover:text-[#D4AF37] transition-colors"
//                       >
//                         ENDLESS Moments
//                       </a>{" "}
//                       <br />
//                       <span className="text-[10px] text-gray-600 font-mono">
//                         Stay tuned on Facebook messenger
//                       </span>
//                     </p>
//                   </div>
//                 </div> */}

//                 <div className="flex items-start space-x-4">
//                   <div className="p-2.5 bg-[#D4AF37]/5 rounded-sm border border-[#D4AF37]/10 shrink-0">
//                     <Phone className="h-4 w-4 text-[#D4AF37]" />
//                   </div>
//                   {/* <div>
//                     <h4 className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest mb-0.5">
//                       Operator Line
//                     </h4>
//                     <p className="text-xs text-gray-400 leading-relaxed">
//                       +91 99988 88899 <br />
//                       +91 98765 01234 <br />
//                       <span className="text-[10px] text-gray-600 font-mono">
//                         WhatsApp support active 24/7
//                       </span>
//                     </p>
//                   </div> */}
//                   <div>
//                     <h4 className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest mb-0.5">
//                       Operator Line
//                     </h4>

//                     <div className="text-xs text-gray-400 leading-relaxed">
//                       <div>+91 99988 88899</div>
//                       <div>+91 98765 01234</div>

//                       <span className="text-[10px] text-gray-600 font-mono">
//                         WhatsApp support active 24/7
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-start space-x-4">
//                   <div className="p-2.5 bg-[#D4AF37]/5 rounded-sm border border-[#D4AF37]/10 shrink-0">
//                     <Mail className="h-4 w-4 text-[#D4AF37]" />
//                   </div>
//                   <div>
//                     <h4 className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest mb-0.5">
//                       Corporate Email
//                     </h4>
//                     <p className="text-xs text-gray-400 leading-relaxed">
//                        <br />
//                     </p>
//                     <p className="text-xs text-gray-400 leading-relaxed">
//                       yugasphotography26@gmail.com <br />
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 bg-[#141414] border border-[#2A2A2A] rounded-sm flex items-start space-x-4">
//               <Clock className="h-4 w-4 text-[#D4AF37]/80 shrink-0 mt-0.5" />
//               <div>
//                 <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
//                   Fully Digital & Mobile
//                 </h4>
//                 <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
//                   We operate as a digital-first studio! Our professional team
//                   travels on-location for your selected venues, weddings, and
//                   events. Online text and e-mail consultations are active Monday
//                   through Saturday, 9:00 AM – 6:00 PM PST.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Lead Capture Form */}
//           <div className="lg:col-span-7 bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 sm:p-8 relative overflow-hidden">
//             <AnimatePresence mode="wait">
//               {isLoading ? (
//                 <motion.div
//                   key="emailjs-courier-terminal"
//                   initial={{ opacity: 0, scale: 0.98 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="p-6 bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-sm font-mono space-y-6 shadow-2xl"
//                 >
//                   <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
//                     <div className="flex items-center space-x-2">
//                       <div className="flex space-x-1.5">
//                         <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block"></span>
//                         <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 inline-block"></span>
//                         <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 inline-block"></span>
//                       </div>
//                       <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold font-mono">
//                         Courier Telemetry CLI
//                       </span>
//                     </div>
//                     <div className="flex items-center space-x-1.5 text-[9px] text-[#D4AF37] font-mono">
//                       <Terminal className="h-3 w-3 animate-pulse text-[#D4AF37]" />
//                       <span className="animate-pulse">SOCKET BROADCAST</span>
//                     </div>
//                   </div>

//                   {/* Terminal Log Output List */}
//                   <div className="space-y-4 text-[11px] leading-relaxed select-none min-h-[140px]">
//                     {dispatchLogs.map((log, idx) => (
//                       <motion.div
//                         key={log.id || idx}
//                         initial={{ opacity: 0, x: -4 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         className="flex items-start space-x-3 font-mono"
//                       >
//                         {log.status === "success" && (
//                           <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
//                         )}
//                         {log.status === "pending" && (
//                           <Loader2 className="h-3.5 w-3.5 text-[#D4AF37] animate-spin mt-0.5 shrink-0" />
//                         )}
//                         {log.status === "warn" && (
//                           <Globe className="h-3.5 w-3.5 text-yellow-500 mt-0.5 shrink-0" />
//                         )}
//                         {log.status === "failed" && (
//                           <ShieldAlert className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
//                         )}

//                         <div className="flex-1 font-mono">
//                           <p
//                             className={`${
//                               log.status === "success"
//                                 ? "text-gray-300"
//                                 : log.status === "pending"
//                                   ? "text-[#D4AF37]"
//                                   : log.status === "warn"
//                                     ? "text-yellow-400 font-semibold"
//                                     : "text-red-400 font-semibold"
//                             }`}
//                           >
//                             {log.text}
//                           </p>
//                           {log.status === "pending" && (
//                             <div className="w-full bg-[#141414] h-[2px] rounded-full overflow-hidden mt-1.5">
//                               <motion.div
//                                 className="bg-[#D4AF37] h-full"
//                                 initial={{ width: "0%" }}
//                                 animate={{ width: "100%" }}
//                                 transition={{
//                                   duration: 0.7,
//                                   ease: "easeInOut",
//                                 }}
//                               />
//                             </div>
//                           )}
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>

//                   {/* Aesthetic transmission telemetry details */}
//                   <div className="pt-4 border-t border-[#1F1F1F] flex items-center justify-between text-[9px] text-gray-500 font-mono uppercase tracking-widest">
//                     <span className="flex items-center">
//                       <Wifi className="h-3 w-3 mr-1 text-green-500/70" /> Link
//                       active
//                     </span>
//                     <span>Studio Relay v1.50</span>
//                   </div>
//                 </motion.div>
//               ) : !isSubmitted ? (
//                 <motion.form
//                   key="contact-form"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   onSubmit={handleSubmit}
//                   className="space-y-6"
//                 >
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     {/* Name */}
//                     <div>
//                       <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">
//                         FullName
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full px-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans"
//                         placeholder="e.g. John Doe"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                       />
//                     </div>

//                     {/* Email */}
//                     <div>
//                       <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         className="w-full px-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans"
//                         placeholder="john@example.com"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                       />
//                     </div>
//                   </div>

//                   {/* Phone */}
//                   <div>
//                     <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">
//                       Phone Number
//                     </label>
//                     <input
//                       type="tel"
//                       className="w-full px-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans"
//                       placeholder="e.g. +91 99988 88899"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value)}
//                     />
//                   </div>

//                   {/* Service & Project Type */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">Service</label>
//                       <select value={service} onChange={(e) => setService(e.target.value)} className="w-full px-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white text-xs focus:border-[#D4AF37] focus:outline-none transition-all font-sans">
//                         <option value="">Select a service</option>
//                         <option>Wedding Photography</option>
//                         <option>Pre-Wedding Photography</option>
//                         <option>Cinematic Video Editing</option>
//                         <option>Birthday Photography</option>
//                         <option>House Warming Photography</option>
//                         <option>Other</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">Project Type</label>
//                       <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full px-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white text-xs focus:border-[#D4AF37] focus:outline-none transition-all font-sans">
//                         <option value="">Select project type</option>
//                         <option>Wedding</option>
//                         <option>Pre-Wedding</option>
//                         <option>Portrait</option>
//                         <option>Birthday / Event</option>
//                         <option>Video / Reel</option>
//                         <option>Other</option>
//                       </select>
//                     </div>
//                   </div>

//                   {/* Message */}
//                   <div>
//                     <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">
//                       Photoshoot Vision & Timeline
//                     </label>
//                     <textarea
//                       rows={5}
//                       className="w-full px-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all resize-none font-sans"
//                       placeholder="Briefly describe what you're planning (Wedding date, guest size, locations, or special portrait aesthetic styles)..."
//                       value={message}
//                       onChange={(e) => setMessage(e.target.value)}
//                     />
//                   </div>

//                   {/* Error display */}
//                   {formError && (
//                     <div className="flex items-start space-x-2 p-3 bg-[#1A1111] border border-red-900/30 rounded-sm text-xs text-red-400 font-sans">
//                       <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
//                       <span>{formError}</span>
//                     </div>
//                   )}

//                   {/* Submit Button */}
//                   <div className="border-t border-[#2A2A2A] pt-6 flex justify-end">
//                     <button
//                       type="submit"
//                       disabled={isLoading}
//                       className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-sm bg-[#D4AF37] text-black hover:bg-[#c49f2a] hover:scale-[1.01] font-bold text-xs uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50"
//                     >
//                       <Calendar className="h-4 w-4 mr-2" />
//                       <span>Submit Session Vision</span>
//                     </button>
//                   </div>
//                 </motion.form>
//               ) : (
//                 <motion.div
//                   key="success-screen"
//                   initial={{ opacity: 0, scale: 0.98 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.4 }}
//                   className="py-12 text-center"
//                 >
//                   <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full inline-block mb-6">
//                     <CheckCircle2 className="h-10 w-10 text-[#D4AF37]" />
//                   </div>
//                   <h3 className="text-xl font-serif italic text-white tracking-wide">
//                     Vision Dispatched Securely
//                   </h3>
//                   <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed font-sans">
//                     Email notification successfully triggered to the studio
//                     owner's corporate mailbox{" "}
//                     {mailResponse?.recipient && (
//                       <strong>{mailResponse.recipient}</strong>
//                     )}
//                     . Leads have been synced to the primary CRM client roster.
//                   </p>

//                   {mailResponse && (
//                     <div className="mt-6 p-4 bg-[#0B0B0B] border border-[#222] rounded-sm max-w-md mx-auto text-left font-mono text-[10px] text-gray-400 space-y-1">
//                       <div className="text-gray-500 text-[9px] uppercase tracking-wider font-semibold border-b border-[#222] pb-1.5 mb-1.5 flex justify-between items-center">
//                         <span>Courier Envelope Metadata</span>
//                         <span className="text-[#D4AF37]">
//                           {mailResponse?.mode === "live"
//                             ? "Live EmailJS"
//                             : "EmailJS Delivery"}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600 font-mono">
//                           Recipient:
//                         </span>{" "}
//                         {mailResponse.recipient}
//                       </div>
//                       <div>
//                         <span className="text-gray-600 font-mono">
//                           Timestamp:
//                         </span>{" "}
//                         {mailResponse.timestamp || new Date().toISOString()}
//                       </div>
//                       <div className="pt-1 text-[#666] font-mono select-all break-all leading-normal">
//                         <span className="text-gray-600 font-mono">
//                           Telemetry:
//                         </span>{" "}
//                         {mailResponse.telemetry}
//                       </div>
//                     </div>
//                   )}

//                   <button
//                     onClick={() => setIsSubmitted(false)}
//                     className="mt-8 text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 px-5 py-2.5 rounded-sm transition-all cursor-pointer"
//                   >
//                     Send Another Inquiry
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };


import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Phone,
  Instagram,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Terminal,
  ShieldAlert,
  Check,
  Wifi,
  Globe,
} from "lucide-react";
import API from "../services/api";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import contactConfig from "../config/contact";

export const Contact = () => {
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [service, setService] = useState("");
  const [projectType, setProjectType] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Advanced Visual Courier state tracking
  const [dispatchLogs, setDispatchLogs] = useState([]);
  const [mailResponse, setMailResponse] = useState(null);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Front-end validations
    if (!name.trim()) {
      setFormError("Name field is required so we know who to address.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!phone.trim()) {
      setFormError(
        "Phone number is required so our booking manager can text back.",
      );
      return;
    }

    if (!message.trim()) {
      setFormError(
        "Please leave a short message about your photoshoot timeline or theme request.",
      );
      return;
    }

    setIsLoading(true);
    setDispatchLogs([]);
    setMailResponse(null);

    try {
      // Step 1: Initialize local buffer
      setDispatchLogs([
        {
          id: 1,
          text: "Analyzing inputs & assembling data package structure...",
          status: "pending",
        },
      ]);

      await wait(550);

      // Step 2: Establish Cryptographic check
      setDispatchLogs((prev) => [
        {
          id: 1,
          text: "Analyzing inputs & assembling data package structure...",
          status: "success",
        },
        {
          id: 2,
          text: "Verifying secure courier routing to corporate mailbox...",
          status: "pending",
        },
      ]);

      await wait(600);

      // Step 3: Trigger physical connection
      setDispatchLogs((prev) => [
        ...prev.slice(0, 1),
        {
          id: 2,
          text: "Verifying secure courier routing to corporate mailbox...",
          status: "success",
        },
        {
          id: 3,
          text: "POST core lead package to secure relational database store...",
          status: "pending",
        },
      ]);

      const res = await API.post("/leads", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service: service.trim(),
        projectType: projectType.trim(),
        message: message.trim(),
      });

      const mailResult = res.data?.mailStatus || {
        mode: "failed",
        recipient: "director",
      };

      setMailResponse(mailResult);

      setDispatchLogs((prev) => [
        ...prev.slice(0, 2),
        {
          id: 3,
          text: "POST core lead package to secure relational database store...",
          status: "success",
        },
        {
          id: 4,
          text: `Routing copy dynamically to owners mail [${
            mailResult.recipient || "owner@auraphotostudio.com"
          }]...`,
          status: "pending",
        },
      ]);

      await wait(750);

      if (mailResult.mode === "live") {
        setDispatchLogs((prev) => [
          ...prev.slice(0, 3),
          {
            id: 4,
            text: `Routing copy dynamically to owners mail [${mailResult.recipient}]...`,
            status: "success",
          },
          {
            id: 5,
            text: `📨 Live EmailJS email successfully delivered! Session vision received safely.`,
            status: "success",
          },
        ]);
      } else if (mailResult.mode === "simulated") {
        setDispatchLogs((prev) => [
          ...prev.slice(0, 3),
          {
            id: 4,
            text: `Routing copy dynamically to owners mail [${mailResult.recipient}]...`,
            status: "success",
          },
          {
            id: 5,
            text: `📨 EmailJS dispatch triggered.`,
            status: "warn",
          },
        ]);
      } else {
        setDispatchLogs((prev) => [
          ...prev.slice(0, 3),
          {
            id: 4,
            text: `Routing copy dynamically to owners mail [${
              mailResult.recipient || "owner"
            }]...`,
            status: "success",
          },
          {
            id: 5,
            text: `⚠️ Mailer logged with warnings. EmailJS delivery should be verified.`,
            status: "warn",
          },
        ]);
      }

      await wait(1200);

      setIsSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setService("");
      setProjectType("");
    } catch (err) {
      console.error(err);

      setDispatchLogs((prev) => [
        ...prev.map((item) =>
          item.status === "pending"
            ? { ...item, status: "failed" }
            : item,
        ),
        {
          id: 99,
          text: `Transmission aborted: ${
            err.response?.data?.msg ||
            "Database node or protocol failure."
          }`,
          status: "failed",
        },
      ]);

      setFormError(
        err.response?.data?.msg ||
          "Failed to deliver inquiry. Please verify inputs or try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#0F0F0F] text-[#F5F5F5]"
      id="contact_page_root"
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-grow">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
            Inquire Session
          </h1>

          <p className="text-3xl sm:text-4xl font-serif italic font-light text-white mt-1.5 tracking-tight">
            Secure Your Capture Date
          </p>

          <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">
            Let us know your event specifics. Our representative answers
            within 4 hours with customizable quotes.
          </p>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          id="contact_layout_grid"
        >
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-6 sm:p-8 bg-[#141414] border border-[#2A2A2A] rounded-sm">
              <h3 className="text-base font-serif italic text-white mb-6 tracking-wide">
                Digital & Social Channels
              </h3>

              <div className="space-y-6">

                {/* Instagram */}
                {contactConfig.instagramLinks.length > 0 && (
                  <div className="flex items-start space-x-4">
                    <div className="p-2.5 bg-[#D4AF37]/5 rounded-sm border border-[#D4AF37]/10 shrink-0">
                      <Instagram className="h-4 w-4 text-[#D4AF37]" />
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest mb-0.5">
                        Instagram Profiles
                      </h4>

                      <div className="text-xs text-gray-400 leading-relaxed font-sans flex flex-col gap-1">
                        {contactConfig.instagramLinks.map(
                          (link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#D4AF37] transition-colors break-all"
                            >
                              {link}
                            </a>
                          ),
                        )}

                        <span className="text-[10px] text-gray-600 font-mono mt-1">
                          DM us anytime for active updates & stories
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Phone Numbers */}
                {contactConfig.phones.length > 0 && (
                  <div className="flex items-start space-x-4">
                    <div className="p-2.5 bg-[#D4AF37]/5 rounded-sm border border-[#D4AF37]/10 shrink-0">
                      <Phone className="h-4 w-4 text-[#D4AF37]" />
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest mb-0.5">
                        Operator Line
                      </h4>

                      <div className="text-xs text-gray-400 leading-relaxed flex flex-col gap-1">
                        {contactConfig.phones.map((phone, index) => (
                          <a
                            key={index}
                            href={`tel:${phone.replace(/\s+/g, "")}`}
                            className="hover:text-[#D4AF37] transition-colors"
                          >
                            {phone}
                          </a>
                        ))}

                        <span className="text-[10px] text-gray-600 font-mono mt-1">
                          WhatsApp support active 24/7
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Addresses */}
                {contactConfig.emails.length > 0 && (
                  <div className="flex items-start space-x-4">
                    <div className="p-2.5 bg-[#D4AF37]/5 rounded-sm border border-[#D4AF37]/10 shrink-0">
                      <Mail className="h-4 w-4 text-[#D4AF37]" />
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest mb-0.5">
                        Corporate Email
                      </h4>

                      <div className="text-xs text-gray-400 leading-relaxed flex flex-col gap-1">
                        {contactConfig.emails.map((email, index) => (
                          <a
                            key={index}
                            href={`mailto:${email}`}
                            className="hover:text-[#D4AF37] transition-colors break-all"
                          >
                            {email}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Digital & Mobile Information */}
            <div className="p-6 bg-[#141414] border border-[#2A2A2A] rounded-sm flex items-start space-x-4">
              <Clock className="h-4 w-4 text-[#D4AF37]/80 shrink-0 mt-0.5" />

              <div>
                <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                  Fully Digital & Mobile
                </h4>

                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  We operate as a digital-first studio! Our professional team
                  travels on-location for your selected venues, weddings, and
                  events. Online text and e-mail consultations are active
                  Monday through Saturday, 9:00 AM – 6:00 PM PST.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Capture Form */}
          <div className="lg:col-span-7 bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 sm:p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="emailjs-courier-terminal"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-sm font-mono space-y-6 shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 inline-block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 inline-block"></span>
                      </div>

                      <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold font-mono">
                        Courier Telemetry CLI
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 text-[9px] text-[#D4AF37] font-mono">
                      <Terminal className="h-3 w-3 animate-pulse text-[#D4AF37]" />
                      <span className="animate-pulse">
                        SOCKET BROADCAST
                      </span>
                    </div>
                  </div>

                  {/* Terminal Log Output List */}
                  <div className="space-y-4 text-[11px] leading-relaxed select-none min-h-[140px]">
                    {dispatchLogs.map((log, idx) => (
                      <motion.div
                        key={log.id || idx}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start space-x-3 font-mono"
                      >
                        {log.status === "success" && (
                          <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                        )}

                        {log.status === "pending" && (
                          <Loader2 className="h-3.5 w-3.5 text-[#D4AF37] animate-spin mt-0.5 shrink-0" />
                        )}

                        {log.status === "warn" && (
                          <Globe className="h-3.5 w-3.5 text-yellow-500 mt-0.5 shrink-0" />
                        )}

                        {log.status === "failed" && (
                          <ShieldAlert className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                        )}

                        <div className="flex-1 font-mono">
                          <p
                            className={`${
                              log.status === "success"
                                ? "text-gray-300"
                                : log.status === "pending"
                                  ? "text-[#D4AF37]"
                                  : log.status === "warn"
                                    ? "text-yellow-400 font-semibold"
                                    : "text-red-400 font-semibold"
                            }`}
                          >
                            {log.text}
                          </p>

                          {log.status === "pending" && (
                            <div className="w-full bg-[#141414] h-[2px] rounded-full overflow-hidden mt-1.5">
                              <motion.div
                                className="bg-[#D4AF37] h-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{
                                  duration: 0.7,
                                  ease: "easeInOut",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Telemetry */}
                  <div className="pt-4 border-t border-[#1F1F1F] flex items-center justify-between text-[9px] text-gray-500 font-mono uppercase tracking-widest">
                    <span className="flex items-center">
                      <Wifi className="h-3 w-3 mr-1 text-green-500/70" />
                      Link active
                    </span>

                    <span>Studio Relay v1.50</span>
                  </div>
                </motion.div>
              ) : !isSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">
                        FullName
                      </label>

                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans"
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">
                        Email Address
                      </label>

                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans"
                      placeholder="e.g. +91 99988 88899"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  {/* Service & Project Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">
                        Service
                      </label>

                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white text-xs focus:border-[#D4AF37] focus:outline-none transition-all font-sans"
                      >
                        <option value="">Select a service</option>
                        {services.map((item) => (
                          <option key={item.slug} value={item.title}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">
                        Project Type
                      </label>

                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full px-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white text-xs focus:border-[#D4AF37] focus:outline-none transition-all font-sans"
                      >
                        <option value="">Select project type</option>
                        <option>Wedding</option>
                        <option>Pre-Wedding</option>
                        <option>Portrait</option>
                        <option>Birthday / Event</option>
                        <option>Video / Reel</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">
                      Photoshoot Vision & Timeline
                    </label>

                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 rounded-sm bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all resize-none font-sans"
                      placeholder="Briefly describe what you're planning (Wedding date, guest size, locations, or special portrait aesthetic styles)..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  {/* Error display */}
                  {formError && (
                    <div className="flex items-start space-x-2 p-3 bg-[#1A1111] border border-red-900/30 rounded-sm text-xs text-red-400 font-sans">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="border-t border-[#2A2A2A] pt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-sm bg-[#D4AF37] text-black hover:bg-[#c49f2a] hover:scale-[1.01] font-bold text-xs uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Submit Session Vision</span>
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="py-12 text-center"
                >
                  <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full inline-block mb-6">
                    <CheckCircle2 className="h-10 w-10 text-[#D4AF37]" />
                  </div>

                  <h3 className="text-xl font-serif italic text-white tracking-wide">
                    Vision Dispatched Securely
                  </h3>

                  <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed font-sans">
                    Email notification successfully triggered to the studio
                    owner's corporate mailbox{" "}
                    {mailResponse?.recipient && (
                      <strong>{mailResponse.recipient}</strong>
                    )}
                    . Leads have been synced to the primary CRM client roster.
                  </p>

                  {mailResponse && (
                    <div className="mt-6 p-4 bg-[#0B0B0B] border border-[#222] rounded-sm max-w-md mx-auto text-left font-mono text-[10px] text-gray-400 space-y-1">
                      <div className="text-gray-500 text-[9px] uppercase tracking-wider font-semibold border-b border-[#222] pb-1.5 mb-1.5 flex justify-between items-center">
                        <span>Courier Envelope Metadata</span>

                        <span className="text-[#D4AF37]">
                          {mailResponse?.mode === "live"
                            ? "Live EmailJS"
                            : "EmailJS Delivery"}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-600 font-mono">
                          Recipient:
                        </span>{" "}
                        {mailResponse.recipient}
                      </div>

                      <div>
                        <span className="text-gray-600 font-mono">
                          Timestamp:
                        </span>{" "}
                        {mailResponse.timestamp ||
                          new Date().toISOString()}
                      </div>

                      <div className="pt-1 text-[#666] font-mono select-all break-all leading-normal">
                        <span className="text-gray-600 font-mono">
                          Telemetry:
                        </span>{" "}
                        {mailResponse.telemetry}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 px-5 py-2.5 rounded-sm transition-all cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

