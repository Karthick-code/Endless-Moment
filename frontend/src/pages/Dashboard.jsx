import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sliders,
  Users,
  Mail,
  Phone,
  Calendar,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  UserCheck,
  Inbox,
  Plus,
  Coins,
  Wallet,
  ClipboardList,
  X,
  Edit2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Dashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [systemSyncing, setSystemSyncing] = useState(false);

  // Add Client Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newInquiryMsg, setNewInquiryMsg] = useState("");
  const [newStatus, setNewStatus] = useState("new"); // Default to 'new' lead option
  const [newRequirements, setNewRequirements] = useState("");
  const [newPayment, setNewPayment] = useState("");
  const [newAdvance, setNewAdvance] = useState("");
  const [isSubmittingNewClient, setIsSubmittingNewClient] = useState(false);
  const [addClientError, setAddClientError] = useState("");

  // Edit Client Form States
  const [editingLead, setEditingLead] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRequirements, setEditRequirements] = useState("");
  const [editPayment, setEditPayment] = useState("");
  const [editAdvance, setEditAdvance] = useState("");
  const [editStatus, setEditStatus] = useState("converted");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editClientError, setEditClientError] = useState("");


  // Guard: if not authenticated, redirect to /login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const loadLeads = () => {
    setSystemSyncing(true);
    API.get("/leads")
      .then((res) => {
        setLeads(res.data);
        setErrorMsg("");
      })
      .catch((err) => {
        console.error("Error loading leads:", err);
        setErrorMsg("Failed to synchronize inquiries database.");
      })
      .finally(() => {
        setLoading(false);
        setSystemSyncing(false);
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadLeads();
    }
  }, [isAuthenticated]);


  const handleUpdateStatus = (id, newStatus) => {
    API.put(`/leads/${id}`, { status: newStatus })
      .then(() => {
        setLeads((prev) =>
          prev.map((lead) =>
            lead._id === id ? { ...lead, status: newStatus } : lead,
          ),
        );
      })
      .catch((err) => {
        console.error("Error updating lead status:", err);
        // Fallback or visual warning
      });
  };

  const openEdit = (lead) => {
    setEditingLead(lead);
    setEditName(lead.name || "");
    setEditEmail(lead.email || "");
    setEditPhone(lead.phone || "");
    setEditRequirements(lead.requirements || "");
    setEditPayment(lead.paymentAmount || "");
    setEditAdvance(lead.advancePayment || "");
    setEditStatus(lead.status || "converted");
    setEditClientError("");
  };

  const handleAddClientSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newPhone.trim()) {
      setAddClientError("FullName, Email, and Phone are required fields.");
      return;
    }
    setAddClientError("");
    setIsSubmittingNewClient(true);

    const payload = {
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      message: newInquiryMsg.trim() || "Manually added via CRM Dashboard",
      status: newStatus,
      requirements: newRequirements.trim(),
      paymentAmount: newPayment.trim(),
      advancePayment: newAdvance.trim(),
    };

    API.post("/leads", payload)
      .then((res) => {
        setLeads((prev) => [res.data, ...prev]);
        setIsAddModalOpen(false);
        // Clear Form Fields
        setNewName("");
        setNewEmail("");
        setNewPhone("");
        setNewInquiryMsg("");
        setNewRequirements("");
        setNewPayment("");
        setNewAdvance("");
        setNewStatus("new");
      })
      .catch((err) => {
        console.error("Error creating client:", err);
        setAddClientError(
          err.response?.data?.msg ||
            "Database failure creating new client registry.",
        );
      })
      .finally(() => {
        setIsSubmittingNewClient(false);
      });
  };

  const handleEditClientSubmit = (e) => {
    e.preventDefault();
    if (!editingLead) return;
    if (!editName.trim() || !editEmail.trim() || !editPhone.trim()) {
      setEditClientError("FullName, Email, and Phone are required fields.");
      return;
    }
    setEditClientError("");
    setIsSubmittingEdit(true);

    const payload = {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      status: editStatus,
      requirements: editRequirements.trim(),
      paymentAmount: editPayment.trim(),
      advancePayment: editAdvance.trim(),
    };

    API.put(`/leads/${editingLead._id}`, payload)
      .then((res) => {
        setLeads((prev) =>
          prev.map((l) =>
            l._id === editingLead._id ? { ...l, ...res.data } : l,
          ),
        );
        setEditingLead(null);
      })
      .catch((err) => {
        console.error("Error editing client:", err);
        setEditClientError(
          err.response?.data?.msg ||
            "Database failure modifying client registry.",
        );
      })
      .finally(() => {
        setIsSubmittingEdit(false);
      });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  // Calculate Metrics
  const totalInquiries = leads.length;
  const newCount = leads.filter((l) => l.status === "new").length;
  const contactedCount = leads.filter((l) => l.status === "contacted").length;
  const customersCount = leads.filter((l) => l.status === "converted").length;

  // Render specific tab subviews based on location
  const isCustomersTab = location.pathname.includes("/customers");

  // Filter content
  const activeLeads = isCustomersTab
    ? leads.filter((l) => l.status === "converted")
    : leads;
  return (
    <div
      className="min-h-screen flex flex-col bg-[#0F0F0F] text-[#F5F5F5]"
      id="crm_dashboard_root"
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
        {/* Dashboard Top Header bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#2A2A2A] pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-serif italic font-light tracking-tight text-white flex items-center space-x-2.5">
              <Sliders className="h-4 w-4 text-[#D4AF37]" />
              <span>Studio CRM Panel</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#666] mt-1">
              Track inquiries, convert photoshoots, and manage project clients.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 font-mono py-2 bg-[#D4AF37] hover:bg-[#c49f2a] text-[10px] font-bold uppercase tracking-widest text-black rounded-sm transition-all cursor-pointer shadow-sm shadow-[#D4AF37]/10"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Register Client</span>
            </button>
            <button
              onClick={loadLeads}
              disabled={systemSyncing}
              className="flex items-center space-x-1.5 px-3 py-2 bg-[#141414] hover:bg-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest font-mono text-gray-300 rounded-sm border border-[#2A2A2A] transition-all cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-[#D4AF37] ${systemSyncing ? "animate-spin" : ""}`}
              />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>

        {/* Statistical Metrics Widgets */}
        <section
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          id="crm_analytics_blocks"
        >
          {/* Tile 1 */}
          <div className="p-5 bg-[#141414] border border-[#2A2A2A] rounded-sm relative overflow-hidden flex items-center space-x-4">
            <div className="p-2.5 bg-[#D4AF37]/5 rounded-sm border border-[#D4AF37]/10 text-[#D4AF37]">
              <Inbox className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest font-mono font-bold text-[#666] mb-0.5">
                Gross Leads
              </span>
              <span className="text-2xl font-serif text-white">
                {totalInquiries}
              </span>
            </div>
          </div>

          {/* Tile 2 */}
          <div className="p-5 bg-[#141414] border border-[#2A2A2A] rounded-sm relative overflow-hidden flex items-center space-x-4">
            <div className="p-2.5 bg-red-500/5 rounded-sm border border-red-500/10 text-red-400">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest font-mono font-bold text-[#666] mb-0.5">
                Unreached
              </span>
              <span className="text-2xl font-serif text-white">{newCount}</span>
            </div>
          </div>

          {/* Tile 3 */}
          <div className="p-5 bg-[#141414] border border-[#2A2A2A] rounded-sm relative overflow-hidden flex items-center space-x-4">
            <div className="p-2.5 bg-[#D4AF37]/5 rounded-sm border border-[#D4AF37]/10 text-[#D4AF37]">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest font-mono font-bold text-[#666] mb-0.5">
                Sales Touch
              </span>
              <span className="text-2xl font-serif text-white">
                {contactedCount}
              </span>
            </div>
          </div>

          {/* Tile 4 (High contrast active client metric gold background) */}
          <div className="p-5 bg-[#D4AF37] border border-[#2A2A2A] rounded-sm relative overflow-hidden flex items-center space-x-4 text-black">
            <div className="p-2.5 bg-black/10 rounded-sm border border-black/15 text-black">
              <UserCheck className="h-4 w-4 text-black" />
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-widest font-mono font-bold text-black/75 mb-0.5">
                Clients
              </span>
              <span className="text-2xl font-serif font-bold text-black">
                {customersCount}
              </span>
            </div>
          </div>
        </section>

        {/* Tab Toggle Navigation */}
        <div
          className="flex border-b border-[#2A2A2A] mb-8 animate-fade-in"
          id="crm_filter_tabs"
        >
          <Link
            to="/dashboard/leads"
            className={`px-5 py-3 text-[10px] uppercase font-bold tracking-widest font-mono border-b-2 transition-all cursor-pointer ${
              !isCustomersTab
                ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            Leads Board ({totalInquiries})
          </Link>
          <Link
            to="/dashboard/customers"
            className={`px-5 py-3 text-[10px] uppercase font-bold tracking-widest font-mono border-b-2 transition-all cursor-pointer ${
              isCustomersTab
                ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            Studio Customers ({customersCount})
          </Link>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="p-4 bg-[#1A1111] border border-red-900/30 text-red-500 text-xs rounded-sm mb-6">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Core Tables List Layout */}
        {loading ? (
          <div className="flex items-center justify-center py-20 bg-[#141414] border border-[#2A2A2A] rounded-sm">
            <Loader2 className="h-6 w-6 text-[#D4AF37] animate-spin mr-2" />
            <span className="text-gray-500 text-xs font-mono tracking-wider uppercase">
              Aligning core CRM dataset...
            </span>
          </div>
        ) : activeLeads.length === 0 ? (
          <div className="text-center py-20 bg-[#141414] border border-[#2A2A2A] rounded-sm">
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              {isCustomersTab
                ? "No leads have been marked as 'converted' yet. Transition a lead state on the Leads Board to populate converted customers."
                : "No customer inquiries recorded in this catalog yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeLeads.map((lead) => (
              <div
                key={lead._id}
                className="p-6 bg-[#141414] border border-[#2A2A2A] rounded-sm hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Visual Bio section */}
                <div className="space-y-1.5 flex-grow">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-serif italic text-white tracking-wide">
                      {lead.name}
                    </h3>
                    <span className="text-[10px] text-gray-500 font-mono">
                      • {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                    {/* Status Pill Rendering */}
                    <span
                      className={`text-[9px] uppercase font-bold tracking-widest font-mono px-2 py-0.5 rounded-sm !leading-none ${
                        lead.status === "new"
                          ? "bg-red-500/10 border border-red-500/30 text-red-400"
                          : lead.status === "contacted"
                            ? "bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]"
                            : "bg-green-500/10 border border-green-500/30 text-green-400"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  {/* Core Coordinates */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 text-xs text-gray-400">
                    <span className="flex items-center space-x-1.5">
                      <Mail className="h-3.5 w-3.5 text-gray-600 shrink-0" />
                      <a
                        href={`mailto:${lead.email}`}
                        className="hover:text-[#D4AF37] transition-colors underline decoration-gray-800 font-sans"
                      >
                        {lead.email}
                      </a>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Phone className="h-3.5 w-3.5 text-gray-600 shrink-0" />
                      <a
                        href={`tel:${lead.phone}`}
                        className="hover:text-[#D4AF37] transition-colors font-sans"
                      >
                        {lead.phone}
                      </a>
                    </span>
                  </div>

                  {/* Inquiry details text block */}
                  <div className="p-3.5 bg-[#0F0F0F] rounded-sm text-xs sm:text-sm text-gray-300 leading-relaxed max-w-4xl border border-[#2A2A2A] mt-2 font-sans">
                    {lead.message}
                  </div>

                  {/* Display Custom Client Data / CRM Specific metadata if present */}
                  {(lead.requirements ||
                    lead.paymentAmount ||
                    lead.advancePayment) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 mt-3 border-t border-[#2a2a2a]">
                      {lead.requirements ? (
                        <div className="text-xs">
                          <span className="block text-[9px] uppercase tracking-widest font-mono text-gray-500 mb-0.5">
                            Custom Requirements
                          </span>
                          <p className="text-gray-300 font-sans leading-relaxed">
                            {lead.requirements}
                          </p>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-600 font-mono italic">
                          No custom requirements logged
                        </div>
                      )}
                      {lead.paymentAmount ? (
                        <div className="text-xs">
                          <span className="block text-[9px] uppercase tracking-widest font-mono text-gray-500 mb-0.5">
                            Agreement Amount
                          </span>
                          <p className="text-[#D4AF37] font-semibold font-mono">
                            {lead.paymentAmount}
                          </p>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-600 font-mono italic">
                          No pricing logged
                        </div>
                      )}
                      {lead.advancePayment ? (
                        <div className="text-xs">
                          <span className="block text-[9px] uppercase tracking-widest font-mono text-gray-500 mb-0.5">
                            Advance Booking Paid
                          </span>
                          <p className="text-green-500 font-semibold font-mono">
                            {lead.advancePayment}
                          </p>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-600 font-mono italic">
                          No booking advance logged
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* State alteration controls column */}
                <div className="flex sm:flex-row md:flex-col items-stretch gap-2 shrink-0 w-full sm:w-auto md:min-w-44">
                  <button
                    onClick={() => openEdit(lead)}
                    className="px-3 py-2 bg-[#141414] border border-[#2A2A2A] hover:border-[#D4AF37]/50 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition text-[#D4AF37] text-center cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Edit2 className="h-3 w-3 shrink-0" />
                    <span>Edit Details</span>
                  </button>

                  {lead.status !== "new" && (
                    <button
                      onClick={() => handleUpdateStatus(lead._id, "new")}
                      className="px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-[#141414] transition text-red-400 text-center cursor-pointer"
                    >
                      Mark Unreached
                    </button>
                  )}
                  {lead.status !== "contacted" && (
                    <button
                      onClick={() => handleUpdateStatus(lead._id, "contacted")}
                      className="px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-[#141414] transition text-[#D4AF37] text-center cursor-pointer"
                    >
                      Mark Contacted
                    </button>
                  )}
                  {lead.status !== "converted" && (
                    <button
                      onClick={() => handleUpdateStatus(lead._id, "converted")}
                      className="px-3 py-2 bg-[#D4AF37] hover:bg-[#c49f2a] rounded-sm text-[10px] font-bold font-mono tracking-widest uppercase transition text-black text-center cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <UserCheck className="h-3.5 w-3.5 shrink-0" />
                      <span>Convert Client</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Client Dialog Overlay */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Content wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative w-full max-w-lg bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-6">
                <div>
                  <h3 className="text-base font-serif italic text-white tracking-wide">
                    Register New Client
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#666] mt-1">
                    Directly enroll a client and book custom presets
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddClientSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                      FullName *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                      Initial Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-mono rounded-sm"
                    >
                      <option value="new">New Inquiry Lead</option>
                      <option value="contacted">Lead Contacted</option>
                      <option value="converted">
                        Studio Customer (Converted)
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="eleanor@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 309-8080"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                    Client Requirements (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Soft warm studio portrait backgrounds, high-contrast black & white style preferences..."
                    value={newRequirements}
                    onChange={(e) => setNewRequirements(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans rounded-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                      Agreement Amount / Payment (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $1,800"
                      value={newPayment}
                      onChange={(e) => setNewPayment(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-mono rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                      Booking Advance Paid (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $500"
                      value={newAdvance}
                      onChange={(e) => setNewAdvance(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-mono rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                    Shoot Vision / Timeline Details (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Wedding date, specific locations, visual ideas..."
                    value={newInquiryMsg}
                    onChange={(e) => setNewInquiryMsg(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans rounded-sm resize-none"
                  />
                </div>

                {addClientError && (
                  <div className="p-3 bg-[#1A1111] border border-red-900/30 text-xs text-red-500 rounded-sm font-sans flex items-start space-x-1.5">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                    <span>{addClientError}</span>
                  </div>
                )}

                <div className="border-t border-[#2A2A2A] pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-transparent text-gray-400 hover:text-white border border-[#2A2A2A] hover:border-gray-500 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingNewClient}
                    className="px-5 py-2 bg-[#D4AF37] hover:bg-[#c49f2a] text-black rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest cursor-pointer transition-all disabled:opacity-50 flex items-center space-x-1"
                  >
                    {isSubmittingNewClient ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin mr-1 text-black" />
                        <span>Enrolling...</span>
                      </>
                    ) : (
                      <span>Add Record</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Client Dialog Overlay */}
      <AnimatePresence>
        {editingLead !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingLead(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Content wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative w-full max-w-lg bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-6">
                <div>
                  <h3 className="text-base font-serif italic text-white tracking-wide">
                    Edit Client Details
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#666] mt-1">
                    Alter custom specifications, status, and payment logs
                  </p>
                </div>
                <button
                  onClick={() => setEditingLead(null)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleEditClientSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                      FullName *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                      Status Column
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-mono rounded-sm"
                    >
                      <option value="converted">
                        Studio Customer (Converted)
                      </option>
                      <option value="contacted">Lead Contacted</option>
                      <option value="new">New Inquiry Lead</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="eleanor@example.com"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                    Client Requirements (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Event visual design, custom portraits, venue requirements..."
                    value={editRequirements}
                    onChange={(e) => setEditRequirements(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-sans rounded-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                      Agreement Amount / Payment (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $1,800"
                      value={editPayment}
                      onChange={(e) => setEditPayment(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-mono rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-1.5">
                      Advance Booking Deposit Paid (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $500"
                      value={editAdvance}
                      onChange={(e) => setEditAdvance(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all font-mono rounded-sm"
                    />
                  </div>
                </div>

                {editClientError && (
                  <div className="p-3 bg-[#1A1111] border border-red-900/30 text-xs text-red-500 rounded-sm font-sans flex items-start space-x-1.5">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                    <span>{editClientError}</span>
                  </div>
                )}

                <div className="border-t border-[#2A2A2A] pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingLead(null)}
                    className="px-4 py-2 bg-transparent text-gray-400 hover:text-white border border-[#2A2A2A] hover:border-[#2A2A2A] rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingEdit}
                    className="px-5 py-2 bg-[#D4AF37] hover:bg-[#c49f2a] text-black rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest cursor-pointer transition-all disabled:opacity-50 flex items-center space-x-1"
                  >
                    {isSubmittingEdit ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin mr-1 text-black" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};
