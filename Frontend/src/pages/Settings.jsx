import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Shield, Bell, Key, CreditCard, CircleUserRound, Smartphone } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  
  const tabs = [
    { id: 'account', label: 'Account Preferences', icon: CircleUserRound },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'billing', label: 'Billing Details', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-8 border-b border-white/5 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-zinc-400" /> System Settings
          </h1>
          <p className="text-zinc-400 text-sm">Manage your personal account settings, security privileges, and payment methods.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-64 shrink-0">
            <nav className="flex flex-col gap-1">
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'}`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#fd5c36]' : ''}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 bg-surface border border-white/5 rounded-2xl p-8 min-h-[500px]">
            {activeTab === 'account' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-white mb-6">Account Information</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">First Name</label>
                      <input className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 outline-none" defaultValue="Alex" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Last Name</label>
                      <input className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 outline-none" defaultValue="Developer" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Email Address</label>
                    <input className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-zinc-400 outline-none cursor-not-allowed" defaultValue="alex@example.com" readOnly />
                    <p className="mt-1 text-xs text-zinc-600">Email cannot be changed directly. Contact support.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Timezone</label>
                    <select className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 outline-none">
                      <option>(GMT-08:00) Pacific Time</option>
                      <option>(GMT-05:00) Eastern Time</option>
                      <option>(GMT+00:00) UTC</option>
                    </select>
                  </div>
                  <div className="pt-4">
                    <button className="bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-lg font-bold transition-colors">Save Account Details</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-white mb-6">Security & Authentication</h2>
                
                <div className="mb-8 pb-8 border-b border-white/5">
                  <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2"><Key className="w-4 h-4" /> Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Current Password</label>
                      <input type="password" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">New Password</label>
                        <input type="password" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white outline-none" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Confirm Password</label>
                         <input type="password" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white outline-none" />
                      </div>
                    </div>
                    <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors mt-2">Update Password</button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Two-Factor Authentication</h3>
                  <p className="text-sm text-zinc-400 mb-4">Add an additional layer of security to your account by requiring more than just a password to sign in.</p>
                  <button className="bg-[#fd5c36] hover:bg-[#ff7554] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-lg shadow-[#fd5c36]/20">Enable 2FA</button>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-white mb-6">Billing & Payment Methods</h2>
                <div className="bg-zinc-900 border border-white/5 rounded-xl p-5 mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center border border-white/10 text-xs font-bold text-zinc-400">VISA</div>
                    <div>
                      <p className="font-bold text-white text-sm">Visa ending in 4242</p>
                      <p className="text-xs text-zinc-500">Expires 12/2026</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-zinc-400 hover:text-white uppercase transition-colors">Edit</button>
                </div>

                <h3 className="text-sm font-bold text-zinc-200 mb-4">Billing Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Street Address</label>
                    <input className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white outline-none" defaultValue="123 Tech Lane" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">City</label>
                      <input className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white outline-none" defaultValue="San Francisco" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Postal Code</label>
                       <input className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white outline-none" defaultValue="94105" />
                    </div>
                  </div>
                  <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors mt-2">Save Billing Details</button>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Platform Updates', desc: 'Receive updates about new features and changes.' },
                    { label: 'Course Announcements', desc: 'Get notified when new courses are published.' },
                    { label: 'Security Alerts', desc: 'Crucial security notifications regarding your account.' },
                    { label: 'Project Mentions', desc: 'When someone tags you in a workspace project.' }
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div>
                        <p className="font-semibold text-zinc-200 text-sm">{notif.label}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{notif.desc}</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" defaultChecked={i !== 1} />
                        <div className={`w-10 h-5 rounded-full transition-colors ${i !== 1 ? 'bg-[#fd5c36]' : 'bg-zinc-700'}`}>
                          <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform ${i !== 1 ? 'left-[22px]' : 'left-[3px]'}`}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
