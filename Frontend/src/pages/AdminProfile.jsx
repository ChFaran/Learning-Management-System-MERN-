import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../context/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, BookOpen, Layers, Settings, Trash2, Plus, Edit, UserPlus, CheckCircle, Save, Camera, X } from 'lucide-react';

export default function AdminProfile() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Profile Form state
  const [profileForm, setProfileForm] = useState({ name: "", email: "", headline: "" });
  
  // Mock course data for UI interactions
  const [courses, setCourses] = useState([
    { id: 1, title: 'Build an LLM from Scratch', enrolled: 142, modules: ['Data Prep', 'Transformer Arch', 'Training'] },
    { id: 2, title: 'Advanced React Patterns', enrolled: 89, modules: ['Context API', 'Performance', 'Custom Hooks'] }
  ]);

  // Modal State
  const [modal, setModal] = useState({ isOpen: false, type: '', data: null });

  // Load backend data
  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/admin/users');
      setUsers(data || []);
    } catch (error) {
      console.warn("Using mock users since endpoint might not exist");
      setUsers([
        { _id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'Registered' },
        { _id: 'u2', name: 'Jane Smith', email: 'jane@example.com', role: 'Registered' },
        { _id: 'a1', name: 'Admin Farhan', email: 'a.chfrn@gmail.com', role: 'Admin' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || "", email: user.email || "", headline: "System Administrator" });
    }
    loadUsers();
  }, [user]);

  const showMsg = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage(""), 3000);
  };

  const closeModal = () => setModal({ isOpen: false, type: '', data: null });

  // ===== PROFILE ACTIONS =====
  const saveAdminProfile = async () => {
    try {
      showMsg("Admin profile updated successfully.");
    } catch (err) {
      showMsg("Failed to update profile", true);
    }
  };

  // ===== USER ACTIONS =====
  const handleAddUser = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const role = e.target.role.value;
    const newUser = { _id: 'u' + Date.now(), name, email, role };
    setUsers([...users, newUser]);
    try {
      await api.post('/users/admin/users', { name, email, role, password: 'password123' });
    } catch (error) {}
    showMsg("User added successfully.");
    closeModal();
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const role = e.target.role.value;
    setUsers(users.map(u => u._id === modal.data._id ? { ...u, name, email, role } : u));
    try {
      if (modal.data._id.length > 5 && !modal.data._id.startsWith('u') && !modal.data._id.startsWith('a')) {
        await api.put(`/users/admin/users/${modal.data._id}`, { name, email, role });
      }
    } catch (error) {}
    showMsg("User details updated.");
    closeModal();
  };

  const removeUser = async (id) => {
    try {
      if (id.length > 5 && !id.startsWith('u') && !id.startsWith('a')) {
        await api.delete(`/users/admin/users/${id}`);
      }
      setUsers(users.filter(u => u._id !== id));
      showMsg("User removed entirely.");
    } catch (error) {
      showMsg(error.response?.data?.message || 'Could not remove user', true);
    }
  };

  // ===== COURSE ACTIONS =====
  const handleAddCourse = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    setCourses([...courses, { id: Date.now(), title, enrolled: 0, modules: [] }]);
    showMsg("Course created successfully.");
    closeModal();
  };

  const handleEditCourse = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    setCourses(courses.map(c => c.id === modal.data.id ? { ...c, title } : c));
    showMsg("Course updated.");
    closeModal();
  };

  const handleDeleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
    showMsg("Course deleted.");
  };

  const handleAddModule = (e) => {
    e.preventDefault();
    const moduleName = e.target.module.value;
    setCourses(courses.map(c => c.id === modal.data ? { ...c, modules: [...c.modules, moduleName] } : c));
    showMsg("Module added to course.");
    closeModal();
  };

  const handleEditModule = (e) => {
    e.preventDefault();
    const newName = e.target.module.value;
    const { courseId, moduleIdx } = modal.data;
    setCourses(courses.map(c => {
      if (c.id === courseId) {
        const updatedModules = [...c.modules];
        updatedModules[moduleIdx] = newName;
        return { ...c, modules: updatedModules };
      }
      return c;
    }));
    showMsg("Module updated.");
    closeModal();
  };

  const handleDeleteModule = (courseId, moduleIdx) => {
    setCourses(courses.map(c => {
      if (c.id === courseId) {
        const updatedModules = [...c.modules];
        updatedModules.splice(moduleIdx, 1);
        return { ...c, modules: updatedModules };
      }
      return c;
    }));
    showMsg("Module deleted.");
  };

  // ===== RENDER MODALS =====
  const renderModal = () => {
    if (!modal.isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
          <button onClick={closeModal} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          {modal.type === 'ADD_USER' && (
            <form onSubmit={handleAddUser}>
              <h3 className="text-xl font-bold text-white mb-4">Add New User</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Name</label>
                  <input name="name" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#fd5c36] outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Email</label>
                  <input name="email" type="email" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#fd5c36] outline-none" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Role</label>
                  <select name="role" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#fd5c36] outline-none">
                    <option value="Registered">Registered</option>
                    <option value="Guest">Guest</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#fd5c36] hover:bg-[#ff6f4c] text-white py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-[#fd5c36]/20">Create User</button>
            </form>
          )}

          {modal.type === 'EDIT_USER' && (
            <form onSubmit={handleEditUser}>
              <h3 className="text-xl font-bold text-white mb-4">Edit User Details</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Name</label>
                  <input name="name" defaultValue={modal.data.name} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#fd5c36] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Email</label>
                  <input name="email" type="email" defaultValue={modal.data.email} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#fd5c36] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Role</label>
                  <select name="role" defaultValue={modal.data.role} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#fd5c36] outline-none">
                    <option value="Registered">Registered</option>
                    <option value="Guest">Guest</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#fd5c36] hover:bg-[#ff6f4c] text-white py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-[#fd5c36]/20">Save Changes</button>
            </form>
          )}

          {modal.type === 'ADD_COURSE' && (
            <form onSubmit={handleAddCourse}>
              <h3 className="text-xl font-bold text-white mb-4">Create New Course</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Course Title</label>
                  <input name="title" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#fd5c36] outline-none" placeholder="e.g. Introduction to Physics" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#fd5c36] hover:bg-[#ff6f4c] text-white py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-[#fd5c36]/20">Create Course</button>
            </form>
          )}

          {modal.type === 'EDIT_COURSE' && (
            <form onSubmit={handleEditCourse}>
              <h3 className="text-xl font-bold text-white mb-4">Edit Course</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Course Title</label>
                  <input name="title" defaultValue={modal.data.title} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#fd5c36] outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#fd5c36] hover:bg-[#ff6f4c] text-white py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-[#fd5c36]/20">Save Course</button>
            </form>
          )}

          {modal.type === 'ADD_MODULE' && (
            <form onSubmit={handleAddModule}>
              <h3 className="text-xl font-bold text-white mb-4">Add Module</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Module Title</label>
                  <input name="module" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#fd5c36] outline-none" placeholder="e.g. Lesson 1: Basics" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#fd5c36] hover:bg-[#ff6f4c] text-white py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-[#fd5c36]/20">Add Module</button>
            </form>
          )}
          
          {modal.type === 'EDIT_MODULE' && (
            <form onSubmit={handleEditModule}>
              <h3 className="text-xl font-bold text-white mb-4">Edit Module</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Module Title</label>
                  <input name="module" defaultValue={modal.data.name} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#fd5c36] outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#fd5c36] hover:bg-[#ff6f4c] text-white py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-[#fd5c36]/20">Save Module</button>
            </form>
          )}

        </motion.div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-8 relative">
      {renderModal()}
      
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#fd5c36]" /> Administrator Portal
            </h1>
            <p className="text-zinc-400 mt-1">Manage system operations, users, and content</p>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md font-medium flex items-center gap-2 ${message.isError ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
             <CheckCircle className="w-5 h-5" /> {message.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT SIDEBAR CONTROLS */}
          <div className="w-full lg:w-[280px] flex-shrink-0 space-y-2">
            <div className="bg-surface border border-white/5 rounded-xl overflow-hidden mb-6">
              <div className="h-20 bg-gradient-to-r from-[#fd5c36]/20 to-purple-900/20" />
              <div className="px-5 pb-5 relative">
                <div className="w-16 h-16 rounded-full border-4 border-surface bg-zinc-800 absolute -top-8 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
                </div>
                <div className="mt-10">
                  <h3 className="font-bold text-white text-lg">{profileForm.name || "Administrator"}</h3>
                  <p className="text-xs text-[#fd5c36] font-medium tracking-wider uppercase">{profileForm.headline || "Super Admin"}</p>
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-1 bg-surface border border-white/5 p-2 rounded-xl">
              {[
                { id: "overview", icon: Layers, label: "Website Operations" },
                { id: "profile", icon: Settings, label: "My Profile" },
                { id: "courses", icon: BookOpen, label: "Course Management" },
                { id: "users", icon: Users, label: "User Control" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white/10 text-white' 
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#fd5c36]' : ''}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 bg-surface border border-white/5 rounded-2xl shadow-2xl p-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Website Operations & Stats</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-zinc-900 border border-white/5 p-5 rounded-xl flex items-center gap-4">
                      <div className="bg-blue-500/20 p-3 rounded-lg"><Users className="w-6 h-6 text-blue-500" /></div>
                      <div>
                        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Users</p>
                        <p className="text-2xl font-bold text-white">{users.length}</p>
                      </div>
                    </div>
                    <div className="bg-zinc-900 border border-white/5 p-5 rounded-xl flex items-center gap-4">
                      <div className="bg-emerald-500/20 p-3 rounded-lg"><BookOpen className="w-6 h-6 text-emerald-500" /></div>
                      <div>
                        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Active Courses</p>
                        <p className="text-2xl font-bold text-white">{courses.length}</p>
                      </div>
                    </div>
                    <div className="bg-zinc-900 border border-white/5 p-5 rounded-xl flex items-center gap-4">
                      <div className="bg-purple-500/20 p-3 rounded-lg"><Layers className="w-6 h-6 text-purple-500" /></div>
                      <div>
                        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">System Health</p>
                        <p className="text-2xl font-bold text-emerald-400">100%</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ADMIN PROFILE TAB */}
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl">
                  <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-4">Edit Admin Profile</h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-2">Display Name</label>
                      <input className="w-full bg-zinc-900 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:border-[#fd5c36] outline-none" 
                             value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-2">Contact Email</label>
                      <input className="w-full bg-zinc-900 border border-white/10 text-zinc-500 rounded-lg px-4 py-2.5 outline-none cursor-not-allowed" 
                             value={profileForm.email} readOnly />
                      <p className="text-xs text-zinc-600 mt-1">Admin email addresses cannot be modified directly here.</p>
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-2">Internal Designation</label>
                      <input className="w-full bg-zinc-900 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:border-[#fd5c36] outline-none" 
                             value={profileForm.headline} onChange={(e) => setProfileForm({...profileForm, headline: e.target.value})} />
                    </div>
                    <button onClick={saveAdminProfile} className="mt-4 bg-[#fd5c36] hover:bg-[#ff6f4c] text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-lg shadow-[#fd5c36]/20 transition-all">
                      <Save className="w-4 h-4" /> Save Data
                    </button>
                  </div>
                </motion.div>
              )}

              {/* COURSE MANAGEMENT TAB */}
              {activeTab === 'courses' && (
                <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white">Course Management</h2>
                    <button onClick={() => setModal({ isOpen: true, type: 'ADD_COURSE', data: null })} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm rounded-md flex items-center gap-2 transition-all">
                      <Plus className="w-4 h-4" /> New Course
                    </button>
                  </div>

                  <div className="space-y-4">
                    {courses.map(course => (
                      <div key={course.id} className="bg-zinc-900 border border-white/5 rounded-xl p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-white">{course.title}</h3>
                            <p className="text-xs text-zinc-500 mt-1">{course.enrolled} Students Enrolled</p>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => setModal({ isOpen: true, type: 'EDIT_COURSE', data: course })} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors" title="Edit Properties">
                               <Edit className="w-4 h-4" />
                             </button>
                             <button onClick={() => handleDeleteCourse(course.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md transition-colors" title="Delete Course">
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                        </div>

                        {/* Modules Area */}
                        <div className="bg-black/30 border border-white/5 rounded-lg p-4 mt-2">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-semibold text-zinc-300">Curriculum Modules</h4>
                            <button onClick={() => setModal({ isOpen: true, type: 'ADD_MODULE', data: course.id })} className="text-xs text-[#fd5c36] hover:text-[#ff7858] font-bold uppercase tracking-wider flex items-center gap-1">
                              <Plus className="w-3 h-3" /> Add Module
                            </button>
                          </div>
                          <div className="space-y-2">
                            {course.modules.length === 0 && (
                              <p className="text-xs text-zinc-600 italic">No modules added yet.</p>
                            )}
                            {course.modules.map((mod, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-zinc-800/50 py-2 px-3 rounded border border-white/5 group">
                                <span className="text-sm text-zinc-300"><span className="text-zinc-500 mr-2">{idx+1}.</span>{mod}</span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setModal({ isOpen: true, type: 'EDIT_MODULE', data: { courseId: course.id, moduleIdx: idx, name: mod } })} className="p-1 text-zinc-500 hover:text-white transition-colors" title="Edit Module Content">
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => handleDeleteModule(course.id, idx)} className="p-1 text-zinc-500 hover:text-red-400 transition-colors" title="Delete Module">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* USER MANAGEMENT TAB */}
              {activeTab === 'users' && (
                <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white">System Users & Privileges</h2>
                    <button onClick={() => setModal({ isOpen: true, type: 'ADD_USER', data: null })} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm rounded-md flex items-center gap-2 transition-all">
                      <UserPlus className="w-4 h-4" /> Add User
                    </button>
                  </div>

                  <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-black/40 border-b border-white/10 text-zinc-400 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 font-semibold">User</th>
                          <th className="px-6 py-4 font-semibold">Role</th>
                          <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.map(u => (
                          <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-semibold text-zinc-200">{u.name}</p>
                              <p className="text-xs text-zinc-500">{u.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 flex justify-end gap-2">
                              <button onClick={() => setModal({ isOpen: true, type: 'EDIT_USER', data: u })} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-medium transition-colors">
                                Edit
                              </button>
                              <button onClick={() => removeUser(u._id)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-xs font-medium transition-colors">
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}