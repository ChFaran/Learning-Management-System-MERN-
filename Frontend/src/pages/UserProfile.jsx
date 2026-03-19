import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../context/api';
import { useAuth } from '../context/AuthContext';
import { Settings, BookOpen, CreditCard, User, Mail, MapPin, Briefcase, Camera, Award, Plus, Trash2, Bell, X } from 'lucide-react';

export default function UserProfile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(true);
  
  const [form, setForm] = useState({ name: "", headline: "", bio: "", country: "" });
  const [payment, setPayment] = useState({ accountHolder: "", bankName: "", accountNumber: "", billingAddress: "" });

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/me');
      setProfile(data);
      setForm({
        name: data.name || "",
        headline: data.headline || "",
        bio: data.bio || "",
        country: data.country || "",
      });
    } finally {
      // Small timeout just to prevent flashing if fast
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveProfile = async () => {
    setMessage("");
    try {
      await api.put('/users/me', form);
      await refreshUser();
      await loadProfile();
      setMessage('Profile updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update profile!');
    }
  };

  const savePayment = async () => {
    setMessage("");
    try {
      await api.put('/users/me/payment-details', payment);
      await loadProfile();
      setMessage('Payment details saved.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save payment details!');
    }
  };

  const unenroll = async (courseId) => {
    try {
      await api.delete(`/users/me/enroll/${courseId}`);
      await loadProfile();
      setMessage('Course unenrolled successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not unenroll from course!');
    }
  };

  if (loading) {
    return <div className="h-full flex items-center justify-center text-zinc-400">Loading your profile...</div>;
  }

  const enrolledCount = profile?.enrolledCourses?.length || 0;
  const completedCount = profile?.enrolledCourses?.filter(c => c.progress === 100)?.length || 0;

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 tracking-tight">User Profile</h1>

        {showNotification && (
          <div className="mb-6 p-4 rounded-xl font-medium flex items-start justify-between bg-blue-500/10 border border-blue-500/20 text-blue-400 backdrop-blur-sm shadow-xl shadow-blue-500/5">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-2.5 rounded-full"><Bell className="w-5 h-5" /></div>
              <div>
                <p className="font-bold text-blue-300 mb-0.5">New Course Update Available!</p>
                <p className="text-sm font-normal">The "Build an LLM from Scratch" course has new interactive modules added today.</p>
              </div>
            </div>
            <button onClick={() => setShowNotification(false)} className="text-blue-500 hover:text-blue-300 transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {message && (
          <div className={`mb-6 p-4 rounded-md font-medium flex items-center gap-2 ${message.includes('Could not') ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
            <Settings className="w-5 h-5" /> {message}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT SIDEBAR (Coursera style profile card) */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
            <div className="bg-surface border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm shadow-xl">
              <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer mb-5">
                  <div className="w-32 h-32 rounded-full border-[6px] border-surface bg-gradient-to-tr from-[#fd5c36] to-purple-600 text-white flex items-center justify-center text-5xl font-bold shadow-[0_0_30px_rgba(253,92,54,0.3)] overflow-hidden">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      (profile?.name || user?.name || 'U').slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">{profile?.name || user?.name}</h2>
                <p className="text-sm text-zinc-400 mb-5 text-center">{profile?.headline || 'Learner at FutureLMS'}</p>

                <div className="w-full space-y-3.5 pt-5 border-t border-white/5">
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                    <span className="truncate">{profile?.email || user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                    <span>{profile?.country || 'Earth'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <Briefcase className="w-4 h-4 text-zinc-500 shrink-0" />
                    <span>{profile?.role || 'Registered User'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-surface border border-white/5 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-5">
               <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Learning Stats</h3>
               
               <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-zinc-300">Enrolled Courses</span>
                    <span className="font-medium text-white">{enrolledCount}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(enrolledCount * 20, 100)}%` }} />
                  </div>
               </div>

               <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-zinc-300">Completed Courses</span>
                    <span className="font-medium text-[#fd5c36]">{completedCount}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#fd5c36] rounded-full" style={{ width: `${enrolledCount > 0 ? (completedCount / enrolledCount) * 100 : 0}%` }} />
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT MAIN CONTENT (Tabs) */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Nav Tabs */}
            <div className="flex overflow-x-auto border-b border-white/10 hide-scrollbar mb-8 gap-8">
              {[
                { id: "courses", icon: BookOpen, label: "My Courses" },
                { id: "profile", icon: User, label: "Edit Profile" },
                { id: "payment", icon: CreditCard, label: "Payment & Billing" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 pb-4 pt-2 px-1 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'border-[#fd5c36] text-zinc-100' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <tab.icon className="w-[18px] h-[18px]" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'courses' && (
                <motion.div key="courses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Currently Enrolled</h2>
                      <p className="text-sm text-zinc-500">Pick up right where you left off</p>
                    </div>
                    <button onClick={() => navigate('/')} className="flex items-center justify-center gap-2 text-sm bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-md transition-colors border border-white/10">
                      <Plus className="w-4 h-4" /> Browse Catalog
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {enrolledCount === 0 && (
                      <div className="col-span-full py-16 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] text-center flex flex-col items-center">
                        <Award className="w-16 h-16 text-zinc-600 mb-5" />
                        <h3 className="text-xl font-medium text-zinc-300 mb-2">No active courses</h3>
                        <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-8">You haven't enrolled in any courses yet. Start your learning journey today!</p>
                        <button onClick={() => navigate('/')} className="bg-[#fd5c36] hover:bg-[#ff7554] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#fd5c36]/20">
                          Explore Courses
                        </button>
                      </div>
                    )}
                    
                    {(profile?.enrolledCourses || []).map((entry) => (
                      <div key={entry.course?._id || entry._id} className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-lg group hover:border-[#fd5c36]/30 transition-all flex flex-col relative overflow-hidden">
                        <div className="h-[140px] bg-zinc-900 border-b border-white/5 relative">
                           {/* Placeholder generic course cover */}
                           <div className="absolute inset-0 bg-gradient-to-br from-[#121212] flex items-center justify-center to-[#1e1e1e]">
                              <BookOpen className="w-12 h-12 text-zinc-800" />
                           </div>
                           <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded text-zinc-100 border border-white/10">
                             Active
                           </span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="font-semibold text-zinc-100 text-[15px] leading-snug mb-4 line-clamp-2">
                            {entry.course?.title || 'Unknown Learning Course'}
                          </h3>
                          <div className="mt-auto">
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="text-zinc-400 font-medium">Progress</span>
                              <span className="font-mono text-[#fd5c36]">{entry.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-zinc-800/80 h-1.5 rounded-full mb-6 overflow-hidden">
                               <div className="bg-[#fd5c36] h-full rounded-full transition-all duration-1000" style={{ width: `${entry.progress || 0}%` }}></div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => navigate('/course')} className="flex-1 bg-white hover:bg-zinc-200 text-black text-[13px] font-semibold py-2 rounded-md transition-colors">
                                Resume
                              </button>
                              <button onClick={() => unenroll(entry.course?._id)} className="w-[38px] flex items-center justify-center border border-white/10 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 text-zinc-400 rounded-md transition-colors" title="Unenroll">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl text-sm">
                  <div className="bg-surface border border-white/5 rounded-2xl p-8 space-y-6">
                    <h2 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Personal Information</h2>
                    
                    <div className="col-span-full">
                      <label className="block text-zinc-400 text-[11px] font-bold mb-2 uppercase tracking-wider">Full Name</label>
                      <input className="w-full bg-zinc-900 border border-white/10 text-zinc-100 rounded-lg px-4 py-2.5 focus:border-[#fd5c36] outline-none transition-all placeholder:text-zinc-600" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alex Developer" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 lg:col-span-1">
                        <label className="block text-zinc-400 text-[11px] font-bold mb-2 uppercase tracking-wider">Professional Headline</label>
                        <input className="w-full bg-zinc-900 border border-white/10 text-zinc-100 rounded-lg px-4 py-2.5 focus:border-[#fd5c36] outline-none transition-all placeholder:text-zinc-600" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="e.g. AI Engineer at TechCorp" />
                      </div>
                      <div className="col-span-2 lg:col-span-1">
                        <label className="block text-zinc-400 text-[11px] font-bold mb-2 uppercase tracking-wider">Country</label>
                        <input className="w-full bg-zinc-900 border border-white/10 text-zinc-100 rounded-lg px-4 py-2.5 focus:border-[#fd5c36] outline-none transition-all placeholder:text-zinc-600" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. United States" />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label className="block text-zinc-400 text-[11px] font-bold mb-2 uppercase tracking-wider">Biography</label>
                      <textarea className="w-full bg-zinc-900 border border-white/10 text-zinc-100 rounded-lg px-4 py-3 h-32 focus:border-[#fd5c36] outline-none transition-all resize-y placeholder:text-zinc-600" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself, your experience, and goals..." />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button onClick={saveProfile} className="bg-[#fd5c36] hover:bg-[#ff7554] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-lg shadow-[#fd5c36]/20">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl text-sm">
                  <div className="bg-surface border border-white/5 rounded-2xl p-8 space-y-6">
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                      <h2 className="text-lg font-bold text-white">Payment Methods</h2>
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded flex items-center gap-1.5 border ${profile?.hasPaymentDetails ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {profile?.hasPaymentDetails ? 'Active Method' : 'No Method Linked'}
                      </span>
                    </div>

                    <p className="text-zinc-500 mb-6 font-medium leading-relaxed">Link a payment method to seamlessly enroll in premium courses, handle subscriptions, and track billing.</p>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-zinc-400 text-[11px] font-bold mb-2 uppercase tracking-wider">Name on Card</label>
                        <input className="w-full bg-zinc-900 border border-white/10 text-zinc-100 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700" placeholder="JOHN DOE" value={payment.accountHolder} onChange={(e) => setPayment({ ...payment, accountHolder: e.target.value })} />
                      </div>
                      
                      <div>
                        <label className="block text-zinc-400 text-[11px] font-bold mb-2 uppercase tracking-wider">Card Number / Routing</label>
                        <input className="w-full bg-zinc-900 border border-white/10 text-zinc-100 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700" placeholder="XXXX-XXXX-XXXX-XXXX" value={payment.accountNumber} onChange={(e) => setPayment({ ...payment, accountNumber: e.target.value })} />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-zinc-400 text-[11px] font-bold mb-2 uppercase tracking-wider">Bank / Institution</label>
                          <input className="w-full bg-zinc-900 border border-white/10 text-zinc-100 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700" placeholder="Chase, BofA..." value={payment.bankName} onChange={(e) => setPayment({ ...payment, bankName: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-zinc-400 text-[11px] font-bold mb-2 uppercase tracking-wider">Billing ZIP / Code</label>
                          <input className="w-full bg-zinc-900 border border-white/10 text-zinc-100 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700" placeholder="10001" value={payment.billingAddress} onChange={(e) => setPayment({ ...payment, billingAddress: e.target.value })} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 flex justify-end">
                      <button onClick={savePayment} className="bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-lg font-bold transition-colors w-full sm:w-auto">
                        Connect Payment Method
                      </button>
                    </div>
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