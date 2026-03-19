import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Upload, Folder, Search, MoreHorizontal, Github, ExternalLink, Trash2, X } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([
    { id: '1', title: 'AI Assistant Dashboard', description: 'React based frontend for our core AI agent infrastructure with real-time UI.', status: 'Active', tech: ['React', 'WebSocket'], url: 'https://github.com/org/ai-dash' },
    { id: '2', title: 'Data Processing Pipeline', description: 'Python worker nodes for ingesting and normalizing user datasets.', status: 'Completed', tech: ['Python', 'Redis'], url: 'https://github.com/org/data-pipe' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', url: '' });

  const handleCreateProject = (e) => {
    e.preventDefault();
    setProjects([{ id: Date.now().toString(), ...newProject, tech: ['New'], status: 'Active' }, ...projects]);
    setIsModalOpen(false);
    setNewProject({ title: '', description: '', url: '' });
  };

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Workspace Projects</h1>
            <p className="text-zinc-400">Manage and upload your team's projects and repositories.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#fd5c36] hover:bg-[#ff7554] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Project
            </button>
            <button className="bg-zinc-800 border border-white/5 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Archive
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <motion.div key={project.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-colors flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/5 text-zinc-400 group-hover:text-white transition-colors">
                  <Folder className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${project.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-white/5'}`}>
                    {project.status}
                  </span>
                  <button onClick={() => handleDelete(project.id)} className="text-zinc-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mb-2">{project.title}</h3>
              <p className="text-sm text-zinc-400 mb-6 flex-1">{project.description}</p>
              
              <div className="flex items-center gap-2 mb-6">
                {project.tech.map(t => (
                  <span key={t} className="text-xs font-medium text-zinc-500 bg-black/50 px-2 py-1 rounded">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <a href={project.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-2 transition-colors">
                  <Github className="w-4 h-4" /> Repository
                </a>
                <button className="text-sm text-[#fd5c36] hover:text-[#ff7858] font-semibold flex items-center gap-1">
                  Open <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-white mb-6">Create New Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Project Title</label>
                  <input required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#fd5c36] outline-none" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} placeholder="Project Alpha" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Description</label>
                  <textarea required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#fd5c36] outline-none h-24 resize-none" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} placeholder="Describe the purpose of this project..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Repository URL</label>
                  <input className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#fd5c36] outline-none" value={newProject.url} onChange={e => setNewProject({...newProject, url: e.target.value})} placeholder="https://github.com/..." />
                </div>
                <div className="pt-4 flex gap-3 justify-end">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-zinc-300 font-medium hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="bg-[#fd5c36] hover:bg-[#ff7554] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-lg shadow-[#fd5c36]/20">Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
