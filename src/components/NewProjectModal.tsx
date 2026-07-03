import React, { useState, useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../types';

interface NewProjectModalProps {
  onClose: () => void;
  onSave: (title: string, description: string) => void;
}

export default function NewProjectModal({
  onClose,
  onSave
}: NewProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Handle Cmd+Enter / Ctrl+Enter keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (title.trim()) {
          onSave(title.trim(), description.trim());
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, description, onClose, onSave]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim(), description.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-background/60">
      {/* Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-[480px] bg-surface border border-black shadow-2xl rounded-none overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black bg-surface-container-low">
          <h2 className="font-serif italic font-medium text-xl text-on-surface">New Project</h2>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer p-1 rounded-none hover:bg-neutral-100/30 active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="font-mono text-[9px] text-primary uppercase tracking-widest block font-bold">
              Project Title
            </label>
            <input 
              autoFocus 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kernel Documentation"
              className="w-full bg-surface-container-lowest border border-outline-variant p-3 font-mono text-xs text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:border-black focus:ring-1 focus:ring-black/30 transition-all rounded-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[9px] text-primary uppercase tracking-widest block font-bold">
              Description
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical scope and repository links..."
              rows={4}
              className="w-full bg-surface-container-lowest border border-outline-variant p-3 font-mono text-xs text-on-surface placeholder:text-on-surface-variant/30 outline-none focus:border-black focus:ring-1 focus:ring-black/30 transition-all resize-none rounded-none"
              required
            />
          </div>

          {/* Accessibility Shortcut Hint */}
          <div className="flex items-center gap-2 text-on-surface-variant/60 font-mono text-[9px] uppercase tracking-wider">
            <Keyboard className="w-4 h-4" />
            <span>
              Press <kbd className="px-1 py-0.5 border border-outline-variant bg-surface-container-highest rounded-none text-[9px] font-bold">⌘</kbd> + <kbd className="px-1 py-0.5 border border-outline-variant bg-surface-container-highest rounded-none text-[9px] font-bold">Enter</kbd> to create
            </span>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex justify-end items-center gap-3 px-6 py-4 bg-surface-container-low border-t border-black">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-mono text-xs text-on-surface-variant hover:text-on-surface uppercase tracking-wider transition-colors cursor-pointer font-medium"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className={`px-5 py-2.5 font-mono text-xs font-bold rounded-none uppercase tracking-widest transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 border ${
              title.trim() 
                ? 'bg-primary text-on-primary border-black hover:bg-white hover:text-primary' 
                : 'bg-surface-container-highest text-on-surface-variant/55 cursor-not-allowed border-outline-variant/45'
            }`}
          >
            Create Project
          </button>
        </div>
      </motion.div>
    </div>
  );
}
