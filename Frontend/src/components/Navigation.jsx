import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Terminal, 
  LayoutGrid, 
  Layers, 
  Settings, 
  Users,
  FolderDot,
  House,
  UserCircle,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navigation() {
  const location = useLocation();
  const { user } = useAuth();

  const navGroups = [
    {
      title: "Platform",
      items: [
        { path: "/", name: "Catalog", icon: <House className="w-[18px] h-[18px]" /> },
        { path: "/dashboard", name: "Overview", icon: <LayoutGrid className="w-[18px] h-[18px]" /> },
        { path: "/course", name: "Course Viewer", icon: <Layers className="w-[18px] h-[18px]" /> },
        { path: "/kanban", name: "Issues", icon: <Layers className="w-[18px] h-[18px]" /> },
        { path: "/learn", name: "Editor", icon: <Terminal className="w-[18px] h-[18px]" /> },
        { path: "/profile", name: "My Profile", icon: <UserCircle className="w-[18px] h-[18px]" /> },
        ...(user?.role === "Admin" ? [{ path: "/admin", name: "Admin", icon: <ShieldCheck className="w-[18px] h-[18px]" /> }] : []),
      ]
    },
    {
      title: "Workspace",
      items: [
        { path: "/projects", name: "Projects", icon: <FolderDot className="w-[18px] h-[18px]" /> },
        { path: "/members", name: "Members", icon: <Users className="w-[18px] h-[18px]" /> },
      ]
    }
  ];

  return (
    <aside className="w-[240px] bg-surface border-r border-white/5 flex flex-col h-full shrink-0 z-30 font-sans">
      {/* Brand Header */}
      <div className="h-14 px-5 flex items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded-[4px] flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-black rounded-sm"></div>
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-100">FutureLMS</span>
          <span className="bg-white/10 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded font-medium ml-1">Beta</span>
        </div>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-5 px-3 custom-scrollbar flex flex-col gap-6">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest px-2 mb-2">
              {group.title}
            </h4>
            <nav className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.name}
                    to={item.path} 
                    className={`flex items-center gap-3 px-2 py-1.5 rounded-md text-[13px] font-medium transition-all group ${
                      isActive 
                      ? "bg-white/10 text-zinc-100" 
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                    }`}
                  >
                    <span className={`transition-colors ${isActive ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer / Settings */}
      <div className="p-3 border-t border-white/5">
        <Link to="/settings" className="flex items-center gap-3 px-2 py-1.5 rounded-md text-[13px] font-medium text-zinc-400 hover:bg-white/5 hover:text-zinc-200 transition-colors">
           <Settings className="w-[18px] h-[18px] text-zinc-500" />
           Settings
        </Link>
      </div>
    </aside>
  );
}