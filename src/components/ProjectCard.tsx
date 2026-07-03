import React from 'react';
import { Terminal, Cpu, Shield, Layers, Sparkles, Database, Lock, Star, EyeOff, Share2, MoreVertical, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import HighlightText from './HighlightText';

interface ProjectCardProps {
  key?: string;
  project: Project;
  searchQuery?: string;
  onSelect: (projectId: string) => void;
  onToggleFavorite?: (projectId: string, e: React.MouseEvent) => void;
  onDelete?: (projectId: string, e: React.MouseEvent) => void;
}

export default function ProjectCard({
  project,
  searchQuery = '',
  onSelect,
  onToggleFavorite,
  onDelete
}: ProjectCardProps) {
  // Select matching icon based on iconType
  const getIcon = () => {
    switch (project.iconType) {
      case 'terminal':
        return <Terminal className="w-5 h-5 text-primary" />;
      case 'api':
        return <Cpu className="w-5 h-5 text-tertiary" />;
      case 'security':
        return <Shield className="w-5 h-5 text-primary" />;
      case 'inventory':
        return <Layers className="w-5 h-5 text-primary" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-tertiary" />;
      case 'database':
        return <Database className="w-5 h-5 text-on-secondary-container" />;
      default:
        return <Terminal className="w-5 h-5 text-primary" />;
    }
  };

  // Get dynamic background for icon container
  const getIconBg = () => {
    switch (project.iconType) {
      case 'api':
        return 'bg-tertiary/10';
      case 'sparkles':
        return 'bg-tertiary-container/20';
      case 'database':
        return 'bg-secondary-container/30';
      default:
        return 'bg-primary/10';
    }
  };

  // Wide cards correspond to Card 4 ("Architecture Blueprints")
  if (project.isWide) {
    return (
      <div 
        onClick={() => onSelect(project.id)}
        className="project-card md:col-span-2 bg-surface-container-low border border-outline-variant p-6 rounded-none transition-all cursor-pointer group relative overflow-hidden hover:border-primary hover:bg-neutral-100/10"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none -z-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6 h-full">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-none border border-outline-variant/30 ${getIconBg()}`}>
                  {getIcon()}
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onToggleFavorite && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite(project.id, e); }}
                      className="p-1 text-on-surface-variant hover:text-primary transition-colors"
                      title={project.isFavorite ? "Remove favorite" : "Favorite"}
                    >
                      <Star className={`w-4 h-4 ${project.isFavorite ? 'fill-tertiary text-tertiary' : ''}`} />
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(project.id, e); }}
                      className="p-1 text-on-surface-variant hover:text-error transition-colors"
                      title="Archive Project"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <h2 className="font-serif italic font-medium text-2xl text-on-surface mb-2 tracking-tight group-hover:text-tertiary transition-colors">
                <HighlightText text={project.title} query={searchQuery} />
              </h2>
              <p className="text-on-surface-variant text-xs mb-6 max-w-md leading-relaxed">
                <HighlightText text={project.description} query={searchQuery} />
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-auto">
              <div className="flex-1 min-w-[200px] max-w-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">{project.phases} Phases</span>
                  <span className="font-mono text-xs text-primary font-bold">{project.progress}%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-highest overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              <div className="text-[10px] text-on-surface-variant/60 font-mono uppercase tracking-wider">
                Updated: {project.lastUpdated}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <button className="bg-primary text-on-primary border border-black px-5 py-2.5 rounded-none font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all active:scale-95 flex items-center gap-1.5 self-start md:self-auto">
              <span>Open Vault</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard cards
  return (
    <div 
      onClick={() => onSelect(project.id)}
      className="project-card bg-surface border border-outline-variant p-5 rounded-none transition-all cursor-pointer group hover:border-black hover:bg-neutral-100/10 flex flex-col justify-between h-full min-h-[220px]"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-none border border-outline-variant/30 ${getIconBg()}`}>
            {getIcon()}
          </div>
          
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {onToggleFavorite && (
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(project.id, e); }}
                className="p-1 text-on-surface-variant hover:text-primary transition-colors"
                title={project.isFavorite ? "Remove favorite" : "Favorite"}
              >
                <Star className={`w-3.5 h-3.5 ${project.isFavorite ? 'fill-tertiary text-tertiary' : ''}`} />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(project.id, e); }}
                className="p-1 text-on-surface-variant hover:text-error transition-colors text-xs"
                title="Archive Project"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <h2 className="font-serif italic font-semibold text-xl text-on-surface mb-2 tracking-tight group-hover:text-tertiary transition-colors">
          <HighlightText text={project.title} query={searchQuery} />
        </h2>
        <p className="text-on-surface-variant text-xs line-clamp-2 mb-6 leading-relaxed">
          <HighlightText text={project.description} query={searchQuery} />
        </p>
      </div>

      <div className="mt-auto">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">{project.phases} Phases</span>
            <span className="font-mono text-xs text-primary font-bold">{project.progress}%</span>
          </div>
          <div className="w-full h-1 bg-surface-container-highest overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-outline-variant/30">
          <span className="text-[10px] text-on-surface-variant/60 font-mono uppercase tracking-wider">
            Updated: {project.lastUpdated}
          </span>
          
          {/* Right indicator icons or mock user avatars */}
          <div className="flex items-center gap-2">
            {project.isLocked && (
              <Lock className="w-3.5 h-3.5 text-on-surface-variant/60" />
            )}
            {project.isFavorite && !project.isLocked && (
              <Star className="w-3.5 h-3.5 text-tertiary fill-tertiary" />
            )}
            {project.isVisibleOff && (
              <EyeOff className="w-3.5 h-3.5 text-on-surface-variant/40" />
            )}
            {!project.isLocked && !project.isFavorite && !project.isVisibleOff && (
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-none border border-outline-variant bg-surface-bright flex items-center justify-center text-[9px] font-bold text-on-surface font-mono">
                  {project.members?.[0] || 'ME'}
                </div>
                <div className="w-5 h-5 rounded-none border border-outline-variant bg-primary text-on-primary flex items-center justify-center text-[9px] font-bold font-mono">
                  {project.members?.[1] || '+1'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
