import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CopyPlus, MoreHorizontal, MessageSquare, AlertCircle } from "lucide-react";

const initialData = {
  "Backlog": [
    { id: "LMS-92", title: "Setup S3 object storage", type: "Chore", priority: "Low", owner: "AL" },
    { id: "LMS-95", title: "Document API schema", type: "Docs", priority: "Low", owner: "JD" }
  ],
  "In Progress": [
    { id: "LMS-82", title: "Implement Auth Middleware", type: "Feature", priority: "High", owner: "AL" },
    { id: "LMS-85", title: "Refactor drag/drop UI", type: "UI", priority: "Medium", owner: "SA" }
  ],
  "Review": [
    { id: "LMS-80", title: "Socket.io integration", type: "Feature", priority: "High", owner: "SY" }
  ],
  "Done": [
    { id: "LMS-79", title: "Initialize repository", type: "Chore", priority: "Low", owner: "AL" }
  ]
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialData);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    
    let newCols = { ...columns };
    if (source.droppableId !== destination.droppableId) {
      const sourceCol = [...columns[source.droppableId]];
      const destCol = [...columns[destination.droppableId]];
      const [removed] = sourceCol.splice(source.index, 1);
      destCol.splice(destination.index, 0, removed);
      newCols = { ...columns, [source.droppableId]: sourceCol, [destination.droppableId]: destCol };
    } else {
      const col = [...columns[source.droppableId]];
      const [removed] = col.splice(source.index, 1);
      col.splice(destination.index, 0, removed);
      newCols = { ...columns, [source.droppableId]: col };
    }
    setColumns(newCols);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case 'Medium': return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default: return "text-zinc-400 bg-white/5 border-white/5";
    }
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-56px)] bg-transparent overflow-hidden">
      <div className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-surface/95 shrink-0 backdrop-blur-sm">
         <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-zinc-100">Sprint 42</h1>
            <span className="bg-white/5 text-zinc-400 text-xs px-2 py-0.5 rounded border border-white/5">Jan 12 - Jan 26</span>
         </div>
         <div className="flex items-center gap-3">
             <div className="flex -space-x-2 mr-2">
               {['AL','SY','SA'].map((initial, i) => (
                 <div key={initial} className={`w-6 h-6 rounded-full border border-background flex items-center justify-center text-[9px] font-bold text-white z-${10-i} ${i===0?'bg-blue-600':i===1?'bg-purple-600':'bg-emerald-600'}`}>
                   {initial}
                 </div>
               ))}
             </div>
             <button className="bg-white text-black px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-zinc-200">
               New Issue
             </button>
         </div>
      </div>

      <div className="relative z-10 flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-6 min-w-max h-full items-start">
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.entries(columns).map(([columnId, tasks]) => (
              <div key={columnId} className="w-[320px] flex flex-col h-full max-h-full">
                <div className="flex items-center justify-between mb-3 px-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-13px font-medium text-zinc-300">{columnId}</h3>
                    <span className="text-11px text-zinc-500 font-mono bg-white/5 px-1.5 py-0.5 rounded">{tasks.length}</span>
                  </div>
                  <button className="text-zinc-500 hover:text-zinc-300"><CopyPlus className="w-4 h-4" /></button>
                </div>
                
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 overflow-y-auto custom-scrollbar pt-1 pb-4 min-h-[150px] transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-white/[0.02]' : ''}`}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-3 bg-surface border rounded-lg p-4 transition-all group ${
                                snapshot.isDragging 
                                  ? 'border-accent shadow-2xl scale-[1.02] shadow-accent/10 z-50' 
                                  : 'border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[11px] text-zinc-500 font-mono">{task.id}</span>
                                <button className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-white transition-opacity">
                                  <MoreHorizontal className="w-4 h-4"/>
                                </button>
                              </div>
                              <p className="text-[13px] font-medium text-zinc-200 mb-4 leading-relaxed">
                                {task.title}
                              </p>
                              <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                    {task.type}
                                  </span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                </div>
                                <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-300 border border-white/10">
                                  {task.owner}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {/* Quiet add button at bottom of col */}
                      <button className="w-full mt-2 py-2 flex items-center gap-2 text-zinc-500 text-[13px] font-medium hover:text-zinc-300 hover:bg-white/5 rounded-lg transition-colors px-2">
                         <span className="text-lg leading-none">+</span> Add task
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}