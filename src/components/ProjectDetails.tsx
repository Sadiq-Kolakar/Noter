import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronRight, ExternalLink, Plus, Trash2, Code, Shield, Palette, 
  Database, Cpu, HardDrive, FileText, Globe, Check, AlertCircle, Edit2,
  Mic, Square, Play, Pause, Calendar, TrendingUp, Sparkles, BookOpen, 
  Lightbulb, Save, Activity, Layers, Headphones, Trash
} from 'lucide-react';
import { 
  Project, Dependency, Documentation, Integration, 
  ProjectPhase, IdeaOrBlog, QuickNote, ProjectVelocityPoint 
} from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface ProjectDetailsProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
  onBack: () => void;
  onShowToast: (msg: string, icon: string) => void;
}

type TabType = 'phases' | 'tech_stack' | 'blogs_ideas' | 'quick_notes' | 'analytics' | 'documentation' | 'integrations';

export default function ProjectDetails({
  project,
  onUpdateProject,
  onBack,
  onShowToast
}: ProjectDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('phases');
  
  // Phase Routing & Task States
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [phaseTaskText, setPhaseTaskText] = useState('');
  const [phaseNotesText, setPhaseNotesText] = useState('');

  // Form visibility states
  const [showAddDep, setShowAddDep] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [showAddInt, setShowAddInt] = useState(false);
  const [showAddPhase, setShowAddPhase] = useState(false);
  const [showAddIdea, setShowAddIdea] = useState(false);

  // Form states - Dependency
  const [depName, setDepName] = useState('');
  const [depType, setDepType] = useState('Core Framework');
  const [depWhy, setDepWhy] = useState('');
  const [depWhere, setDepWhere] = useState('');
  const [depAlts, setDepAlts] = useState('');
  const [depIcon, setDepIcon] = useState('code');

  // Form states - Documentation
  const [docTitle, setDocTitle] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [docSummary, setDocSummary] = useState('');
  const [docCategory, setDocCategory] = useState('Architecture');

  // Form states - Integration
  const [intName, setIntName] = useState('');
  const [intType, setIntType] = useState('Deployment');
  const [intDesc, setIntDesc] = useState('');

  // Form states - Phase
  const [phaseTitle, setPhaseTitle] = useState('');
  const [phaseDesc, setPhaseDesc] = useState('');
  const [phaseDate, setPhaseDate] = useState('');

  // Form states - Idea/Blog
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaContent, setIdeaContent] = useState('');
  const [ideaType, setIdeaType] = useState<'idea' | 'feature' | 'blog'>('idea');

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTitle, setRecordingTitle] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Default values generators (to backfill missing fields dynamically for initial data)
  const defaultPhases: ProjectPhase[] = Array.from({ length: project.phases || 3 }).map((_, i) => ({
    id: `default-phase-${i + 1}`,
    title: i === 0 ? "System Architecture & Layouts" :
           i === 1 ? "Core Business Logic & Schema Design" :
           i === 2 ? "Integrations & API Adapters" :
           `Final Polish & Deployment Release`,
    description: `Engineering requirements, design specifications, and automated validations for Stage ${i + 1}.`,
    isCompleted: project.progress > (i / (project.phases || 3)) * 100,
    targetDate: `2026-0${7 + i}-15`
  }));

  const currentPhases = project.phasesList && project.phasesList.length > 0 ? project.phasesList : defaultPhases;

  // Sync Phase Notes & Tasks
  const selectedPhase = currentPhases.find(p => p.id === selectedPhaseId);

  useEffect(() => {
    if (selectedPhase) {
      setPhaseNotesText(selectedPhase.notes || '');
    } else {
      setPhaseNotesText('');
    }
  }, [selectedPhaseId, selectedPhase]);

  const handleAddPhaseTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhaseId || !phaseTaskText.trim()) return;
    
    const newTask = {
      id: Date.now().toString(),
      text: phaseTaskText.trim(),
      isCompleted: false
    };

    const updatedPhases = currentPhases.map(ph => {
      if (ph.id === selectedPhaseId) {
        return {
          ...ph,
          tasks: [...(ph.tasks || []), newTask]
        };
      }
      return ph;
    });

    const updatedProject = {
      ...project,
      phasesList: updatedPhases,
      lastUpdated: 'Just now'
    };
    onUpdateProject(updatedProject);
    setPhaseTaskText('');
    onShowToast("Phase sub-task added", "check");
  };

  const handleTogglePhaseTask = (taskId: string) => {
    if (!selectedPhaseId) return;

    const updatedPhases = currentPhases.map(ph => {
      if (ph.id === selectedPhaseId) {
        const updatedTasks = (ph.tasks || []).map(t => 
          t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
        );
        return {
          ...ph,
          tasks: updatedTasks
        };
      }
      return ph;
    });

    const updatedProject = {
      ...project,
      phasesList: updatedPhases,
      lastUpdated: 'Just now'
    };
    onUpdateProject(updatedProject);
    onShowToast("Task updated", "check");
  };

  const handleDeletePhaseTask = (taskId: string) => {
    if (!selectedPhaseId) return;

    const updatedPhases = currentPhases.map(ph => {
      if (ph.id === selectedPhaseId) {
        const updatedTasks = (ph.tasks || []).filter(t => t.id !== taskId);
        return {
          ...ph,
          tasks: updatedTasks
        };
      }
      return ph;
    });

    const updatedProject = {
      ...project,
      phasesList: updatedPhases,
      lastUpdated: 'Just now'
    };
    onUpdateProject(updatedProject);
    onShowToast("Task removed", "trash");
  };

  const handleSavePhaseNotes = () => {
    if (!selectedPhaseId) return;

    const updatedPhases = currentPhases.map(ph => {
      if (ph.id === selectedPhaseId) {
        return {
          ...ph,
          notes: phaseNotesText
        };
      }
      return ph;
    });

    const updatedProject = {
      ...project,
      phasesList: updatedPhases,
      lastUpdated: 'Just now'
    };
    onUpdateProject(updatedProject);
    onShowToast("Phase specifications saved", "check");
  };

  // Default values generators (to backfill missing fields dynamically for initial data)
  const defaultIdeas: IdeaOrBlog[] = [
    {
      id: 'default-idea-1',
      type: 'idea',
      title: 'Decentralized caching nodes',
      content: 'Consider routing edge cache queries through peer nodes to optimize cluster lookup fees.',
      createdAt: '2 days ago'
    },
    {
      id: 'default-blog-1',
      type: 'blog',
      title: 'Refactoring the Core State Provider',
      content: 'We transitioned the main container state into a robust context provider with local storage synchronization. This reduced re-renders and cleaned up redundant page pipelines.',
      createdAt: '5 days ago'
    }
  ];

  const currentIdeas = project.ideasOrBlogs && project.ideasOrBlogs.length > 0 ? project.ideasOrBlogs : defaultIdeas;

  const defaultVelocity: ProjectVelocityPoint[] = [
    { date: 'Jan', progress: 0, updates: 2 },
    { date: 'Feb', progress: Math.min(project.progress, 15), updates: 4 },
    { date: 'Mar', progress: Math.min(project.progress, 30), updates: 7 },
    { date: 'Apr', progress: Math.min(project.progress, 45), updates: 5 },
    { date: 'May', progress: Math.min(project.progress, 60), updates: 9 },
    { date: 'Jun', progress: project.progress, updates: 12 },
  ];

  const currentVelocity = project.velocityData && project.velocityData.length > 0 ? project.velocityData : defaultVelocity;

  // Audio recording timer loop
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        onShowToast("Audio recorder is not supported on this browser or inside this iframe container", "alert-circle");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const newNote: QuickNote = {
            id: Date.now().toString(),
            title: recordingTitle.trim() || `Audio Memo #${(project.quickNotes?.length || 0) + 1}`,
            audioBase64: base64data,
            duration: recordingSeconds || 3,
            createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          };

          const updated = {
            ...project,
            quickNotes: [newNote, ...(project.quickNotes || [])],
            lastUpdated: 'Just now'
          };
          onUpdateProject(updated);
          onShowToast("Audio note recorded and saved successfully!", "check");
          setRecordingTitle('');
        };

        // Stop micro tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      onShowToast("Recording voice note...", "mic");
    } catch (err) {
      console.error("Microphone access error:", err);
      onShowToast("Microphone access denied or unavailable in this window framework", "alert-circle");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleDeleteAudioNote = (noteId: string) => {
    const updated = {
      ...project,
      quickNotes: (project.quickNotes || []).filter(n => n.id !== noteId),
      lastUpdated: 'Just now'
    };
    onUpdateProject(updated);
    onShowToast("Voice note deleted", "trash");
  };

  // Icon mapping for dependency cards
  const getDependencyIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code className="w-5 h-5 text-primary" />;
      case 'palette':
        return <Palette className="w-5 h-5 text-primary" />;
      case 'shield-alert':
        return <Shield className="w-5 h-5 text-primary" />;
      case 'database':
        return <Database className="w-5 h-5 text-primary" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-primary" />;
      case 'hard-drive':
        return <HardDrive className="w-5 h-5 text-primary" />;
      default:
        return <Code className="w-5 h-5 text-primary" />;
    }
  };

  // Phase toggling and modification handlers
  const handleTogglePhase = (phaseId: string) => {
    const updatedList = currentPhases.map(p => p.id === phaseId ? { ...p, isCompleted: !p.isCompleted } : p);
    const total = updatedList.length;
    const completed = updatedList.filter(p => p.isCompleted).length;
    const computedProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Add progress velocity update point
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const nextVelocity = [
      ...currentVelocity,
      { date: todayStr, progress: computedProgress, updates: (currentVelocity[currentVelocity.length - 1]?.updates || 0) + 1 }
    ];

    const updated: Project = {
      ...project,
      phasesList: updatedList,
      phases: total,
      progress: computedProgress,
      velocityData: nextVelocity,
      lastUpdated: 'Just now'
    };
    onUpdateProject(updated);
    onShowToast(`Milestone status updated. Progress is now ${computedProgress}%`, "check");
  };

  const handleAddPhase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phaseTitle) return;

    const newPhase: ProjectPhase = {
      id: Date.now().toString(),
      title: phaseTitle,
      description: phaseDesc || 'No operational summary provided.',
      isCompleted: false,
      targetDate: phaseDate || undefined
    };

    const nextList = [...currentPhases, newPhase];
    const total = nextList.length;
    const completed = nextList.filter(p => p.isCompleted).length;
    const computedProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

    const updated = {
      ...project,
      phasesList: nextList,
      phases: total,
      progress: computedProgress,
      lastUpdated: 'Just now'
    };

    onUpdateProject(updated);
    onShowToast(`Added phase "${phaseTitle}"`, "plus");
    setPhaseTitle('');
    setPhaseDesc('');
    setPhaseDate('');
    setShowAddPhase(false);
  };

  const handleDeletePhase = (phaseId: string) => {
    const nextList = currentPhases.filter(p => p.id !== phaseId);
    const total = nextList.length;
    const completed = nextList.filter(p => p.isCompleted).length;
    const computedProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

    const updated = {
      ...project,
      phasesList: nextList,
      phases: total,
      progress: computedProgress,
      lastUpdated: 'Just now'
    };

    onUpdateProject(updated);
    onShowToast("Phase removed from timeline", "trash");
  };

  // Ideas & Blogs handlers
  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle || !ideaContent) return;

    const newItem: IdeaOrBlog = {
      id: Date.now().toString(),
      type: ideaType,
      title: ideaTitle,
      content: ideaContent,
      createdAt: 'Just now'
    };

    const updated = {
      ...project,
      ideasOrBlogs: [newItem, ...currentIdeas],
      lastUpdated: 'Just now'
    };

    onUpdateProject(updated);
    onShowToast(`Added new ${ideaType}`, "check");
    setIdeaTitle('');
    setIdeaContent('');
    setShowAddIdea(false);
  };

  const handleDeleteIdea = (id: string) => {
    const updated = {
      ...project,
      ideasOrBlogs: currentIdeas.filter(item => item.id !== id),
      lastUpdated: 'Just now'
    };
    onUpdateProject(updated);
    onShowToast("Entry removed", "trash");
  };

  // Tech stack (dependencies) handlers
  const handleAddDependency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depName || !depWhy) {
      onShowToast("Please fill in required fields", "alert-circle");
      return;
    }

    const newDep: Dependency = {
      id: Date.now().toString(),
      name: depName,
      type: depType,
      why: depWhy,
      whereUsed: depWhere ? depWhere.split(',').map(s => s.trim().startsWith('#') ? s.trim() : `#${s.trim()}`) : ['#general'],
      alternatives: depAlts || 'None listed',
      icon: depIcon
    };

    const updated = {
      ...project,
      dependencies: [...project.dependencies, newDep],
      lastUpdated: 'Just now'
    };

    onUpdateProject(updated);
    onShowToast(`Added stack element ${depName}`, "check");
    setDepName('');
    setDepWhy('');
    setDepWhere('');
    setDepAlts('');
    setShowAddDep(false);
  };

  const handleDeleteDependency = (depId: string) => {
    const updated = {
      ...project,
      dependencies: project.dependencies.filter(d => d.id !== depId),
      lastUpdated: 'Just now'
    };
    onUpdateProject(updated);
    onShowToast("Dependency removed", "trash");
  };

  // Original Documentation and Integration handlers
  const handleAddDocumentation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docUrl) return;

    const newDoc: Documentation = {
      id: Date.now().toString(),
      title: docTitle,
      url: docUrl.startsWith('http') ? docUrl : `https://${docUrl}`,
      summary: docSummary || 'No summary provided',
      category: docCategory
    };

    const updated = {
      ...project,
      documentation: [...project.documentation, newDoc],
      lastUpdated: 'Just now'
    };

    onUpdateProject(updated);
    onShowToast(`Added documentation ${docTitle}`, "check");
    setDocTitle('');
    setDocUrl('');
    setDocSummary('');
    setShowAddDoc(false);
  };

  const handleDeleteDocumentation = (docId: string) => {
    const updated = {
      ...project,
      documentation: project.documentation.filter(d => d.id !== docId),
      lastUpdated: 'Just now'
    };
    onUpdateProject(updated);
    onShowToast("Documentation link removed", "trash");
  };

  const handleAddIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intName || !intDesc) return;

    const newInt: Integration = {
      id: Date.now().toString(),
      name: intName,
      status: 'active',
      type: intType,
      description: intDesc
    };

    const updated = {
      ...project,
      integrations: [...project.integrations, newInt],
      lastUpdated: 'Just now'
    };

    onUpdateProject(updated);
    onShowToast(`Added integration ${intName}`, "check");
    setIntName('');
    setIntDesc('');
    setShowAddInt(false);
  };

  const handleDeleteIntegration = (intId: string) => {
    const updated = {
      ...project,
      integrations: project.integrations.filter(i => i.id !== intId),
      lastUpdated: 'Just now'
    };
    onUpdateProject(updated);
    onShowToast("Integration removed", "trash");
  };

  const toggleIntegrationStatus = (intId: string) => {
    const updated = {
      ...project,
      integrations: project.integrations.map(i => {
        if (i.id === intId) {
          const newStatus: 'active' | 'inactive' = i.status === 'active' ? 'inactive' : 'active';
          onShowToast(`Integration is now ${newStatus}`, "refresh-cw");
          return { ...i, status: newStatus };
        }
        return i;
      }),
      lastUpdated: 'Just now'
    };
    onUpdateProject(updated);
  };

  // Audio Playback Component to wrap playback state cleanly
  const AudioPlayer = ({ base64 }: { base64: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
      audioRef.current = new Audio(base64);
      audioRef.current.onended = () => setIsPlaying(false);
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }, [base64]);

    const togglePlay = () => {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    };

    return (
      <button
        onClick={togglePlay}
        className={`px-3 py-1.5 border border-black font-mono text-[9px] uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 ${
          isPlaying ? 'bg-tertiary text-white border-tertiary' : 'bg-primary text-white hover:bg-white hover:text-primary'
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-3 h-3 text-white animate-pulse" />
            <span>PAUSE SNIPPET</span>
          </>
        ) : (
          <>
            <Play className="w-3 h-3" />
            <span>PLAY VOICE MEMO</span>
          </>
        )}
      </button>
    );
  };

  if (selectedPhaseId && selectedPhase) {
    const completedTasks = (selectedPhase.tasks || []).filter(t => t.isCompleted).length;
    const totalTasks = (selectedPhase.tasks || []).length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (selectedPhase.isCompleted ? 100 : 0);

    return (
      <div className="relative">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 text-primary font-mono text-[10px] uppercase tracking-widest mb-6">
          <button onClick={onBack} className="hover:underline hover:text-tertiary transition-all cursor-pointer font-bold">Projects</button>
          <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant opacity-60" />
          <button onClick={() => setSelectedPhaseId(null)} className="hover:underline hover:text-tertiary transition-all cursor-pointer truncate max-w-[150px] font-bold">{project.title}</button>
          <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant opacity-60" />
          <span className="text-on-surface-variant font-bold">Phases</span>
          <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant opacity-60" />
          <span className="text-on-surface-variant font-black truncate max-w-[150px]">{selectedPhase.title}</span>
        </div>

        {/* Phase Subpage Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-black mb-8">
          <div className="space-y-1.5">
            <span className="font-mono text-[10px] text-tertiary font-bold uppercase tracking-widest bg-tertiary/10 px-2 py-0.5 border border-tertiary/20">
              {selectedPhase.isCompleted ? 'STABLE RELEASE' : 'IN DEVELOPMENT'}
            </span>
            <h1 className="font-display font-bold text-3xl text-on-background tracking-tight">{selectedPhase.title}</h1>
            <p className="text-on-surface-variant text-sm max-w-3xl leading-relaxed">{selectedPhase.description}</p>
          </div>

          <div className="flex flex-col items-end gap-2.5 self-stretch md:self-auto min-w-[200px]">
            <div className="w-full bg-surface border border-black p-3 flex justify-between items-center">
              <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest">Stage Progress</span>
              <span className="font-mono text-sm font-bold text-primary">{progressPercent}%</span>
            </div>
            
            <button
              onClick={() => handleTogglePhase(selectedPhase.id)}
              className={`w-full py-2.5 border border-black font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
                selectedPhase.isCompleted 
                  ? 'bg-neutral-200 text-black hover:bg-neutral-300' 
                  : 'bg-primary text-white hover:bg-white hover:text-primary'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{selectedPhase.isCompleted ? 'Mark as Incomplete' : 'Complete Entire Phase'}</span>
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="space-y-8">
          {/* Tasks & Notes */}
          <div className="space-y-8">
            
            {/* Checklist Station */}
            <div className="bg-surface border border-black p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-outline-variant/30">
                <h3 className="font-serif italic font-bold text-lg text-primary">Milestone Sub-tasks ({completedTasks}/{totalTasks})</h3>
                <span className="font-mono text-[9px] text-on-surface-variant/60 uppercase">Operational Checks</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-surface-container-high overflow-hidden">
                <div 
                  className="h-full bg-tertiary transition-all duration-300" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Add Task Form */}
              <form onSubmit={handleAddPhaseTask} className="flex gap-2">
                <input 
                  type="text"
                  value={phaseTaskText}
                  onChange={e => setPhaseTaskText(e.target.value)}
                  placeholder="Identify next operational requirement..."
                  className="flex-1 bg-white border border-black p-2.5 font-mono text-xs focus:border-tertiary outline-none text-on-surface"
                />
                <button
                  type="submit"
                  disabled={!phaseTaskText.trim()}
                  className="bg-primary text-on-primary hover:bg-white hover:text-primary border border-black px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  Add Task
                </button>
              </form>

              {/* Task list */}
              <div className="space-y-2.5 pt-2">
                {(selectedPhase.tasks || []).map(task => (
                  <div 
                    key={task.id}
                    className={`p-3 border flex items-center justify-between gap-4 group transition-colors ${
                      task.isCompleted ? 'bg-neutral-50/50 border-outline-variant/20' : 'bg-white border-black'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleTogglePhaseTask(task.id)}
                        className={`w-5 h-5 border cursor-pointer transition-colors flex items-center justify-center ${
                          task.isCompleted ? 'bg-tertiary border-tertiary text-white' : 'border-black hover:border-tertiary'
                        }`}
                      >
                        {task.isCompleted && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <span className={`text-xs font-mono ${task.isCompleted ? 'line-through text-on-surface-variant/50' : 'text-on-surface'}`}>
                        {task.text}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeletePhaseTask(task.id)}
                      className="p-1 text-on-surface-variant/40 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {(selectedPhase.tasks || []).length === 0 && (
                  <div className="border border-dashed border-outline-variant/40 p-8 text-center text-on-surface-variant/50 font-mono text-xs">
                    No sub-tasks configured for this stage. Add one above to get started.
                  </div>
                )}
              </div>
            </div>

            {/* Phase Technical Specifications / Notes */}
            <div className="bg-surface border border-black p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-outline-variant/30">
                <h3 className="font-serif italic font-bold text-lg text-primary">Technical Specifications & Notes</h3>
                <span className="font-mono text-[9px] text-on-surface-variant/60 uppercase">Persistent Data Block</span>
              </div>

              <textarea 
                value={phaseNotesText}
                onChange={e => setPhaseNotesText(e.target.value)}
                placeholder="Document technical requirements, API schema updates, deployment checklists, and testing procedures..."
                rows={8}
                className="w-full bg-white border border-black p-4 font-mono text-xs focus:border-tertiary outline-none text-on-surface leading-relaxed resize-none custom-scrollbar"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSavePhaseNotes}
                  className="bg-primary text-on-primary hover:bg-white hover:text-primary border border-black px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-all"
                >
                  Save Specification Block
                </button>
              </div>
            </div>

          </div>

          {/* Return Control */}
          <div className="pt-4">
            <button
              onClick={() => setSelectedPhaseId(null)}
              className="w-full py-3 bg-surface hover:bg-neutral-50 border-2 border-black text-primary font-mono text-[11px] uppercase tracking-widest transition-all cursor-pointer text-center font-bold"
            >
              ← Back to Milestone Explorer
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Page Header */}
      <header className="mb-6">
        <div className="flex items-center gap-1 text-primary font-mono text-[10px] uppercase tracking-widest mb-3">
          <button onClick={onBack} className="hover:underline hover:text-tertiary transition-all cursor-pointer">Projects</button>
          <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant opacity-60" />
          <span className="text-on-surface-variant font-bold truncate max-w-[200px]">{project.title}</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 border-b border-black">
          <div>
            <h1 className="font-serif italic font-medium text-4xl text-on-background tracking-tight">{project.title}</h1>
            <p className="text-on-surface-variant text-xs max-w-2xl mt-1 leading-relaxed">{project.description}</p>
          </div>
          <div className="flex items-center gap-3 bg-surface border border-black px-4 py-2 select-none">
            <span className="font-mono text-[10px] text-on-surface-variant/70 uppercase tracking-widest">Progress</span>
            <span className="font-serif italic font-bold text-2xl text-tertiary">{project.progress}%</span>
          </div>
        </div>
        
        {/* Navigation Tabs - Swiss/Kultur Theme */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-outline-variant/30 mt-6 overflow-x-auto custom-scrollbar">
          {([
            { id: 'phases', label: 'Phases & Milestones' },
            { id: 'tech_stack', label: 'Tech Stack' },
            { id: 'blogs_ideas', label: 'Blogs & Ideas' },
            { id: 'quick_notes', label: 'Quick Notes' },
            { id: 'analytics', label: 'Project Velocity' },
            { id: 'documentation', label: 'Guides & Docs' },
            { id: 'integrations', label: 'Pipelines' }
          ] as { id: TabType; label: string }[]).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 cursor-pointer ${
                  isActive 
                    ? 'text-primary border-primary border-b-2 font-black' 
                    : 'text-on-surface-variant hover:text-on-surface border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Pane */}
      <div className="min-h-[450px]">
        <AnimatePresence mode="wait">
          
          {/* PHASES AND MILESTONES TAB */}
          {activeTab === 'phases' && (
            <motion.div 
              key="phases"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-outline-variant/30">
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Engineering Timeline ({currentPhases.length} Phases)</span>
                <button 
                  onClick={() => setShowAddPhase(!showAddPhase)}
                  className="bg-primary text-on-primary border border-black px-4 py-2 rounded-none font-mono text-[9px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Milestone</span>
                </button>
              </div>

              {/* Add Phase Form */}
              {showAddPhase && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleAddPhase}
                  className="bg-surface-container-low border border-black p-5 space-y-4"
                >
                  <h3 className="font-serif italic font-medium text-lg text-primary">Log New Timeline Stage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Phase Title</label>
                      <input 
                        type="text" 
                        value={phaseTitle} 
                        onChange={e => setPhaseTitle(e.target.value)} 
                        placeholder="e.g. Phase 5: OAuth Refactor" 
                        className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Target Date</label>
                      <input 
                        type="date" 
                        value={phaseDate} 
                        onChange={e => setPhaseDate(e.target.value)} 
                        className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Operational Scope Description</label>
                    <textarea 
                      value={phaseDesc} 
                      onChange={e => setPhaseDesc(e.target.value)} 
                      placeholder="Specify key deliveries and integration boundaries..." 
                      rows={2}
                      className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddPhase(false)}
                      className="px-4 py-2 font-mono text-[10px] text-on-surface-variant hover:text-on-surface uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-primary text-on-primary border border-black px-4 py-2 rounded-none font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all cursor-pointer"
                    >
                      Commit Phase
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Phases Timeline Grid */}
              <div className="space-y-4">
                {currentPhases.map((phase, index) => (
                  <div 
                    key={phase.id}
                    onClick={() => setSelectedPhaseId(phase.id)}
                    className={`p-5 border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all relative group cursor-pointer hover:border-black hover:shadow-sm ${
                      phase.isCompleted 
                        ? 'border-black bg-neutral-100/10' 
                        : 'border-outline-variant/30 bg-surface'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleTogglePhase(phase.id); }}
                        className={`w-6 h-6 border cursor-pointer transition-all flex items-center justify-center rounded-none shrink-0 ${
                          phase.isCompleted 
                            ? 'bg-primary border-black text-white' 
                            : 'border-outline-variant/70 hover:border-black bg-white text-transparent'
                        }`}
                        title={phase.isCompleted ? "Mark as Pending" : "Mark as Completed"}
                      >
                        <Check className="w-4 h-4 text-white font-bold" />
                      </button>
                      
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                          <h4 className={`font-serif italic font-bold text-lg leading-tight transition-all ${phase.isCompleted ? 'line-through text-on-surface-variant/50' : 'text-primary'}`}>
                            {phase.title}
                          </h4>
                          {phase.targetDate && (
                            <span className="font-mono text-[9px] bg-surface-container-high border border-outline-variant/30 px-1.5 py-0.5 text-on-surface-variant font-bold uppercase flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" />
                              {phase.targetDate}
                            </span>
                          )}
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[8px] bg-tertiary text-black px-1.5 py-0.5 font-bold uppercase">
                            View details & sub-tasks →
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed max-w-3xl ${phase.isCompleted ? 'text-on-surface-variant/40' : 'text-on-surface-variant'}`}>
                          {phase.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                      <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-1 font-bold ${
                        phase.isCompleted 
                          ? 'bg-neutral-100 border border-black text-on-surface' 
                          : 'bg-white border border-dashed border-outline-variant/40 text-on-surface-variant/75'
                      }`}>
                        {phase.isCompleted ? 'STABLE RELEASE' : 'IN DEVELOPMENT'}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeletePhase(phase.id); }}
                        className="p-1.5 text-on-surface-variant hover:text-tertiary opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-black rounded-none bg-transparent cursor-pointer"
                        title="Delete this phase"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {currentPhases.length === 0 && (
                  <div className="border border-dashed border-outline-variant/40 p-12 text-center bg-surface-container-low/20">
                    <p className="text-on-surface-variant font-mono text-xs mb-3">No developmental phases configured for this repository.</p>
                    <button 
                      onClick={() => setShowAddPhase(true)}
                      className="bg-primary text-on-primary border border-black px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all cursor-pointer"
                    >
                      Initialize Milestones
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TECH STACK TAB */}
          {activeTab === 'tech_stack' && (
            <motion.div 
              key="tech_stack"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-outline-variant/30">
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Core Dependency Mapping</span>
                <button 
                  onClick={() => setShowAddDep(!showAddDep)}
                  className="bg-primary text-on-primary border border-black px-4 py-2 rounded-none font-mono text-[9px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Incorporate Stack Item</span>
                </button>
              </div>

              {/* Add Dependency Form */}
              {showAddDep && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleAddDependency}
                  className="bg-surface-container-low border border-black p-5 space-y-4"
                >
                  <h3 className="font-serif italic font-medium text-lg text-primary">Incorporate New Stack Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Package / Tool Name</label>
                      <input 
                        type="text" 
                        value={depName} 
                        onChange={e => setDepName(e.target.value)} 
                        placeholder="e.g. Redux Toolkit" 
                        className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Category Type</label>
                      <select 
                        value={depType} 
                        onChange={e => setDepType(e.target.value)} 
                        className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                      >
                        <option value="Core Framework">Core Framework</option>
                        <option value="Type Safety">Type Safety</option>
                        <option value="Styling">Styling</option>
                        <option value="Database">Database</option>
                        <option value="Cache">Cache</option>
                        <option value="AI Service Integration">AI Service Integration</option>
                        <option value="Visualization">Visualization</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Icon Variant</label>
                      <select 
                        value={depIcon} 
                        onChange={e => setDepIcon(e.target.value)} 
                        className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                      >
                        <option value="code">Code Node (Framework/Language)</option>
                        <option value="palette">Visual Palette (CSS/Styling)</option>
                        <option value="shield-alert">Shield Protection (Auth/Security)</option>
                        <option value="database">Database Cylinder (Storage)</option>
                        <option value="cpu">CPU Processing (Heavy Math)</option>
                        <option value="hard-drive">Hard Drive (Caching/IO)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Integration Scope Modules (Comma-separated tags)</label>
                      <input 
                        type="text" 
                        value={depWhere} 
                        onChange={e => setDepWhere(e.target.value)} 
                        placeholder="e.g. global-state, auth-pipeline" 
                        className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Alternatives Evaluated</label>
                      <input 
                        type="text" 
                        value={depAlts} 
                        onChange={e => setDepAlts(e.target.value)} 
                        placeholder="e.g. MobX, Zustand, Recoil" 
                        className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Technical Architectural Rationale</label>
                    <textarea 
                      value={depWhy} 
                      onChange={e => setDepWhy(e.target.value)} 
                      placeholder="Why did the team opt for this specific component? Specify throughput, speed, or caching constraints..." 
                      rows={2.5}
                      className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddDep(false)}
                      className="px-4 py-2 font-mono text-[10px] text-on-surface-variant hover:text-on-surface uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-primary text-on-primary border border-black px-4 py-2 rounded-none font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all cursor-pointer"
                    >
                      Incorporate Item
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Stack Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {project.dependencies.map((dep, index) => (
                  <article 
                    key={dep.id || index}
                    className="p-5 border border-black bg-surface hover:bg-neutral-100/5 transition-all relative flex flex-col justify-between group"
                  >
                    <button 
                      onClick={() => handleDeleteDependency(dep.id)}
                      className="absolute right-4 top-4 p-1 text-on-surface-variant hover:text-tertiary border border-transparent hover:border-black transition-all rounded-none bg-transparent opacity-0 group-hover:opacity-100"
                      title="Remove Stack Element"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>

                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 border border-outline-variant/30 flex items-center justify-center bg-surface-container-low">
                          {getDependencyIcon(dep.icon)}
                        </div>
                        <span className="bg-primary text-white border border-black px-2.5 py-0.5 rounded-none font-mono text-[9px] uppercase tracking-wider">
                          {dep.type}
                        </span>
                      </div>

                      <h3 className="font-serif italic font-bold text-xl text-on-surface mb-3">
                        {dep.name}
                      </h3>

                      <div className="space-y-3 pt-1">
                        <div>
                          <p className="font-mono text-[9px] text-tertiary uppercase tracking-wider mb-0.5 font-bold">Why we use it</p>
                          <p className="text-on-surface-variant text-xs leading-relaxed">{dep.why}</p>
                        </div>
                        
                        <div>
                          <p className="font-mono text-[9px] text-on-surface-variant/60 uppercase tracking-wider mb-0.5 font-bold">Pipeline Scopes</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {dep.whereUsed.map((where, i) => (
                              <span key={i} className="font-mono text-[9px] bg-neutral-100 text-on-surface border border-outline-variant/20 px-1.5 py-0.5 rounded-none font-bold">
                                {where}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="font-mono text-[9px] text-on-surface-variant/40 uppercase tracking-wider mb-0.5">Alternatives considered</p>
                          <p className="font-mono text-[10px] text-on-surface-variant/70 italic">{dep.alternatives}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          )}

          {/* BLOGS & IDEAS TAB */}
          {activeTab === 'blogs_ideas' && (
            <motion.div 
              key="blogs_ideas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-outline-variant/30">
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Future Scope, Blogs & Ideas Logbook</span>
                <button 
                  onClick={() => setShowAddIdea(!showAddIdea)}
                  className="bg-primary text-on-primary border border-black px-4 py-2 rounded-none font-mono text-[9px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Scope Log</span>
                </button>
              </div>

              {/* Add Idea/Blog Form */}
              {showAddIdea && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleAddIdea}
                  className="bg-surface-container-low border border-black p-5 space-y-4"
                >
                  <h3 className="font-serif italic font-medium text-lg text-primary">Write New Log Entry</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Entry Title</label>
                      <input 
                        type="text" 
                        value={ideaTitle} 
                        onChange={e => setIdeaTitle(e.target.value)} 
                        placeholder="e.g. Serverless telemetry worker ideas" 
                        className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Entry Classification</label>
                      <select 
                        value={ideaType} 
                        onChange={e => setIdeaType(e.target.value as 'idea' | 'feature' | 'blog')} 
                        className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                      >
                        <option value="idea">Abstract Thought / Idea</option>
                        <option value="feature">Future Roadmap Feature</option>
                        <option value="blog">Developer Diary / Engineering Blog</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Scope Content / Dev Note Details</label>
                    <textarea 
                      value={ideaContent} 
                      onChange={e => setIdeaContent(e.target.value)} 
                      placeholder="Outline core paradigms, architectural sketches, or logs..." 
                      rows={4}
                      className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddIdea(false)}
                      className="px-4 py-2 font-mono text-[10px] text-on-surface-variant hover:text-on-surface uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-primary text-on-primary border border-black px-4 py-2 rounded-none font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all cursor-pointer"
                    >
                      Commit Log
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Ideas and Blogs list */}
              <div className="space-y-5">
                {currentIdeas.map((item) => {
                  const getBadgeColor = (type: string) => {
                    if (type === 'idea') return 'border-amber-600 bg-amber-50 text-amber-900';
                    if (type === 'feature') return 'border-emerald-600 bg-emerald-50 text-emerald-900';
                    return 'border-indigo-600 bg-indigo-50 text-indigo-900';
                  };

                  const getIcon = (type: string) => {
                    if (type === 'idea') return <Lightbulb className="w-4 h-4 text-amber-700 shrink-0" />;
                    if (type === 'feature') return <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />;
                    return <BookOpen className="w-4 h-4 text-indigo-700 shrink-0" />;
                  };

                  return (
                    <div 
                      key={item.id}
                      className="p-5 border border-black bg-white relative group"
                    >
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <div className="flex items-center gap-2.5">
                          {getIcon(item.type)}
                          <h4 className="font-serif italic font-bold text-xl text-primary leading-tight">
                            {item.title}
                          </h4>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-[8px] uppercase tracking-widest border px-2 py-0.5 rounded-none font-black ${getBadgeColor(item.type)}`}>
                            {item.type}
                          </span>
                          <span className="font-mono text-[9px] text-on-surface-variant/40 hidden sm:inline">{item.createdAt}</span>
                          <button 
                            onClick={() => handleDeleteIdea(item.id)}
                            className="p-1 text-on-surface-variant hover:text-tertiary opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-black bg-transparent"
                            title="Delete Entry"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-on-surface-variant leading-relaxed max-w-4xl whitespace-pre-line pl-6">
                        {item.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* AUDIO NOTES TAB */}
          {activeTab === 'quick_notes' && (
            <motion.div 
              key="quick_notes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="pb-2 border-b border-dashed border-outline-variant/30">
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Vocal Technical Memos & Wire Recorder</span>
              </div>

              {/* Recorder Terminal Console */}
              <div className="bg-surface border-2 border-black p-6 space-y-4 relative">
                <div className="absolute right-4 top-4 flex items-center gap-1.5 select-none font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/50">
                  <Activity className="w-3.5 h-3.5 text-tertiary animate-pulse" />
                  <span>MIC PROTOCOL v1.0</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif italic font-medium text-lg">Microphone Audio Capture Station</h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed max-w-xl">
                    Utilize the system's microphone device to record voice annotations. Audio clips are saved securely as base64 hashes within the repository data layer.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5 max-w-md">
                    <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Memo Title / Scope Identifier</label>
                    <input 
                      type="text" 
                      value={recordingTitle} 
                      onChange={e => setRecordingTitle(e.target.value)} 
                      placeholder="e.g. DB sharding strategy recap" 
                      disabled={isRecording}
                      className="w-full bg-white border border-black p-2.5 rounded-none font-mono text-xs focus:border-tertiary outline-none text-on-surface"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {isRecording ? (
                      <button 
                        type="button" 
                        onClick={stopRecording}
                        className="bg-tertiary text-white border border-black px-5 py-3 rounded-none font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-tertiary transition-all cursor-pointer animate-pulse"
                      >
                        <Square className="w-4 h-4 text-white" />
                        <span>STOP RECORDING</span>
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        onClick={startRecording}
                        className="bg-primary text-on-primary border border-black px-5 py-3 rounded-none font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-primary transition-all cursor-pointer"
                      >
                        <Mic className="w-4 h-4 text-white" />
                        <span>START MIC RECORDING</span>
                      </button>
                    )}

                    {isRecording && (
                      <div className="flex items-center gap-2 font-mono text-xs text-tertiary font-bold px-3 py-1 bg-red-50 border border-red-200">
                        <span className="w-2.5 h-2.5 bg-tertiary rounded-full animate-ping" />
                        <span>RECORDING AUDIO: {recordingSeconds} SECONDS</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recorded memos logs */}
              <div className="space-y-4 mt-6">
                <h4 className="font-mono text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Archived Voice Memos ({(project.quickNotes || []).length})</h4>
                
                <div className="space-y-3">
                  {(project.quickNotes || []).map((note) => (
                    <div 
                      key={note.id}
                      className="p-4 border border-black bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:bg-neutral-100/5 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 border border-outline-variant/20 bg-surface-container-low mt-0.5 shrink-0">
                          <Headphones className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h5 className="font-serif italic font-bold text-lg text-primary">{note.title}</h5>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/60">
                            <span>CAPTURED: {note.createdAt}</span>
                            <span className="opacity-50">|</span>
                            <span>DURATION: {note.duration} SECONDS</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <AudioPlayer base64={note.audioBase64} />
                        <button 
                          onClick={() => handleDeleteAudioNote(note.id)}
                          className="p-1.5 text-on-surface-variant hover:text-tertiary opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-black rounded-none bg-transparent"
                          title="Delete audio snippet"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {(project.quickNotes || []).length === 0 && (
                    <div className="border border-dashed border-outline-variant/40 p-10 text-center bg-surface-container-low/10">
                      <p className="text-on-surface-variant font-mono text-xs">No recorded audio memos stored for this project repo.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* PROJECT VELOCITY TAB */}
          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="pb-2 border-b border-dashed border-outline-variant/30 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Recharts Progress Analytics Engine</span>
                <span className="font-mono text-[9px] text-tertiary uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  REAL-TIME STATS SYNCHRONIZED
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Completion Progress Curve */}
                <div className="p-5 border border-black bg-white space-y-4">
                  <div>
                    <h3 className="font-serif italic font-bold text-xl">Historical Completion Curve</h3>
                    <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-mono">Cumulative project progress percentage over time</p>
                  </div>
                  
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={currentVelocity}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#525252" 
                          tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} 
                        />
                        <YAxis 
                          stroke="#525252" 
                          domain={[0, 100]}
                          tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #121212', 
                            borderRadius: '0px',
                            fontFamily: 'JetBrains Mono',
                            fontSize: '10px'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="progress" 
                          stroke="#000000" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorProgress)" 
                          name="Completion %"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Commit/Update Frequency */}
                <div className="p-5 border border-black bg-white space-y-4">
                  <div>
                    <h3 className="font-serif italic font-bold text-xl">Operational Activity Log</h3>
                    <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-mono">Updates, edits, and commits per recording cycle</p>
                  </div>
                  
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={currentVelocity}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#525252" 
                          tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} 
                        />
                        <YAxis 
                          stroke="#525252" 
                          tick={{ fontSize: 9, fontFamily: 'JetBrains Mono' }} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #121212', 
                            borderRadius: '0px',
                            fontFamily: 'JetBrains Mono',
                            fontSize: '10px'
                          }} 
                        />
                        <Bar 
                          dataKey="updates" 
                          fill="#dc2626" 
                          stroke="#121212"
                          strokeWidth={1}
                          name="Update Count" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Stats highlights banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 border border-black divide-y sm:divide-y-0 sm:divide-x divide-black bg-surface-container-low text-center select-none">
                <div className="p-4 space-y-1">
                  <p className="font-mono text-[9px] text-on-surface-variant/60 uppercase tracking-widest">Active Stages</p>
                  <p className="font-serif italic text-3xl font-bold text-primary">{currentPhases.filter(p => !p.isCompleted).length} Pending</p>
                </div>
                <div className="p-4 space-y-1">
                  <p className="font-mono text-[9px] text-on-surface-variant/60 uppercase tracking-widest">Completed Milestones</p>
                  <p className="font-serif italic text-3xl font-bold text-emerald-700">{currentPhases.filter(p => p.isCompleted).length} Stable</p>
                </div>
                <div className="p-4 space-y-1">
                  <p className="font-mono text-[9px] text-on-surface-variant/60 uppercase tracking-widest">Total Logs Committed</p>
                  <p className="font-serif italic text-3xl font-bold text-tertiary">{(project.dependencies.length + currentIdeas.length + (project.quickNotes || []).length)} Docs</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* DOCUMENTATION TAB */}
          {activeTab === 'documentation' && (
            <motion.div 
              key="documentation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-outline-variant/30">
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Archived Reference Handbooks</span>
                <button 
                  onClick={() => setShowAddDoc(!showAddDoc)}
                  className="bg-primary text-on-primary border border-black px-4 py-2 rounded-none font-mono text-[9px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Guide Link</span>
                </button>
              </div>

              {showAddDoc && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleAddDocumentation}
                  className="bg-surface-container-low border border-black p-5 space-y-4"
                >
                  <h3 className="font-serif italic font-medium text-lg text-primary">Log Reference Guide</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Manual Title</label>
                      <input 
                        type="text" 
                        value={docTitle} 
                        onChange={e => setDocTitle(e.target.value)} 
                        placeholder="e.g. AWS VPC Peering Best Practices" 
                        className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Category</label>
                      <select 
                        value={docCategory} 
                        onChange={e => setDocCategory(e.target.value)} 
                        className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                      >
                        <option value="Architecture">Architecture Map</option>
                        <option value="Guides">Engineering Handbook</option>
                        <option value="API Reference">API Specifications</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Uniform Resource Locator (URL)</label>
                    <input 
                      type="text" 
                      value={docUrl} 
                      onChange={e => setDocUrl(e.target.value)} 
                      placeholder="e.g. docs.aws.amazon.com/vpc/latest..." 
                      className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Manual Summary / Operational Abstract</label>
                    <textarea 
                      value={docSummary} 
                      onChange={e => setDocSummary(e.target.value)} 
                      placeholder="Summary of guidelines, setup parameters, and configurations..." 
                      rows={2}
                      className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddDoc(false)}
                      className="px-4 py-2 font-mono text-[10px] text-on-surface-variant hover:text-on-surface uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-primary text-on-primary border border-black px-4 py-2 rounded-none font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all cursor-pointer"
                    >
                      Log Guide
                    </button>
                  </div>
                </motion.form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {project.documentation.map((doc, index) => (
                  <div 
                    key={doc.id || index}
                    className="p-5 border border-black bg-white hover:bg-neutral-100/5 transition-all relative flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-[8px] border border-black px-2 py-0.5 bg-neutral-100 font-bold uppercase tracking-wider text-on-surface">
                          {doc.category}
                        </span>
                        
                        <button 
                          onClick={() => handleDeleteDocumentation(doc.id)}
                          className="p-1 text-on-surface-variant hover:text-tertiary opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-black bg-transparent rounded-none"
                          title="Remove Reference"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h3 className="font-serif italic font-bold text-xl text-primary mb-2">
                        {doc.title}
                      </h3>
                      <p className="text-on-surface-variant text-xs leading-relaxed mb-6">
                        {doc.summary}
                      </p>
                    </div>

                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-primary text-white border border-black px-4 py-2 rounded-none font-mono text-[9px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-1.5 self-start"
                    >
                      <span>BROWSE MANUAL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}

                {project.documentation.length === 0 && !showAddDoc && (
                  <div className="col-span-full border border-dashed border-outline-variant/40 p-12 text-center bg-surface-container-low/20">
                    <p className="text-on-surface-variant font-mono text-xs mb-3">No architecture manuals or guidelines cataloged.</p>
                    <button 
                      onClick={() => setShowAddDoc(true)}
                      className="bg-primary text-on-primary border border-black px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all cursor-pointer"
                    >
                      Log Core Document
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* PIPELINES TAB */}
          {activeTab === 'integrations' && (
            <motion.div 
              key="integrations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-outline-variant/30">
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Active Pipeline Integrations</span>
                <button 
                  onClick={() => setShowAddInt(!showAddInt)}
                  className="bg-primary text-on-primary border border-black px-4 py-2 rounded-none font-mono text-[9px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Connect Pipeline</span>
                </button>
              </div>

              {showAddInt && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleAddIntegration}
                  className="bg-surface-container-low border border-black p-5 space-y-4"
                >
                  <h3 className="font-serif italic font-medium text-lg text-primary">Connect Service Integration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Service Provider Name</label>
                      <input 
                        type="text" 
                        value={intName} 
                        onChange={e => setIntName(e.target.value)} 
                        placeholder="e.g. AWS CloudWatch Logs" 
                        className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Integration Type</label>
                      <select 
                        value={intType} 
                        onChange={e => setIntType(e.target.value)} 
                        className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface"
                      >
                        <option value="Deployment">Deployment</option>
                        <option value="Telemetry">Telemetry</option>
                        <option value="Registry">Registry</option>
                        <option value="Monitoring">Monitoring</option>
                        <option value="Compliance">Compliance</option>
                        <option value="Automation">Automation</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest block font-bold">Operational Description / Scope Abstract</label>
                    <textarea 
                      value={intDesc} 
                      onChange={e => setIntDesc(e.target.value)} 
                      placeholder="Specify automation triggers, telemetry metrics, or webhook operations..." 
                      rows={2}
                      className="w-full bg-white border border-outline-variant p-2.5 rounded-none font-mono text-xs focus:border-black outline-none text-on-surface resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddInt(false)}
                      className="px-4 py-2 font-mono text-[10px] text-on-surface-variant hover:text-on-surface uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-primary text-on-primary border border-black px-4 py-2 rounded-none font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all cursor-pointer"
                    >
                      Connect Integration
                    </button>
                  </div>
                </motion.form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {project.integrations.map((int, index) => (
                  <div 
                    key={int.id || index}
                    className="p-5 border border-black bg-white hover:bg-neutral-100/5 transition-all relative flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-[8px] border border-black px-2 py-0.5 bg-neutral-100 font-bold uppercase tracking-wider text-on-surface">
                          {int.type}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleIntegrationStatus(int.id)}
                            className="px-2 py-0.5 border border-black font-mono text-[8px] uppercase tracking-widest font-black bg-white hover:bg-neutral-100 cursor-pointer"
                            title="Toggle Status"
                          >
                            TOGGLE PIPELINE
                          </button>
                          <button 
                            onClick={() => handleDeleteIntegration(int.id)}
                            className="p-1 text-on-surface-variant hover:text-tertiary opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-black bg-transparent rounded-none"
                            title="Disconnect Integration"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-serif italic font-bold text-xl text-primary mb-2">
                        {int.name}
                      </h3>
                      <p className="text-on-surface-variant text-xs leading-relaxed mb-6">
                        {int.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-dashed border-outline-variant/30 pt-3 mt-auto">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-on-surface-variant/40">SYSTEM STATE STATUS</span>
                      <span className={`font-mono text-[9px] uppercase tracking-wider font-black ${
                        int.status === 'active' ? 'text-emerald-700' : 'text-on-surface-variant/55'
                      }`}>
                        ● {int.status === 'active' ? 'ACTIVE PIPELINE' : 'PIPELINE DISCONNECTED'}
                      </span>
                    </div>
                  </div>
                ))}

                {project.integrations.length === 0 && !showAddInt && (
                  <div className="col-span-full border border-dashed border-outline-variant/40 p-12 text-center bg-surface-container-low/20">
                    <p className="text-on-surface-variant font-mono text-xs mb-3">No active service integration pipelines established.</p>
                    <button 
                      onClick={() => setShowAddInt(true)}
                      className="bg-primary text-on-primary border border-black px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all cursor-pointer"
                    >
                      Connect Integration Pipeline
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
