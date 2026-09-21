import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Plus, X, Image as ImageIcon, Loader2, Link2, Check, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { services, getServiceBySlug } from "../config/services";

export const Projects = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imagesText, setImagesText] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  const filteredProjects = useMemo(() => {
    if (!selectedCategory) return projects;
    return projects.filter((project) => (project.category || "other") === selectedCategory);
  }, [projects, selectedCategory]);

  const fetchProjects = () => {
    setLoading(true);
    API.get("/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error loading projects:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    if (!title.trim() || !description.trim() || !category) {
      setFormError("Project Title, Description, and Category are required.");
      return;
    }

    const separatedImages = imagesText
      .split("\n")
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (separatedImages.length === 0) {
      setFormError("At least one valid image URL is required. Place one URL per line.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        images: separatedImages
      };
      if (editingProject) {
        await API.put(`/projects/${editingProject._id}`, payload);
        setSuccessMsg("🟩 Portfolio project updated successfully!");
      } else {
        await API.post("/projects", payload);
        setSuccessMsg("🟩 New portfolio project uploaded successfully!");
      }
      setTitle("");
      setDescription("");
      setCategory("");
      setImagesText("");
      setEditingProject(null);
      fetchProjects();
      
      // Auto close after brief second
      setTimeout(() => {
        setShowAddForm(false);
        setEditingProject(null);
        setSuccessMsg("");
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data?.msg || "Failed to upload project. Check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setFormError("");
    setUploadingImages(true);
    try {
      const uploaded = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} is larger than 5 MB.`);
        const dataUri = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const res = await API.post("/media/upload", { dataUri });
        uploaded.push(res.data.url);
      }
      if (uploaded.length) {
        setImagesText((current) => [...current.split("\n").map((x) => x.trim()).filter(Boolean), ...uploaded].join("\n"));
      }
    } catch (err) {
      setFormError(err.response?.data?.msg || err.message || "Image upload failed.");
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };

  const startEditProject = (project) => {
    setEditingProject(project);
    setTitle(project.title || "");
    setDescription(project.description || "");
    setCategory(project.category || "other");
    setImagesText((project.images || []).join("\n"));
    setFormError("");
    setSuccessMsg("");
    setShowAddForm(true);
  };

  const handleDeleteProject = async (project) => {
    if (!window.confirm(`Delete project "${project.title}"?`)) return;
    try {
      await API.delete(`/projects/${project._id}`);
      fetchProjects();
    } catch (err) {
      setFormError(err.response?.data?.msg || "Failed to delete project.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F0F] text-[#F5F5F5]" id="projects_page_root">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-grow">
        {/* Header Grid */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#2A2A2A] pb-8 mb-12">
          <div>
            <h1 className="text-3xl font-serif italic font-light text-white tracking-tight">Studio Archive</h1>
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider">Browse our complete collection of weddings, outdoor couple pre-weddings, and narrative cinematic creations.</p>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-5 py-3 rounded-sm bg-[#D4AF37] text-black hover:bg-[#c49f2a] font-bold text-xs uppercase tracking-wider cursor-pointer transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Publish New Project</span>
            </button>
          ) : null}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={`px-3 py-2 text-[10px] font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
              !selectedCategory
                ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5"
                : "border-[#2A2A2A] text-gray-500 hover:text-[#D4AF37] hover:border-[#D4AF37]/50"
            }`}
          >
            All Projects
          </button>
          {services.map((service) => (
            <button
              key={service.slug}
              type="button"
              onClick={() => setSearchParams({ category: service.slug })}
              className={`px-3 py-2 text-[10px] font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
                selectedCategory === service.slug
                  ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5"
                  : "border-[#2A2A2A] text-gray-500 hover:text-[#D4AF37] hover:border-[#D4AF37]/50"
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>

        {/* Catalog List */}
        {loading && projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[#141414] border border-[#2A2A2A] rounded-sm">
            <Loader2 className="h-6 w-6 text-[#D4AF37] animate-spin mr-3 mb-2" />
            <span className="text-xs text-gray-500 font-mono">Retrieving active studio reels...</span>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredProjects.map((project, idx) => (
              <motion.article
                key={project._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: Math.min(idx * 0.1, 0.4) }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#141414] border border-[#2A2A2A] p-6 sm:p-8 rounded-sm"
              >
                {/* Images Display layout */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                  {project.images.slice(0, 2).map((imgUrl, i) => (
                    <div
                      key={i}
                      className={`relative aspect-4/3 rounded-sm overflow-hidden bg-black border border-[#2A2A2A] ${project.images.length === 1 ? "sm:col-span-2" : ""}`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${project.title} - view ${i + 1}`}
                        className="w-full h-full object-cover select-none filter saturate-75 hover:saturate-100 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>

                {/* Details list */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-[10px] font-bold font-mono tracking-widest uppercase h-fit">
                    <span className="text-[#D4AF37]">
                      {getServiceBySlug(project.category)?.title || "Other"}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500">
                      {project.images.length} {project.images.length === 1 ? "Frame" : "Captured Frames"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-serif italic text-white tracking-wide mt-1.5 mb-3">
                    {project.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6 font-sans">
                    {project.description}
                  </p>
                  <div className="flex items-center space-x-1.5 text-[10px] text-gray-500 uppercase tracking-wider font-mono border-t border-[#2A2A2A] pt-4">
                    <Camera className="h-3.5 w-3.5 text-[#D4AF37]" />
                    <span>ENDLESS Moments</span>
                  </div>
                  {isAuthenticated && (
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => startEditProject(project)} className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#2A2A2A] text-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37] text-[10px] uppercase tracking-wider font-mono cursor-pointer">
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                      <button onClick={() => handleDeleteProject(project)} className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#2A2A2A] text-gray-300 hover:border-red-500 hover:text-red-400 text-[10px] uppercase tracking-wider font-mono cursor-pointer">
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
            {filteredProjects.length === 0 && (
              <div className="py-20 text-center bg-[#141414] border border-[#2A2A2A] rounded-sm">
                <p className="text-sm text-gray-400">No projects found in this category.</p>
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  className="mt-4 text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] hover:underline cursor-pointer"
                >
                  View all projects
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sliding Modal for publishing new projects */}
        <AnimatePresence>
          {showAddForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative bg-[#0F0F0F] border border-[#2A2A2A] rounded-sm w-full max-w-xl p-6 sm:p-8 overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowAddForm(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-center space-x-2.5 mb-6 text-white pb-4 border-b border-[#2A2A2A]">
                  <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-serif italic text-sm font-bold">
                    Φ
                  </div>
                  <h2 className="text-lg font-serif italic tracking-wide text-[#F5F5F5]">{editingProject ? "Edit Portfolio Project" : "Record New Portfolio Project"}</h2>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">Project Title</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-sm bg-[#141414] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs font-sans focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all"
                      placeholder="e.g. Elysian Bloom Wedding"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">Project Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-sm bg-[#141414] border border-[#2A2A2A] text-white text-xs focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all"
                    >
                      <option value="">Select a category</option>
                      {services.map((service) => (
                        <option key={service.slug} value={service.slug}>
                          {service.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest mb-2">Creative Description</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 rounded-sm bg-[#141414] border border-[#2A2A2A] text-white placeholder-gray-600 text-xs font-sans focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all resize-none"
                      placeholder="Briefly summarize the shoot setting, theme and sensory highlights..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Image URLs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase tracking-widest">Image URLs (One per line)</label>
                      <span className="text-[9px] text-[#D4AF37] font-mono tracking-wider uppercase">Unsplash URLs compatible</span>
                    </div>
                    <div className="mb-3 flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-3 py-2 border border-[#2A2A2A] text-gray-300 hover:border-[#D4AF37] hover:text-[#D4AF37] text-[10px] uppercase tracking-wider font-mono cursor-pointer">
                        <ImageIcon className="h-3.5 w-3.5" />
                        {uploadingImages ? "Uploading..." : "Upload to Cloudinary"}
                        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple className="hidden" onChange={handleImageUpload} disabled={uploadingImages} />
                      </label>
                      <span className="text-[9px] text-gray-600 font-mono">Up to 5 MB each</span>
                    </div>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-sm bg-[#141414] border border-[#2A2A2A] text-white placeholder-gray-600 text-[10px] font-mono focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all"
                      placeholder="https://images.unsplash.com/photo-...\nhttps://images.unsplash.com/..."
                      value={imagesText}
                      onChange={(e) => setImagesText(e.target.value)}
                    />
                    <p className="text-[10px] text-gray-600 font-sans mt-1.5 leading-relaxed">
                      Tip: Use license-free stock image links (e.g. Unsplash, S3, or Imgur links). They load seamlessly in all user browsers.
                    </p>
                  </div>

                  {/* Errors & Success */}
                  {formError && (
                    <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-sm text-xs text-red-400 font-sans">
                      {formError}
                    </div>
                  )}

                  {successMsg && (
                    <div className="flex items-center space-x-1.5 p-3 bg-green-950/20 border border-green-900/30 rounded-sm text-xs text-green-400 font-sans">
                      <Check className="h-4 w-4 text-[#D4AF37]" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  {/* Submit buttons */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#2A2A2A]">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center space-x-1.5 px-5 py-3 rounded-sm bg-[#D4AF37] text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#c49f2a] cursor-pointer disabled:opacity-50 transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <span>Post Portfolio</span>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};
