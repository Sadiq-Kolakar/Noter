import React, { useState, useEffect, useRef } from 'react';
import { StickyNote, Plus, Trash2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScratchNote {
  id: string;
  text: string;
  createdAt: string;
}

export default function Scratchpad() {
  const [notes, setNotes] = useState<ScratchNote[]>(() => {
    const saved = localStorage.getItem('noter_scratchpad_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse scratchpad notes:", e);
      }
    }
    return [
      { id: '1', text: 'Consider migrating analytics endpoints to edge workers for lower latency.', createdAt: 'Jul 2, 10:14 PM' },
      { id: '2', text: 'Check if index.html includes correct viewport scaling headers.', createdAt: 'Jul 2, 11:30 PM' }
    ];
  });

  const [inputText, setInputText] = useState(() => {
    return localStorage.getItem('noter_scratchpad_draft_v1') || '';
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('noter_scratchpad_v1', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('noter_scratchpad_draft_v1', inputText);
  }, [inputText]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timeString = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const dateString = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    const newNote: ScratchNote = {
      id: Date.now().toString(),
      text: inputText.trim(),
      createdAt: `${dateString}, ${timeString}`
    };

    setNotes(prev => [...prev, newNote]);
    setInputText('');

    // Scroll to bottom of scratchpad
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleCopyNote = (note: ScratchNote) => {
    navigator.clipboard.writeText(note.text)
      .then(() => {
        setCopiedId(note.id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 border-t border-outline-variant/30 pt-4 px-6 mb-4">
      {/* Title */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2 text-primary">
          <StickyNote className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Scratchpad</span>
        </div>
        <span className="font-mono text-[9px] text-on-surface-variant/50 font-bold bg-surface-container px-1.5 py-0.5 border border-outline-variant/30">
          {notes.length} NOTES
        </span>
      </div>

      {/* Note List Container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-[140px] max-h-[220px] custom-scrollbar scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleCopyNote(note)}
              className="group relative p-2.5 bg-surface border border-outline-variant/40 hover:border-black cursor-pointer transition-all select-none flex flex-col justify-between"
              title="Click to copy contents to clipboard"
            >
              {/* Note Text */}
              <p className="text-[11px] text-on-surface leading-normal mb-1.5 break-words font-sans">
                {note.text}
              </p>

              {/* Timestamp & Actions */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] text-on-surface-variant/40 uppercase font-medium">
                  {note.createdAt}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Copy Confirmation Indicator */}
                  {copiedId === note.id ? (
                    <span className="flex items-center gap-0.5 text-tertiary font-mono text-[8px] font-bold uppercase tracking-tight">
                      <Check className="w-2.5 h-2.5" />
                      <span>Copied!</span>
                    </span>
                  ) : (
                    <Copy className="w-2.5 h-2.5 text-on-surface-variant/40 group-hover:text-primary transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
                  )}

                  <button
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="p-0.5 text-on-surface-variant/40 hover:text-error hover:border-error border border-transparent rounded bg-transparent shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Note"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {notes.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center py-8 text-center border border-dashed border-outline-variant/45">
            <p className="text-on-surface-variant/50 font-mono text-[9px] uppercase tracking-wider">Scratchpad Empty</p>
            <p className="text-[10px] text-on-surface-variant/40 mt-1 max-w-[150px]">Fleeting thoughts saved here persist offline.</p>
          </div>
        )}
      </div>

      {/* Input Box Form */}
      <form onSubmit={handleAddNote} className="mt-3 shrink-0">
        <div className="relative flex items-end border border-black bg-white">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type fleeting thought..."
            rows={2}
            className="w-full bg-transparent p-2 text-[11px] font-sans placeholder:text-on-surface-variant/40 outline-none text-on-surface resize-none pr-7 custom-scrollbar leading-tight"
            maxLength={250}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-1.5 bottom-1.5 p-1 bg-primary text-white hover:bg-tertiary disabled:bg-surface-container disabled:text-on-surface-variant/30 border border-black/15 transition-all cursor-pointer rounded-none"
            title="Save note"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <p className="font-mono text-[8px] text-on-surface-variant/40 text-right mt-1 uppercase tracking-tight">
          Enter to add • Max 250 chars
        </p>
      </form>
    </div>
  );
}
