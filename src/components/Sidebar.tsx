import { Folder, Archive, Settings, Upload, Download, PlusSquare } from 'lucide-react';
import { motion } from 'motion/react';
import Scratchpad from './Scratchpad';

interface SidebarProps {
  currentTab: 'projects' | 'archive' | 'settings';
  onTabChange: (tab: 'projects' | 'archive' | 'settings') => void;
  onCreateProjectClick: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
  onSelectProject: (id: string | null) => void;
}

export default function Sidebar({
  currentTab,
  onTabChange,
  onCreateProjectClick,
  onImportClick,
  onExportClick,
  onSelectProject
}: SidebarProps) {
  const profilePic = "https://lh3.googleusercontent.com/aida-public/AB6AXuB4JWw5hRbxhauhrMHRSosHfz8XHpBAgFWwe8Ff0hleWpjoXn1fapmRsThvFZnQSt-8BdfnBn1yUOVutDAX9u9RKWX1CM-K5QPGbDbd9izH3m6afwjDnG-_A9nLIFpXELPXdhxDmVqATixbvbVwejyHnNhXBSpm8JzZ3FYi3L8gLdvkTTC06k-oNHbhyHYgDSJf2ua07S9C01Nx5ZMBiD7LRJrfCiDTEIql8pZ-CMUrJ9hnyFAaXskDMtNv8XAaCAqBI-I_d5tRPA";

  const navItems = [
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] border-r border-outline-variant bg-surface-container-lowest flex flex-col py-6 z-40 hidden lg:flex">
      {/* Profile Header */}
      <div className="px-6 mb-8">
        <div 
          className="flex items-center gap-3 mb-6 mt-2 cursor-pointer hover:opacity-90"
          onClick={() => {
            onTabChange('projects');
            onSelectProject(null);
          }}
        >
          <img 
            className="w-10 h-10 rounded-none border border-outline-variant object-cover" 
            src={profilePic}
            alt="Noter User Profile"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-serif italic text-xl text-primary leading-tight">Noter.</h3>
            <p className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant opacity-75">Knowledge Base</p>
          </div>
        </div>

        <button 
          onClick={onCreateProjectClick}
          className="w-full bg-primary border border-black text-on-primary px-4 py-2.5 rounded-none font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-2"
        >
          <PlusSquare className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1 shrink-0 mb-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative group">
              {isActive && (
                <motion.div 
                  layoutId="active-nav-line"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-tertiary"
                />
              )}
              <button
                onClick={() => {
                  onTabChange(item.id);
                  onSelectProject(null);
                }}
                className={`w-full px-6 py-3.5 flex items-center gap-4 font-mono text-xs uppercase tracking-widest transition-all duration-200 text-left ${
                  isActive 
                    ? 'text-primary bg-surface-container-high/70 border-r-2 border-black font-bold' 
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                <span>{item.label}</span>
              </button>
            </div>
          );
        })}
      </nav>

      {/* Fleeting Quick Notes Scratchpad Component */}
      <Scratchpad />

      {/* Utility Import/Export */}
      <div className="px-6 pt-4 border-t border-outline-variant/30 mt-4 space-y-1">
        <button 
          onClick={onImportClick}
          className="w-full text-on-surface-variant hover:text-primary px-3 py-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider hover:bg-surface-container-low/40 rounded-none transition-all text-left"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import Config</span>
        </button>
        <button 
          onClick={onExportClick}
          className="w-full text-on-surface-variant hover:text-primary px-3 py-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider hover:bg-surface-container-low/40 rounded-none transition-all text-left"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Config</span>
        </button>
      </div>
    </aside>
  );
}
