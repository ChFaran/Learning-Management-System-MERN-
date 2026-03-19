import React, { useState } from "react";
import { CheckCircle2, Circle, Clock, MoreHorizontal, ArrowUpRight, Activity, MoveRight, Users, Plus } from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([
    { id: "LMS-82", title: "Implement Auth Middleware", status: "in-progress", priority: "High" },
    { id: "LMS-81", title: "Migrate database to MongoDB Atlas", status: "completed", priority: "Critical" },
    { id: "LMS-79", title: "Set up WebRTC for classrooms", status: "todo", priority: "High" },
    { id: "LMS-76", title: "Redesign User Profile Settings", status: "todo", priority: "Low" },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showTaskInput, setShowTaskInput] = useState(false);

  const metrics = [
    { title: "Velocity", value: "84", change: "+12%", trend: "up", info: "Points closed this sprint" },
    { title: "Active Issues", value: tasks.filter(t => t.status !== 'completed').length.toString(), change: "-4%", trend: "down", info: "Assigned to team" },
    { title: "Blockers", value: "3", change: "0%", trend: "neutral", info: "Requires immediate action" }
  ];

  const handleGenerateReport = () => {
    alert("Report generation triggered (simulated backend call).");
  };

  const handleNewProject = () => {
    alert("New Project modal opened (simulated action).");
  };

  const handleAddTask = (e) => {
    if (e.key === "Enter" && newTaskTitle.trim() !== "") {
      const newId = `LMS-${Math.floor(Math.random() * 100) + 90}`;
      setTasks([{ id: newId, title: newTaskTitle, status: "todo", priority: "Medium" }, ...tasks]);
      setNewTaskTitle("");
      setShowTaskInput(false);
      alert(`Task ${newId} created!`);
    }
  };

  return (
    <div className="relative p-8 max-w-[1280px] mx-auto pb-20 overflow-hidden">
      <div className="relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100 mb-1">Overview</h1>
          <p className="text-zinc-500 text-sm">Monitor your activity, metrics, and current sprint progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleGenerateReport}
            className="bg-white/5 hover:bg-white/10 text-zinc-300 text-sm font-medium px-4 py-1.5 rounded-md border border-white/10 transition-colors"
          >
            Generate Report
          </button>
          <button 
            onClick={handleNewProject}
            className="bg-white hover:bg-zinc-200 text-black text-sm font-medium px-4 py-1.5 rounded-md transition-colors flex items-center gap-2"
          >
            New Project
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-surface rounded-xl p-5 border border-white/5 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-zinc-400 font-medium text-xs">{metric.title}</h3>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                metric.trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 
                metric.trend === 'down' ? 'text-blue-400 bg-blue-400/10' : 'text-zinc-400 bg-zinc-800'
              }`}>
                {metric.change}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-zinc-100">{metric.value}</p>
            </div>
            <p className="text-[11px] text-zinc-600 mt-2">{metric.info}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-[#0d0d0f]">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium text-zinc-200">Active Issues</h3>
                <button 
                  onClick={() => setShowTaskInput(!showTaskInput)}
                  className="w-5 h-5 bg-white/10 hover:bg-white/20 text-white rounded flex items-center justify-center transition-colors"
                  title="Add Task"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            
            {showTaskInput && (
              <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <input 
                  type="text" 
                  autoFocus
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={handleAddTask}
                  placeholder="Enter task title and press Enter..."
                  className="w-full bg-transparent border border-white/10 rounded-md px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-accent/50"
                />
              </div>
            )}
            
            <div className="divide-y divide-white/5">
              {tasks.map((task, i) => (
                <div key={task.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-zinc-500" />}
                      {task.status === 'in-progress' && <div className="w-4 h-4 rounded-full border-[2px] border-accent border-t-transparent animate-spin-slow"></div>}
                      {task.status === 'todo' && <Circle className="w-4 h-4 text-zinc-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] text-zinc-500 font-mono">{task.id}</span>
                        <h4 className={`text-[13px] font-medium ${task.status === 'completed' ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                          {task.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wide">
                        {task.priority}
                     </span>
                     <button className="text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Space */}
        <div className="space-y-6">
          <div className="bg-surface rounded-xl border border-white/5 p-5">
            <h3 className="text-sm font-medium text-zinc-200 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-500" /> Recent Activity
            </h3>
            <div className="space-y-5 relative before:absolute before:inset-0 before:ml-1.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-white/5">
              {[
                { time: "2h ago", text: "Alex merged PR #42", user: "AL" },
                { time: "4h ago", text: "Task LMS-81 marked completed", user: "SYS" },
                { time: "5h ago", text: "Sarah commented on LMS-79", user: "SA" }
              ].map((activity, i) => (
                 <div key={i} className="relative flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-surface flex items-center justify-center -ml-2.5 z-10 text-[9px] font-bold text-zinc-400">
                      {activity.user}
                    </div>
                    <div>
                      <p className="text-[13px] text-zinc-300">{activity.text}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{activity.time}</p>
                    </div>
                 </div>
              ))}
            </div>
            <button className="w-full mt-4 text-[12px] text-zinc-400 font-medium hover:text-zinc-200 transition-colors text-center">
              View all activity
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}