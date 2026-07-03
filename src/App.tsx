import React, { useState, useEffect, useRef } from 'react';
import { 
  Grid, List, Folder, Archive, Settings, Plus, RefreshCw, 
  Upload, Download, Radio, Wifi, Database, Search, ArrowRight, Check, Play, LogIn, Sparkles, HelpCircle, HardDrive
} from 'lucide-react';
import { INITIAL_PROJECTS, Project } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProjectCard from './components/ProjectCard';
import ProjectDetails from './components/ProjectDetails';
import NewProjectModal from './components/NewProjectModal';
import Toast from './components/Toast';
import HighlightText from './components/HighlightText';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Database / Project List State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('noter_projects_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load local projects database:", e);
      }
    }
    return INITIAL_PROJECTS;
  });

  // Save projects to local storage on update
  useEffect(() => {
    localStorage.setItem('noter_projects_v2', JSON.stringify(projects));
  }, [projects]);

  // Tab and view state
  const [currentTab, setCurrentTab] = useState<'projects' | 'archive' | 'settings'>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // UI states
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; iconType: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emptyToggleState, setEmptyToggleState] = useState(false); // Used to toggle simulated empty state like onclick="toggleView('empty')" in mockup

  // File import ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick toast helper
  const showToast = (message: string, iconType: string) => {
    setToast({ message, iconType });
  };

  // Get active selected project object
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Count active vs archived projects
  const activeProjectsCount = projects.filter(p => !p.isArchived).length;
  const archivedProjectsCount = projects.filter(p => p.isArchived).length;

  // Filter projects by current search query and tab state
  const filteredProjects = projects.filter(p => {
    // Determine archive status filter
    const matchesTab = currentTab === 'archive' ? p.isArchived : !p.isArchived;
    if (!matchesTab) return false;

    // Filter by empty state toggle (for demo mockup purposes)
    if (emptyToggleState && currentTab === 'projects') return false;

    // Search query filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = p.title.toLowerCase().includes(query);
    const descMatch = p.description.toLowerCase().includes(query);
    const tagMatch = p.tags?.some(t => t.toLowerCase().includes(query)) || false;
    const depMatch = p.dependencies?.some(d => d.name.toLowerCase().includes(query) || d.type.toLowerCase().includes(query)) || false;
    
    return titleMatch || descMatch || tagMatch || depMatch;
  });

  // Action: Create Project
  const handleSaveNewProject = (title: string, description: string) => {
    const isNameTaken = projects.some(p => p.title.toLowerCase() === title.toLowerCase());
    if (isNameTaken) {
      showToast("A project with this title already exists", "alert-circle");
      return;
    }

    const newProj: Project = {
      id: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      description,
      phases: 2,
      progress: 0,
      lastUpdated: 'Just now',
      icon: 'terminal',
      iconType: 'terminal',
      isArchived: false,
      dependencies: [],
      documentation: [],
      integrations: []
    };

    setProjects([newProj, ...projects]);
    setShowModal(false);
    showToast(`Created project "${title}"`, "sparkles");
  };

  // Action: Update Project
  const handleUpdateProject = (updatedProj: Project) => {
    setProjects(projects.map(p => p.id === updatedProj.id ? updatedProj : p));
  };

  // Action: Toggle Favorite
  const handleToggleFavorite = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const nextState = !p.isFavorite;
        showToast(nextState ? `Starred "${p.title}"` : `Unstarred "${p.title}"`, "refresh-cw");
        return { ...p, isFavorite: nextState };
      }
      return p;
    }));
  };

  // Action: Toggle Archive status (or delete in simple terms)
  const handleArchiveProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        const nextArchived = !p.isArchived;
        showToast(
          nextArchived 
            ? `Archived project "${p.title}"` 
            : `Restored project "${p.title}" to explorer`, 
          "trash"
        );
        return { ...p, isArchived: nextArchived };
      }
      return p;
    }));
  };

  // Action: Reset Database to original 12 Gorgeous Projects
  const handleResetDatabase = () => {
    if (window.confirm("Restore entire Noter workspace to default seed data? This replaces custom entries.")) {
      setProjects(INITIAL_PROJECTS);
      setSelectedProjectId(null);
      setCurrentTab('projects');
      showToast("Workspace database fully restored", "refresh-cw");
    }
  };

  // Action: Export entire database as JSON file
  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(projects, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'noter_knowledge_base.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      showToast("Config JSON downloaded", "check");
    } catch (e) {
      console.error(e);
      showToast("Failed to download config", "alert-circle");
    }
  };

  // Action: Import JSON Handler
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedData)) {
          // Perform basic validation
          const isValid = importedData.every(item => item.id && item.title && Array.isArray(item.dependencies));
          if (isValid) {
            setProjects(importedData);
            showToast(`Merged ${importedData.length} projects successfully`, "import");
          } else {
            showToast("Invalid JSON file schema", "alert-circle");
          }
        } else {
          showToast("JSON must be a projects array", "alert-circle");
        }
      } catch (err) {
        showToast("Failed to parse JSON file", "alert-circle");
      }
    };
    fileReader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans selection:bg-primary/30">
      
      {/* Invisible File Input for Configuration Import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".json" 
        className="hidden" 
      />

      {/* Persistent Sticky Top Header Navigation */}
      <Header 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewProjectClick={() => setShowModal(true)}
        onImportClick={handleImportClick}
        onExportClick={handleExportJSON}
        selectedProjectId={selectedProjectId}
        onBackToProjects={() => setSelectedProjectId(null)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Sidebar - Visible on Desktop only (width 240px) */}
      <Sidebar 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onCreateProjectClick={() => setShowModal(true)}
        onImportClick={handleImportClick}
        onExportClick={handleExportJSON}
        onSelectProject={setSelectedProjectId}
      />

      {/* Main Container */}
      <main className="lg:ml-[240px] pt-16 min-h-screen pb-12 relative overflow-hidden">
        
        {/* Ambient atmospheric gradients behind layout */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-[1200px] mx-auto p-6 lg:p-8">
          
          <AnimatePresence mode="wait">
            {selectedProjectId && selectedProject ? (
              /* Subpage: Tech Stack Project Details */
              <motion.div
                key="project-detail-subpage"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectDetails 
                  project={selectedProject}
                  onUpdateProject={handleUpdateProject}
                  onBack={() => setSelectedProjectId(null)}
                  onShowToast={showToast}
                />
              </motion.div>
            ) : currentTab === 'projects' || currentTab === 'archive' ? (
              /* Main View: Projects List/Grid Explorer */
              <motion.div
                key="projects-explorer-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-outline-variant pb-4">
                  <div>
                    <h1 className="font-serif italic font-medium text-4xl text-on-surface tracking-tight">
                      {currentTab === 'archive' ? 'Archived Collections' : 'Active Projects'}
                    </h1>
                    <p className="text-on-surface-variant text-xs mt-2 uppercase tracking-widest opacity-60">
                      {currentTab === 'archive' 
                        ? `Historical archives preserving ${archivedProjectsCount} collections.`
                        : `Managing ${activeProjectsCount} active knowledge repositories.`
                      }
                    </p>
                  </div>

                  {/* Layout Grid/List View Toggles */}
                  <div className="flex items-center gap-1.5 bg-surface border border-outline-variant select-none p-1">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 transition-all cursor-pointer rounded-none ${
                        viewMode === 'grid' 
                          ? 'bg-primary text-on-primary font-bold' 
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      title="Grid Layout"
                    >
                      <Grid className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 transition-all cursor-pointer rounded-none ${
                        viewMode === 'list' 
                          ? 'bg-primary text-on-primary font-bold' 
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      title="List Layout"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Grid vs List View Rendering */}
                {filteredProjects.length > 0 ? (
                  viewMode === 'grid' ? (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      <AnimatePresence mode="popLayout">
                        {filteredProjects.map((p) => (
                          <motion.div 
                            key={p.id} 
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className={p.isWide ? "md:col-span-2" : ""}
                          >
                            <ProjectCard 
                              project={p}
                              searchQuery={searchQuery}
                              onSelect={setSelectedProjectId}
                              onToggleFavorite={handleToggleFavorite}
                              onDelete={handleArchiveProject}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                     /* Detailed List View Mode */
                    <motion.div layout className="border border-outline-variant rounded-none overflow-hidden divide-y divide-outline-variant/40 bg-surface">
                      <AnimatePresence mode="popLayout">
                        {filteredProjects.map((p) => (
                          <motion.div 
                            key={p.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setSelectedProjectId(p.id)}
                            className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-neutral-100/20 cursor-pointer transition-all group"
                          >
                            <div>
                              <div className="flex items-center gap-2.5 mb-1">
                                <span className="w-1.5 h-1.5 rounded-none bg-tertiary" />
                                <h3 className="font-serif italic font-bold text-base text-on-surface group-hover:text-tertiary transition-colors">
                                  <HighlightText text={p.title} query={searchQuery} />
                                </h3>
                                <span className="text-[9px] font-mono bg-surface-container-highest px-1.5 py-0.5 border border-outline-variant rounded-none text-on-surface-variant font-bold">
                                  {p.phases} PHASES
                                </span>
                              </div>
                              <p className="text-xs text-on-surface-variant line-clamp-1 max-w-2xl pl-4">
                                <HighlightText text={p.description} query={searchQuery} />
                              </p>
                            </div>

                            <div className="flex items-center gap-4 self-end sm:self-auto pl-4 sm:pl-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider">Progress</span>
                                <div className="w-24 h-1 bg-surface-container-highest rounded-none overflow-hidden">
                                  <div className="h-full bg-primary" style={{ width: `${p.progress}%` }} />
                                </div>
                                <span className="font-mono text-xs text-primary font-bold min-w-[30px] text-right">
                                  {p.progress}%
                                </span>
                              </div>

                              <span className="font-mono text-[10px] text-on-surface-variant/50 uppercase tracking-widest hidden md:inline">
                                Last updated: {p.lastUpdated}
                              </span>

                              <button 
                                onClick={(e) => { e.stopPropagation(); handleArchiveProject(p.id, e); }}
                                className="p-1 rounded-none hover:bg-surface-container-high text-on-surface-variant hover:text-error transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                              >
                                <Archive className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )
                ) : (
                  /* Elegant Empty State Card */
                  <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-outline-variant rounded-none bg-surface">
                    <div className="w-16 h-16 rounded-none bg-surface flex items-center justify-center text-on-surface-variant mb-4 border border-outline-variant">
                      <Folder className="w-6 h-6 text-on-surface-variant/80" />
                    </div>
                    <h2 className="font-serif italic text-2xl text-on-surface font-semibold">Zero collections found</h2>
                    <p className="text-on-surface-variant max-w-sm mt-2 mb-6 text-xs leading-relaxed">
                      {searchQuery 
                        ? `No results match "${searchQuery}". Try editing the filters or checking spelling.`
                        : `Your engineering knowledge base is looking a bit light. Start a new project to document your tech stack.`
                      }
                    </p>
                    <button 
                      onClick={() => {
                        if (searchQuery) {
                          setSearchQuery('');
                        } else {
                          setShowModal(true);
                        }
                      }}
                      className="bg-primary text-on-primary border border-black px-5 py-2.5 rounded-none font-mono text-xs uppercase tracking-widest flex items-center gap-1.5 hover:bg-white hover:text-primary transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{searchQuery ? "Clear Search Filter" : "Create Your First Project"}</span>
                    </button>
                  </div>
                )}

                {/* SWITCHER FOR DEMO/MOCKUP PURPOSES (As seen in the HTML mockup onclick="toggleView('empty')") */}
                <div className="flex justify-end gap-2 pt-6 opacity-30 hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEmptyToggleState(false); showToast("Mock database view restored", "check"); }}
                    className={`px-3 py-1 bg-surface-container text-[10px] rounded border border-outline-variant transition-colors ${!emptyToggleState ? 'text-primary border-primary' : 'text-on-surface-variant'}`}
                  >
                    Show Data
                  </button>
                  <button 
                    onClick={() => { setEmptyToggleState(true); showToast("Mock empty state loaded", "trash"); }}
                    className={`px-3 py-1 bg-surface-container text-[10px] rounded border border-outline-variant transition-colors ${emptyToggleState ? 'text-primary border-primary' : 'text-on-surface-variant'}`}
                  >
                    Show Empty
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Screen Tab: Settings Hub */
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8 max-w-2xl"
              >
                <div className="border-b border-outline-variant/30 pb-4">
                  <h1 className="font-display font-bold text-3xl text-on-surface tracking-tight">Settings</h1>
                  <p className="text-on-surface-variant text-sm mt-1">Configure your Noter offline knowledge base settings and telemetry properties.</p>
                </div>

                <div className="space-y-6">
                  {/* System Statistics */}
                  <div className="bg-surface-container-low border border-outline-variant rounded-lg p-5">
                    <h3 className="font-display font-semibold text-sm text-on-surface mb-3 flex items-center gap-2">
                      <Database className="w-4 h-4 text-primary" />
                      <span>Workspace Properties</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                      <div className="p-3 bg-surface-container-lowest/50 border border-outline-variant/40 rounded">
                        <p className="text-on-surface-variant/60 uppercase tracking-tighter text-[10px] mb-1">Total Items</p>
                        <p className="text-lg font-bold text-primary">{projects.length}</p>
                      </div>
                      <div className="p-3 bg-surface-container-lowest/50 border border-outline-variant/40 rounded">
                        <p className="text-on-surface-variant/60 uppercase tracking-tighter text-[10px] mb-1">Active</p>
                        <p className="text-lg font-bold text-primary">{activeProjectsCount}</p>
                      </div>
                      <div className="p-3 bg-surface-container-lowest/50 border border-outline-variant/40 rounded">
                        <p className="text-on-surface-variant/60 uppercase tracking-tighter text-[10px] mb-1">Archived</p>
                        <p className="text-lg font-bold text-on-surface-variant">{archivedProjectsCount}</p>
                      </div>
                      <div className="p-3 bg-surface-container-lowest/50 border border-outline-variant/40 rounded">
                        <p className="text-on-surface-variant/60 uppercase tracking-tighter text-[10px] mb-1">Starred</p>
                        <p className="text-lg font-bold text-tertiary">{projects.filter(p => p.isFavorite).length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recovery Options */}
                  <div className="bg-surface-container-low border border-outline-variant rounded-lg p-5 space-y-4">
                    <div>
                      <h3 className="font-display font-semibold text-sm text-on-surface mb-1 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-primary" />
                        <span>Database Operations</span>
                      </h3>
                      <p className="text-xs text-on-surface-variant">Reload initial sample data, including Kernel Extensions, GraphQL Schema, SecOps Handbook, and Architecture Blueprints.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={handleResetDatabase}
                        className="bg-surface-container-highest border border-outline-variant text-primary px-4 py-2 rounded-lg font-mono text-xs font-semibold hover:bg-primary hover:text-on-primary transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Restore Default Seed Data</span>
                      </button>

                      <button 
                        onClick={() => {
                          if (window.confirm("Danger: wipe out all projects from browser memory? This cannot be undone.")) {
                            setProjects([]);
                            showToast("All projects cleared", "trash");
                          }
                        }}
                        className="bg-error/10 border border-error/30 text-error px-4 py-2 rounded-lg font-mono text-xs font-semibold hover:bg-error hover:text-on-error transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>Wipe Local Memory</span>
                      </button>
                    </div>
                  </div>

                  {/* Storage Details */}
                  <div className="bg-surface border border-outline-variant rounded-none p-5 space-y-3 font-mono text-xs text-on-surface-variant">
                    <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                      <span>Persistence Protocol</span>
                      <span className="text-on-surface font-semibold">HTML5 localStorage</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/20 pb-2">
                      <span>Theme System</span>
                      <span className="text-primary font-bold">Swiss Modernist (Minimalist Slate)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Encryption Hash</span>
                      <span className="text-on-surface font-semibold text-[11px]">SHA-256 (SHA_V3_AES)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* New Project Dialog Modal (Screen 3) */}
      <AnimatePresence>
        {showModal && (
          <NewProjectModal 
            onClose={() => setShowModal(false)}
            onSave={handleSaveNewProject}
          />
        )}
      </AnimatePresence>

      {/* Elegant Action Notification Toast */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            iconType={toast.iconType} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
