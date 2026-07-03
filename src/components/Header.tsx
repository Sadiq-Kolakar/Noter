import { Search, Plus, Upload, Download, ArrowLeft, Menu, X, Folder, Archive, Settings } from 'lucide-react';
import Scratchpad from './Scratchpad';

interface HeaderProps {
  currentTab: 'projects' | 'archive' | 'settings';
  onTabChange: (tab: 'projects' | 'archive' | 'settings') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewProjectClick: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
  selectedProjectId: string | null;
  onBackToProjects: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export default function Header({
  currentTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onNewProjectClick,
  onImportClick,
  onExportClick,
  selectedProjectId,
  onBackToProjects,
  mobileMenuOpen,
  onToggleMobileMenu,
}: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-outline-variant bg-surface/90 flex justify-between items-center px-6 h-16">
      {/* Brand & Tabs */}
      <div className="flex items-baseline gap-8">
        <div 
          onClick={onBackToProjects}
          className="flex items-baseline gap-2 cursor-pointer active:opacity-80"
        >
          <span className="font-serif italic text-2xl text-primary tracking-tight">Noter.</span>
          <span className="text-[9px] uppercase tracking-[0.3em] font-black opacity-30 hidden sm:inline">Archives</span>
        </div>

        {/* Desktop Top Tabs */}
        <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-bold">
          <button 
            onClick={() => { onTabChange('projects'); onBackToProjects(); }}
            className={`py-1 transition-all border-b cursor-pointer ${
              currentTab === 'projects' && !selectedProjectId
                ? 'text-primary border-primary' 
                : 'text-on-surface-variant/70 hover:text-primary border-transparent hover:border-primary/30'
            }`}
          >
            Projects
          </button>
          <button 
            onClick={() => { onTabChange('archive'); onBackToProjects(); }}
            className={`py-1 transition-all border-b cursor-pointer ${
              currentTab === 'archive'
                ? 'text-primary border-primary' 
                : 'text-on-surface-variant/70 hover:text-primary border-transparent hover:border-primary/30'
            }`}
          >
            Archive
          </button>
          <button 
            onClick={() => { onTabChange('settings'); onBackToProjects(); }}
            className={`py-1 transition-all border-b cursor-pointer ${
              currentTab === 'settings'
                ? 'text-primary border-primary' 
                : 'text-on-surface-variant/70 hover:text-primary border-transparent hover:border-primary/30'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Middle Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl mx-6">
        {selectedProjectId ? (
          <button 
            onClick={onBackToProjects}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-surface border border-outline-variant text-primary font-mono text-xs transition-colors active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[10px]">Back to Explorer</span>
          </button>
        ) : (
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4 opacity-70" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search repositories..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-none pl-10 pr-4 py-2 font-mono text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs font-mono font-medium"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1">
          <button 
            onClick={onImportClick}
            className="p-2 text-on-surface-variant hover:text-primary rounded-none hover:bg-surface-container-low transition-colors"
            title="Import Backup"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button 
            onClick={onExportClick}
            className="p-2 text-on-surface-variant hover:text-primary rounded-none hover:bg-surface-container-low transition-colors"
            title="Export Backup"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        <button 
          onClick={onNewProjectClick}
          className="bg-primary text-on-primary px-4 py-2 rounded-none border border-black text-[11px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5 hover:bg-surface hover:text-primary transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Project</span>
        </button>

        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={onToggleMobileMenu}
          className="p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-low md:hidden transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer (Overlay) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background/95 z-40 flex flex-col p-6 space-y-6 md:hidden border-t border-outline-variant backdrop-blur-md">
          <div className="space-y-2">
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest pl-2">Navigation</p>
            <button
              onClick={() => { onTabChange('projects'); onBackToProjects(); onToggleMobileMenu(); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-mono text-sm ${
                currentTab === 'projects' && !selectedProjectId
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <Folder className="w-4 h-4" />
              <span>Projects</span>
            </button>
            <button
              onClick={() => { onTabChange('archive'); onBackToProjects(); onToggleMobileMenu(); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-mono text-sm ${
                currentTab === 'archive'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Archive</span>
            </button>
            <button
              onClick={() => { onTabChange('settings'); onBackToProjects(); onToggleMobileMenu(); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left font-mono text-sm ${
                currentTab === 'settings'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          <div className="border-t border-outline-variant/30 pt-6 space-y-2">
            <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest pl-2">System Config</p>
            <button 
              onClick={() => { onImportClick(); onToggleMobileMenu(); }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left text-on-surface-variant hover:bg-surface-container-low font-mono text-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Import Config JSON</span>
            </button>
            <button 
              onClick={() => { onExportClick(); onToggleMobileMenu(); }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left text-on-surface-variant hover:bg-surface-container-low font-mono text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export Config JSON</span>
            </button>
          </div>

          <div className="border-t border-outline-variant/30 pt-4 overflow-y-auto">
            <Scratchpad />
          </div>
        </div>
      )}
    </header>
  );
}
