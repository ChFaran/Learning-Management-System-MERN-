import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import CodingEnvironment from "./pages/CodingEnvironment";
import CourseViewer from "./pages/CourseViewer";
import KanbanBoard from "./pages/KanbanBoard";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import UserProfile from "./pages/UserProfile";
import AdminProfile from "./pages/AdminProfile";
import Projects from "./pages/Projects";
import Members from "./pages/Members";
import Settings from "./pages/Settings";
import Global3DBackground from "./components/Global3DBackground";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedShell = ({ children }) => {
  const location = useLocation();
  const isCourse = location.pathname === '/course';

  return (
    <div className="relative flex h-screen bg-transparent text-zinc-300 font-sans overflow-hidden">
      <div className="relative z-10 flex h-full w-full">
        {!isCourse && <Navigation />}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent relative">
            <div className="h-full w-full max-w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return <ProtectedShell>{children}</ProtectedShell>;
};

const RoleProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return <ProtectedShell>{children}</ProtectedShell>;
};

const PlaceholderPage = ({ title }) => (
  <div className="p-8 text-white max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <p className="text-zinc-400">This module is currently under development.</p>
  </div>
);

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Global3DBackground />
      <div className="relative z-10 w-full h-full">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} />
              <Route path="/profile" element={<RoleProtectedRoute roles={["Registered", "Admin"]}><UserProfile /></RoleProtectedRoute>} />
              <Route path="/admin" element={<RoleProtectedRoute roles={["Admin"]}><AdminProfile /></RoleProtectedRoute>} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/learn" element={<ProtectedRoute><CodingEnvironment /></ProtectedRoute>} />
              <Route path="/course" element={<ProtectedRoute><CourseViewer /></ProtectedRoute>} />
              <Route path="/kanban" element={<ProtectedRoute><KanbanBoard /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Routes>
          </Router>
        </AuthProvider>
      </div>
    </div>
  );
}

export default App;
