'use client';

import { useState } from 'react';

interface SidebarProps {
  onItemClick: (component: 'agents' | 'nodes') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const [selectedItem, setSelectedItem] = useState<'agents' | 'nodes' | null>(null);

  const handleItemClick = (item: 'agents' | 'nodes') => {
    setSelectedItem(item);
    onItemClick(item);
  };

  const getButtonClass = (item: 'agents' | 'nodes') => {
    return `w-full text-left pl-8 pr-4 py-4 text-[#FAFAFB] transition-colors duration-200 text-xl font-semibold
      ${selectedItem === item ? 'bg-[#1A1A28]' : 'hover:bg-[#1A1A28]'}`;
  };

  return (
    <aside className="w-64 bg-[#0A0A18] flex flex-col h-full">
      <nav className="flex-1">
        <ul className="space-y-5 pt-7">
          <li>
            <button
              className={getButtonClass('agents')}
              onClick={() => handleItemClick('agents')}
            >
              Agents
            </button>
          </li>
          <li>
            <button
              className={getButtonClass('nodes')}
              onClick={() => handleItemClick('nodes')}
            >
              Nodes
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;