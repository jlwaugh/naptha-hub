'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Agents from './components/Agents';
import Nodes from './components/Nodes';
import Home from './components/Home';

export default function Main() {
  const [activeComponent, setActiveComponent] = useState<'agents' | 'nodes' | null>(null);
  const [scriptToRun, setScriptToRun] = useState<string | null>(null);

  const handleSidebarClick = (component: 'agents' | 'nodes') => {
    setActiveComponent(component);
    setScriptToRun(component === 'agents' ? 'get_agents.py' : 'get_nodes.py');
  };

  const renderDefaultView = () => <Home />;

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onItemClick={handleSidebarClick} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#FAFAFB]">
          {activeComponent === 'agents' && <Agents scriptToRun={scriptToRun} />}
          {activeComponent === 'nodes' && <Nodes scriptToRun={scriptToRun} />}
          {activeComponent === null && renderDefaultView()}
        </main>
      </div>
    </div>
  );
}