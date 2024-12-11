import React from 'react';
import { LucideIcon, LogOut } from 'lucide-react';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  walletAddress?: string;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export default function Sidebar({ menuItems, walletAddress, onLogout, onNavigate, currentView }: SidebarProps) {
  return (
    <div className="w-64 bg-black border-r border-[#c4ff9e] flex flex-col">
      <div className="flex flex-col items-center justify-center h-24 border-b border-[#c4ff9e]">
        <h1 className="text-2xl font-bold text-[#c4ff9e] mb-2">Soolock</h1>
        {walletAddress && (
          <p className="text-xs text-[#c4ff9e] truncate w-48">
            {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </p>
        )}
      </div>
      <nav className="mt-6 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.href}
            onClick={() => onNavigate(item.href)}
            className={`w-full flex items-center px-6 py-3 text-[#c4ff9e] hover:bg-[#c4ff9e]/10 transition-all duration-200 ${
              currentView === item.href ? 'bg-[#c4ff9e]/10 border-r-4 border-[#c4ff9e]' : ''
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="mx-3">{item.label}</span>
          </button>
        ))}
      </nav>
      <button
        onClick={onLogout}
        className="flex items-center px-6 py-4 text-[#c4ff9e] hover:bg-[#c4ff9e]/10 transition-all duration-200 border-t border-[#c4ff9e]"
      >
        <LogOut className="h-5 w-5" />
        <span className="mx-3">Logout</span>
      </button>
    </div>
  );
}