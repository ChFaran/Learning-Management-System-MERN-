import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock course data matching our backend schema
const MOCK_COURSE = {
  title: "Build an LLM from Scratch",
  modules: [
    {
      id: "m1",
      title: "1. Introduction to Language Models",
      lessons: [
        { id: "l1", title: "Welcome & Setup", type: "video", isInteractive: false, content: "In this module, you'll learn the basics." },
        { id: "l2", title: "Tokenization Fundamentals", type: "text", isInteractive: true, codeTemplate: "def tokenize(text):\n  # Write your tokenizer here\n  pass" }
      ]
    },
    {
      id: "m2",
      title: "2. Attention Mechanisms",
      lessons: [
        { id: "l3", title: "Self-Attention Theory", type: "video", isInteractive: false },
        { id: "l4", title: "Building Multi-Head Attention", type: "code", isInteractive: true, codeTemplate: "class MultiHeadAttention:\n  def __init__(self):\n    pass" }
      ]
    }
  ]
};

export default function CourseViewer() {
  const [activeModuleId, setActiveModuleId] = useState(MOCK_COURSE.modules[0].id);
  const [activeLesson, setActiveLesson] = useState(MOCK_COURSE.modules[0].lessons[0]);
  const [code, setCode] = useState(activeLesson.codeTemplate || "");

  const handleLessonChange = (lesson, moduleId) => {
    setActiveLesson(lesson);
    setActiveModuleId(moduleId);
    setCode(lesson.codeTemplate || "// Write your code here");
  };

  const flatLessons = MOCK_COURSE.modules.flatMap(m => m.lessons.map(l => ({...l, moduleId: m.id})));
  const currentIndex = flatLessons.findIndex(l => l.id === activeLesson.id);
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;

  const handlePrev = () => { if (prevLesson) handleLessonChange(prevLesson, prevLesson.moduleId); };
  const handleNext = () => { if (nextLesson) handleLessonChange(nextLesson, nextLesson.moduleId); };


  return (
    <div className="relative flex h-full w-full bg-transparent text-zinc-300 font-sans overflow-hidden">
      
      {/* COURSERA-STYLE LEFT SIDEBAR (Module Navigation) */}
      <div className="relative z-10 w-80 bg-zinc-950/90 border-r border-zinc-800 flex flex-col backdrop-blur-sm">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold text-white leading-tight">{MOCK_COURSE.title}</h1>
          <p className="text-xs text-[#fd5c36] mt-2 font-mono uppercase tracking-wider">Course Progress: 12%</p>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {MOCK_COURSE.modules.map((mod) => (
            <div key={mod.id} className="border-b border-zinc-900">
              <button 
                className={`w-full text-left p-4 hover:bg-zinc-900 transition-colors flex justify-between items-center ${activeModuleId === mod.id ? 'bg-zinc-900' : ''}`}
                onClick={() => setActiveModuleId(mod.id)}
              >
                <span className="font-semibold text-sm text-zinc-200">{mod.title}</span>
                <span className="text-zinc-500 text-xs">▼</span>
              </button>
              
              <AnimatePresence>
                {activeModuleId === mod.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-zinc-950/50"
                  >
                    {mod.lessons.map(lesson => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonChange(lesson, mod.id)}
                        className={`w-full text-left pl-8 pr-4 py-3 text-sm border-l-2 transition-all flex items-center space-x-3
                          ${activeLesson.id === lesson.id 
                            ? 'border-[#fd5c36] bg-zinc-900 text-white' 
                            : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'}`}
                      >
                         <span className="text-xs">
                          {lesson.type === 'video' ? '▶' : lesson.type === 'text' ? '📄' : '💻'}
                         </span>
                         <span>{lesson.title}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className={`relative z-10 flex-1 flex flex-col overflow-hidden`}>
        
        {/* LEARNING MATERIAL (Video/Text) */}
        <div className={`w-full ${activeLesson.isInteractive ? 'h-1/2 border-b border-zinc-800' : 'h-full'} flex flex-col bg-zinc-950/40 backdrop-blur-[1px] overflow-y-auto`}>
          <div className="p-8">
            <div className="mb-6 flex items-center space-x-2 text-xs font-mono text-zinc-500 uppercase tracking-wider">
              <span>{MOCK_COURSE.modules.find(m => m.id === activeModuleId)?.title}</span>
              <span>/</span>
              <span className="text-[#fd5c36]">{activeLesson.title}</span>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-6">{activeLesson.title}</h2>

            {activeLesson.type === 'video' ? (
              <div className="aspect-video max-w-4xl mx-auto bg-black rounded border border-zinc-800 flex items-center justify-center shadow-2xl relative group overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                 <div className="z-20 w-16 h-16 rounded-full bg-[#fd5c36] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_20px_rgba(253,92,54,0.5)]">
                    <span className="ml-1 text-white text-xl">▶</span>
                 </div>
                 <p className="absolute bottom-4 left-4 z-20 text-sm font-mono text-white">00:00 / 14:32</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-3xl mx-auto text-zinc-400">
                <p>This is the instructional content for {activeLesson.title}. Read the theory carefully before proceeding.</p>
                {activeLesson.isInteractive && (
                  <div className="mt-8 p-4 bg-zinc-900 border border-zinc-800 rounded">
                    <h4 className="text-white font-semibold mb-2">Assignment Task:</h4>
                    <p className="text-sm">Implement the required function in the editor below. Hit 'Run Code' to execute tests.</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-12 flex justify-between items-center pt-6 border-t border-zinc-800 max-w-4xl mx-auto">
               <button 
                 onClick={handlePrev} 
                 disabled={!prevLesson}
                 className={`px-4 py-2 text-sm transition-colors ${prevLesson ? 'text-zinc-500 hover:text-white' : 'text-zinc-800 cursor-not-allowed'}`}
               >
                 ← Previous Lesson
               </button>
               <button 
                 onClick={handleNext} 
                 disabled={!nextLesson}
                 className={`px-6 py-2 rounded text-sm font-bold transition-all ${nextLesson ? 'bg-[#fd5c36] hover:bg-[#ff6f4c] text-white shadow-[0_0_15px_rgba(253,92,54,0.2)]' : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'}`}
               >
                 Next Lesson →
               </button>
            </div>
          </div>
        </div>

        {/* FUTURECODER-STYLE INTERACTIVE IDE (Only if lesson is interactive) */}
        {activeLesson.isInteractive && (
          <div className="w-full h-1/2 flex flex-col bg-[#161616]/85 backdrop-blur-[1px]">
             {/* IDE Header */}
             <div className="h-12 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="text-xs text-zinc-500 font-mono">main.py</div>
                <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-3 py-1 flex items-center space-x-2 rounded transition-colors">
                  <span className="text-green-400">▶</span>
                  <span>Run Code</span>
                </button>
             </div>
             
             {/* Monaco Editor */}
             <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono',
                  padding: { top: 20 },
                  lineHeight: 24,
                  scrollBeyondLastLine: false,
                }}
              />
             </div>
             
             {/* Integrated Terminal / Output (FutureCoder style) */}
             <div className="h-48 bg-black border-t border-zinc-800 flex flex-col">
                <div className="bg-zinc-950 px-4 py-1 text-xs text-zinc-500 font-mono uppercase border-b border-zinc-900 tracking-wider">
                  Terminal Output
                </div>
                <div className="p-4 font-mono text-sm text-zinc-400 overflow-y-auto">
                  $ python main.py<br/>
                  <span className="text-green-400">Waiting for execution...</span>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}