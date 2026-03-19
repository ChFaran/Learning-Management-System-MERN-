import React, { useState } from "react";
import { Search, Bell, HelpCircle, ChevronDown, CheckCircle } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [profilePic, setProfilePic] = useState(
    user?.avatar || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=128"
  );

  const dummyResults = [
    { title: "Course: Build an LLM", type: "Course", path: "/course" },
    { title: "Dashboard Overview", type: "Platform", path: "/dashboard" },
    { title: "My Profile Settings", type: "Account", path: "/profile" },
    { title: "Current Sprint Issues", type: "Kanban", path: "/kanban" },
    { title: "Interactive Workspace", type: "Editor", path: "/learn" },
    { title: "Workspace Projects", type: "Workspace", path: "/projects" },
    { title: "Team Members", type: "Workspace", path: "/members" },
    { title: "System Settings", type: "Platform", path: "/settings" }
  ];

  const filteredResults = dummyResults.filter(item => {
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(Boolean);
    const searchableText = `${item.title} ${item.type}`.toLowerCase();
    return searchTerms.every(term => searchableText.includes(term));
  });

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/": return "Catalog / Courses";
      case "/dashboard": return "Overview / Dashboard";
      case "/course": return "Learning / Course Viewer";
      case "/kanban": return "Projects / Current Sprint";
      case "/learn": return "Workspace / Interactive IDE";
      case "/profile": return "Account / User Profile";
      case "/admin": return "Admin / Operations";
      default: return "Workspace";
    }
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
      alert("Profile picture updated (simulated)!");
    }
  };

  return (
    <header className="h-14 border-b border-white/10 bg-surface flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <h2 className="text-sm font-medium text-zinc-200">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 z-10" />
          <input
            type="text"
            placeholder="Search commands, teams..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            className="bg-transparent border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-xs w-64 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-zinc-200 placeholder:text-zinc-600 relative z-10"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 z-10">
            <kbd className="hidden sm:inline-block bg-white/5 border border-white/10 rounded px-1.5 text-[10px] text-zinc-500 font-mono">⌘</kbd>
            <kbd className="hidden sm:inline-block bg-white/5 border border-white/10 rounded px-1.5 text-[10px] text-zinc-500 font-mono">K</kbd>
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && searchQuery && (
            <div className="absolute top-full left-0 mt-1 w-full bg-zinc-900 border border-white/10 rounded-md shadow-lg py-2 z-50">
              {filteredResults.length > 0 ? (
                filteredResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(result.path);
                      setShowSearchDropdown(false);
                      setSearchQuery("");
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-colors flex items-center justify-between"
                  >
                    <span className="text-zinc-200">{result.title}</span>
                    <span className="text-zinc-500 text-[10px] bg-white/5 px-1.5 py-0.5 rounded">{result.type}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-zinc-500 text-center">
                  No results found.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-zinc-400 border-l border-white/10 pl-5 relative z-10">
          <button className="hover:text-zinc-100 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border border-surface"></span>
          </button>
          <button className="hover:text-zinc-100 transition-colors">
            <HelpCircle className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 ml-2 cursor-pointer hover:bg-white/5 py-1 px-2 rounded-md transition-colors border border-transparent relative group/profile">
            <label className="cursor-pointer flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-accent to-indigo-500 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden relative">
                <img src={profilePic} className="w-full h-full object-cover" alt="Profile" />
                <div className="absolute inset-0 bg-black/50 hidden group-hover/profile:flex items-center justify-center">
                  <span className="text-[8px]">Edit</span>
                </div>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleProfileUpload} />
            </label>
            <Link to="/profile">
              <span className="text-xs text-zinc-300 font-medium hidden sm:inline-block">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}