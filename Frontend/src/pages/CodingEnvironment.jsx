import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, PlayCircle, Loader2, Maximize2, X, TerminalSquare, FileJson, Files } from "lucide-react";

export default function CodingEnvironment() {
  const [code, setCode] = useState("/**\n * System Authentication Module\n * Environment: Node.js (V8 Sandbox)\n */\n\nfunction authenticateUser(token) {\n  if (!token) {\n    throw new Error('Authentication failed: No token provided');\n  }\n  \n  // TODO: Verify token signature here\n  return {\n    status: 200,\n    message: 'User authenticated successfully',\n    user: 'sys_admin'\n  };\n}\n\ntry {\n  const result = authenticateUser('Bearer abc123xyz');\n  console.log(result);\n} catch (err) {\n  console.error(err.message);\n}");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("auth.js");
  
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("");
    setTimeout(() => {
      setOutput("Running process: node auth.js\n\n{ status: 200,\n  message: 'User authenticated successfully',\n  user: 'sys_admin' }\n\nProcess exited with status 0.");
      setIsRunning(false);
    }, 800);
  };

  return (
    <div className="relative flex h-[calc(100vh-56px)] bg-transparent overflow-hidden">
      {/* Tiny File Sidebar */}
      <div className="relative z-10 w-12 border-r border-white/5 bg-[#0f0f11]/95 flex flex-col items-center py-4 gap-4 hidden md:flex shrink-0 backdrop-blur-sm">
         <button className="text-zinc-400 hover:text-zinc-100"><Files className="w-5 h-5" /></button>
         <button className="text-zinc-600 hover:text-zinc-400"><SearchIcon className="w-5 h-5" /></button>
         <button className="text-zinc-600 hover:text-zinc-400 mt-auto"><SettingsIcon className="w-5 h-5" /></button>
      </div>

      {/* Explorer Panel */}
      <div className="relative z-10 w-[220px] bg-surface/95 border-r border-white/5 flex flex-col shrink-0 hidden lg:flex backdrop-blur-sm">
         <div className="p-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest border-b border-white/5 flex justify-between items-center">
            Explorer
         </div>
         <div className="flex-1 py-2">
            <div className="px-3 py-1 flex items-center gap-2 text-[12px] text-zinc-300 font-medium">
               <span className="text-blue-400 text-sm">📁</span> src
            </div>
            <div className={`px-3 py-1 pl-7 flex items-center gap-2 text-[12px] cursor-pointer ${activeTab === 'auth.js' ? 'bg-white/5 text-accent' : 'text-zinc-400 hover:bg-white/[0.02]'}`}>
               <div className="w-3 h-3 text-yellow-400 font-bold flex items-center justify-center text-[10px]">JS</div> auth.js
            </div>
            <div className={`px-3 py-1 pl-7 flex items-center gap-2 text-[12px] cursor-pointer ${activeTab === 'app.json' ? 'bg-white/5 text-accent' : 'text-zinc-400 hover:bg-white/[0.02]'}`}>
               <FileJson className="w-3 h-3 text-zinc-500" /> app.json
            </div>
         </div>
      </div>

      {/* Main Editor Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 bg-[#09090b]/96 backdrop-blur-[1px]">
        {/* Editor Tabs & Actions */}
        <div className="flex items-center justify-between bg-surface border-b border-white/5">
          <div className="flex">
            <div className="px-4 py-2 border-r border-white/5 border-b-[2px] border-b-accent flex items-center gap-2 bg-[#09090b] text-[12px] text-zinc-200 cursor-pointer">
              <div className="w-3 h-3 text-yellow-400 font-bold flex items-center justify-center text-[10px]">JS</div> auth.js
              <X className="w-3 h-3 ml-2 text-zinc-500 hover:text-white" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3">
            <button 
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50"
            >
              {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
              {isRunning ? "Running" : "Run Code"}
            </button>
          </div>
        </div>
        
        {/* Monaco Instance */}
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v || "")}
            options={{
              minimap: { enabled: false },
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: 13,
              lineHeight: 22,
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              renderLineHighlight: "none",
              cursorBlinking: "smooth",
              matchBrackets: "near",
            }}
          />
        </div>

        {/* Integrated Terminal */}
        <div className="h-[280px] bg-background border-t border-white/5 flex flex-col shrink-0 text-zinc-300">
          <div className="flex items-center px-4 py-1.5 border-b border-white/5 bg-surface text-[11px] gap-4 font-medium">
            <button className="text-zinc-200 border-b border-transparent pb-1 mt-1 hover:text-white">Terminal</button>
            <button className="text-zinc-500 border-b border-transparent pb-1 mt-1 hover:text-zinc-300">Output</button>
            <button className="text-zinc-500 border-b border-transparent pb-1 mt-1 hover:text-zinc-300">Problems</button>
            
            <div className="ml-auto flex items-center gap-3">
               <Maximize2 className="w-3 h-3 text-zinc-500 cursor-pointer hover:text-zinc-300" />
               <X className="w-3 h-3 text-zinc-500 cursor-pointer hover:text-zinc-300" />
            </div>
          </div>
          <div className="p-3 font-mono text-[12px] flex-1 overflow-y-auto custom-scrollbar">
             <div className="text-zinc-500 mb-2">PS C:\Workspace\FutureLMS\sandbox&gt; node auth.js</div>
             <div className="whitespace-pre-wrap text-zinc-300">{output}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons for Sidebar
function SearchIcon({ className }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
}
function SettingsIcon({ className }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
}