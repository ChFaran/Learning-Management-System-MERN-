import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, GitCommit, CheckSquare, Activity } from 'lucide-react';

export default function Members() {
  const [members, setMembers] = useState([
    { id: '1', name: 'Alex Developer', role: 'Frontend Lead', avatar: 'https://i.pravatar.cc/100?img=11', projects: [
      { name: 'AI Assistant Dashboard', commits: 142, tasks: 28, impact: 85 },
      { name: 'Component Library', commits: 64, tasks: 12, impact: 60 }
    ]},
    { id: '2', name: 'Sam Backend', role: 'Backend Engineer', avatar: 'https://i.pravatar.cc/100?img=33', projects: [
      { name: 'Data Processing Pipeline', commits: 210, tasks: 45, impact: 92 },
      { name: 'Auth Service', commits: 32, tasks: 8, impact: 50 },
      { name: 'AI Assistant Dashboard', commits: 18, tasks: 4, impact: 15 }
    ]},
    { id: '3', name: 'Taylor Design', role: 'Product Designer', avatar: 'https://i.pravatar.cc/100?img=47', projects: [
      { name: 'AI Assistant Dashboard', commits: 0, tasks: 34, impact: 70 },
      { name: 'Mobile App V2', commits: 0, tasks: 56, impact: 88 }
    ]}
  ]);

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Team Members</h1>
            <p className="text-zinc-400">View project members and their individual contributions.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search members..." 
              className="bg-surface border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 w-full sm:w-64 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {members.map((member, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.1 }}
              key={member.id} 
              className="bg-surface border border-white/5 rounded-2xl p-6"
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Member Identity */}
                <div className="w-full md:w-64 shrink-0 flex items-center gap-4 border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0 md:pr-6">
                  <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full object-cover border border-white/10" />
                  <div>
                    <h2 className="text-lg font-bold text-white">{member.name}</h2>
                    <span className="text-sm font-medium text-[#fd5c36]">{member.role}</span>
                  </div>
                </div>

                {/* Project Contributions */}
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {member.projects.map((proj, pIdx) => (
                    <div key={pIdx} className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-bold text-zinc-200">{proj.name}</h4>
                        <div className="flex items-center gap-1 text-xs font-bold text-zinc-500">
                          <Activity className="w-3 h-3 text-emerald-500" />
                          Impact: {proj.impact}%
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="bg-white/5 p-1.5 rounded-md"><GitCommit className="w-4 h-4 text-zinc-400" /></div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-zinc-500">Commits</p>
                            <p className="text-sm font-semibold text-white">{proj.commits}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-white/5 p-1.5 rounded-md"><CheckSquare className="w-4 h-4 text-zinc-400" /></div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-zinc-500">Tasks Done</p>
                            <p className="text-sm font-semibold text-white">{proj.tasks}</p>
                          </div>
                        </div>
                        
                        {/* Mini progress bar visualization */}
                        <div className="flex-1 max-w-[100px] ml-auto">
                          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${proj.impact}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
