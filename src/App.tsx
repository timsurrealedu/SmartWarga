import { useState } from "react";
import { Sidebar, Role } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { UserDashboard } from "./views/UserDashboard";
import { AdminDashboard } from "./views/AdminDashboard";
import { ArchitectureDoc } from "./views/ArchitectureDoc";
import { AuthView } from "./views/AuthView";

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>("user");
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (role: Role) => {
    setCurrentRole(role);
    setCurrentTab("dashboard");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-canvas font-sans relative">
      <Sidebar 
        currentRole={currentRole} 
        setRole={setCurrentRole}
        currentTab={currentTab}
        setTab={setCurrentTab}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      <div className="flex-1 md:ml-64 flex flex-col h-screen w-full">
        <Header currentRole={currentRole} toggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-canvas selection:bg-primary/30">
           {currentRole === "user" && <UserDashboard currentTab={currentTab} setTab={setCurrentTab} />}
           {currentRole === "admin" && <AdminDashboard currentTab={currentTab} setTab={setCurrentTab} />}
           {currentRole === "docs" && <ArchitectureDoc />}
        </main>
      </div>
    </div>
  );
}

