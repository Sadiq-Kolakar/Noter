export interface Dependency {
  id: string;
  name: string;
  type: string; // e.g. "Core Framework", "Visualization", "Styling", "Cache", "Type Safety"
  why: string;
  whereUsed: string[];
  alternatives: string;
  icon: string; // e.g. "terminal", "network", "shield", "box", "sparkles", "database", "palette"
}

export interface Documentation {
  id: string;
  title: string;
  url: string;
  summary: string;
  category: string; // "Architecture", "Guides", "API Reference"
}

export interface Integration {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  type: string;
  description: string;
}

export interface ProjectPhase {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  targetDate?: string;
  tasks?: { id: string; text: string; isCompleted: boolean }[];
  notes?: string;
}

export interface IdeaOrBlog {
  id: string;
  type: 'idea' | 'feature' | 'blog';
  title: string;
  content: string;
  createdAt: string;
}

export interface QuickNote {
  id: string;
  title: string;
  audioBase64: string;
  duration: number; // in seconds
  createdAt: string;
}

export interface ProjectVelocityPoint {
  date: string;
  progress: number;
  updates: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  phases: number;
  progress: number;
  lastUpdated: string;
  isLocked?: boolean;
  isFavorite?: boolean;
  isWide?: boolean;
  isVisibleOff?: boolean;
  icon: string;
  iconType: 'terminal' | 'api' | 'security' | 'inventory' | 'sparkles' | 'database';
  members?: string[];
  tags?: string[];
  isArchived: boolean;
  dependencies: Dependency[];
  documentation: Documentation[];
  integrations: Integration[];
  phasesList?: ProjectPhase[];
  ideasOrBlogs?: IdeaOrBlog[];
  quickNotes?: QuickNote[];
  velocityData?: ProjectVelocityPoint[];
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'kernel-extensions',
    title: 'Kernel Extensions',
    description: 'Deep dive into macOS kernel extensions and system architecture notes for the new performance monitor.',
    phases: 4,
    progress: 65,
    lastUpdated: '2 days ago',
    icon: 'terminal',
    iconType: 'terminal',
    members: ['JD', '+2'],
    tags: ['frontend', 'dashboard'],
    isArchived: false,
    dependencies: [
      {
        id: 'react',
        name: 'React',
        type: 'Core Framework',
        why: 'Fast rendering via virtual DOM and robust component-based ecosystem for scaling complex UIs.',
        whereUsed: ['frontend', 'dashboard'],
        alternatives: 'Vue.js, Svelte',
        icon: 'code'
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        type: 'Type Safety',
        why: 'Ensures runtime stability and improves developer experience through strict type definitions.',
        whereUsed: ['fullstack', 'dx'],
        alternatives: 'Flow, Vanilla JS',
        icon: 'shield-alert'
      },
      {
        id: 'tailwind-css',
        name: 'Tailwind CSS',
        type: 'Styling',
        why: 'Utility-first approach accelerates UI iteration without leaving the HTML. Tight integration with the design system tokens.',
        whereUsed: ['global-styles', 'component-library'],
        alternatives: 'Styled Components, CSS Modules',
        icon: 'palette'
      }
    ],
    documentation: [
      {
        id: 'doc-1',
        title: 'macOS Kernel Architecture Guide',
        url: 'https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/',
        summary: 'Official Apple documentation detailing the fundamental structure of the Darwin kernel.',
        category: 'Architecture'
      },
      {
        id: 'doc-2',
        title: 'I/O Kit Framework Reference',
        url: 'https://developer.apple.com/documentation/iokit',
        summary: 'API guidelines for writing device drivers and kernel-level accessories in macOS.',
        category: 'API Reference'
      }
    ],
    integrations: [
      {
        id: 'int-1',
        name: 'GitHub Actions CI/CD',
        status: 'active',
        type: 'Automation',
        description: 'Auto-builds kernel modules on macOS runner instances for quick validation.'
      },
      {
        id: 'int-2',
        name: 'Sentry Crash Reporting',
        status: 'active',
        type: 'Monitoring',
        description: 'Real-time telemetry and symbolicated backtraces for panic diagnostics.'
      }
    ]
  },
  {
    id: 'graphql-schema',
    title: 'GraphQL Schema',
    description: 'Centralized documentation for the microservices orchestration layer and federation protocols.',
    phases: 2,
    progress: 24,
    lastUpdated: '5 hours ago',
    isLocked: true,
    icon: 'api',
    iconType: 'api',
    tags: ['backend', 'gateway'],
    isArchived: false,
    dependencies: [
      {
        id: 'apollo',
        name: 'Apollo Federation',
        type: 'Gateway Orchestration',
        why: 'Enables sub-graph merging and declarative composition of distributed service APIs.',
        whereUsed: ['gateway', 'edge-routing'],
        alternatives: 'GraphQL-Mesh, Schema Stitching',
        icon: 'share-2'
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        type: 'Type Safety',
        why: 'Generates robust type bindings directly from schema definitions to prevent payload mismatches.',
        whereUsed: ['fullstack', 'dx'],
        alternatives: 'Flow, Vanilla JS',
        icon: 'shield-alert'
      }
    ],
    documentation: [
      {
        id: 'doc-graphql-1',
        title: 'Orchestration Standards Handbook',
        url: 'https://graphql.org/learn/',
        summary: 'Internal engineering standard detailing query optimization, security directives, and rate limiting.',
        category: 'Guides'
      }
    ],
    integrations: [
      {
        id: 'int-graphql-1',
        name: 'Apollo Studio',
        status: 'active',
        type: 'Registry',
        description: 'Registry and schema checks for backward compatibility testing on pull requests.'
      }
    ]
  },
  {
    id: 'secops-handbook',
    title: 'SecOps Handbook',
    description: 'Security protocols, incident response playbooks, and compliance checklists for the 2024 audit.',
    phases: 8,
    progress: 92,
    lastUpdated: '1 day ago',
    isFavorite: true,
    icon: 'security',
    iconType: 'security',
    tags: ['compliance', 'security'],
    isArchived: false,
    dependencies: [
      {
        id: 'terraform',
        name: 'Terraform Sec-Checks',
        type: 'Infrastructure Security',
        why: 'Declarative audits for cloud architecture IAM rules and public exposure states.',
        whereUsed: ['ci-pipeline', 'iac-checks'],
        alternatives: 'Pulumi, CloudFormation',
        icon: 'server'
      }
    ],
    documentation: [
      {
        id: 'doc-secops-1',
        title: 'SOC2 Type II Readiness Blueprint',
        url: 'https://www.aicpa.org/topic/audit-assurance/audit-and-assurance',
        summary: 'Interactive audit scope checklist covering access controls, encryption standards, and monitoring pipelines.',
        category: 'Architecture'
      }
    ],
    integrations: [
      {
        id: 'int-secops-1',
        name: 'AWS Security Hub',
        status: 'active',
        type: 'Compliance',
        description: 'Aggregates security alerts and compliance scores into a centralized console.'
      }
    ]
  },
  {
    id: 'architecture-blueprints',
    title: 'Architecture Blueprints',
    description: 'Global cloud infrastructure map, database sharding strategies, and multi-region deployment notes. High priority project for Q3 transition.',
    phases: 12,
    progress: 48,
    lastUpdated: '2 days ago',
    isWide: true,
    icon: 'inventory',
    iconType: 'inventory',
    tags: ['cloud', 'infra', 'database'],
    isArchived: false,
    dependencies: [
      {
        id: 'redis',
        name: 'Redis',
        type: 'Cache',
        why: 'Low-latency session management and temporary data persistence for real-time collaboration.',
        whereUsed: ['backend', 'real-time'],
        alternatives: 'Memcached',
        icon: 'hard-drive'
      },
      {
        id: 'kubernetes',
        name: 'Kubernetes',
        type: 'Orchestration',
        why: 'Automates deployment, scaling, and operations of application containers across clusters.',
        whereUsed: ['cloud-infra', 'scaling'],
        alternatives: 'Docker Swarm, AWS ECS',
        icon: 'cpu'
      },
      {
        id: 'postgresql',
        name: 'PostgreSQL Shards',
        type: 'Database',
        why: 'Structured horizontal data sharding for multi-region resilience and low-latency local queries.',
        whereUsed: ['database-layer', 'regional-nodes'],
        alternatives: 'CockroachDB, Spanner',
        icon: 'database'
      }
    ],
    documentation: [
      {
        id: 'doc-arch-1',
        title: 'Q3 Transition Playbook',
        url: '#',
        summary: 'Phased migration steps from monolith to multi-region Kubernetes deployment.',
        category: 'Guides'
      }
    ],
    integrations: [
      {
        id: 'int-arch-1',
        name: 'Datadog APM',
        status: 'active',
        type: 'Telemetry',
        description: 'Tracing, service maps, and error tracking across multi-cluster Kubernetes nodes.'
      }
    ]
  },
  {
    id: 'ai-experimentation',
    title: 'AI Experimentation',
    description: 'LLM prompt engineering techniques, fine-tuning datasets, and ethical boundary testing results.',
    phases: 3,
    progress: 10,
    lastUpdated: '1 week ago',
    isVisibleOff: true,
    icon: 'sparkles',
    iconType: 'sparkles',
    tags: ['ai', 'llm', 'research'],
    isArchived: false,
    dependencies: [
      {
        id: 'google-genai',
        name: '@google/genai',
        type: 'AI Service Integration',
        why: 'Provides native, production-grade access to Gemini models with structured schema generation and grounding.',
        whereUsed: ['prompt-service', 'dataset-cleaning'],
        alternatives: 'OpenAI SDK, custom HTTP client',
        icon: 'sparkles'
      }
    ],
    documentation: [
      {
        id: 'doc-ai-1',
        title: 'Gemini Technical Guidelines',
        url: 'https://ai.google.dev/docs',
        summary: 'Best practices for prompt styling, token management, and safety settings.',
        category: 'Guides'
      }
    ],
    integrations: [
      {
        id: 'int-ai-1',
        name: 'Google AI Studio Dev Hub',
        status: 'active',
        type: 'AI Integration',
        description: 'Auto-syncs prompt files and parameters directly with shared workspace buckets.'
      }
    ]
  },
  // The remaining 7 projects are pre-loaded (some archived, some hidden) to total exactly 12 active/total repositories
  {
    id: 'project-phoenix',
    title: 'Project Phoenix',
    description: 'Next-generation web portal featuring high-performance 3D rendering and microservices orchestration.',
    phases: 5,
    progress: 42,
    lastUpdated: '3 hours ago',
    icon: 'database',
    iconType: 'database',
    tags: ['frontend', 'visualization', 'cache'],
    isArchived: false,
    dependencies: [
      {
        id: 'react',
        name: 'React',
        type: 'Core Framework',
        why: 'Fast rendering via virtual DOM and robust component-based ecosystem for scaling complex UIs.',
        whereUsed: ['frontend', 'dashboard'],
        alternatives: 'Vue.js, Svelte',
        icon: 'code'
      },
      {
        id: 'three-js',
        name: 'Three.js',
        type: 'Visualization',
        why: 'Industry standard for WebGL orchestration, enabling interactive 3D topography of data clusters.',
        whereUsed: ['data-viz', 'hero-scene'],
        alternatives: 'Babylon.js',
        icon: 'rotate-3d'
      },
      {
        id: 'tailwind-css',
        name: 'Tailwind CSS',
        type: 'Styling',
        why: 'Utility-first approach accelerates UI iteration without leaving the HTML. Tight integration with the design system tokens.',
        whereUsed: ['global-styles', 'component-library'],
        alternatives: 'Styled Components, CSS Modules',
        icon: 'palette'
      },
      {
        id: 'redis',
        name: 'Redis',
        type: 'Cache',
        why: 'Low-latency session management and temporary data persistence for real-time collaboration.',
        whereUsed: ['backend', 'real-time'],
        alternatives: 'Memcached',
        icon: 'hard-drive'
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        type: 'Type Safety',
        why: 'Ensures runtime stability and improves developer experience through strict type definitions.',
        whereUsed: ['fullstack', 'dx'],
        alternatives: 'Flow, Vanilla JS',
        icon: 'shield-alert'
      }
    ],
    documentation: [
      {
        id: 'phx-doc-1',
        title: 'Project Phoenix Architecture Layout',
        url: '#',
        summary: 'High-level structure blueprint detailing core layout components and server connections.',
        category: 'Architecture'
      }
    ],
    integrations: [
      {
        id: 'phx-int-1',
        name: 'Vercel Deployment Edge',
        status: 'active',
        type: 'Deployment',
        description: 'Auto-deploys the frontend layer to high-performance edge nodes.'
      }
    ]
  },
  {
    id: 'legacy-monolith',
    title: 'Legacy API Gateway',
    description: 'Older Node/Express gateway being phased out during the migration to GraphQL schemas.',
    phases: 1,
    progress: 100,
    lastUpdated: '3 weeks ago',
    icon: 'api',
    iconType: 'api',
    isArchived: true,
    dependencies: [],
    documentation: [],
    integrations: []
  },
  {
    id: 'compliance-auditor',
    title: 'Compliance Auditor v2',
    description: 'Internal tool validating Docker registry security and SOC2 policy compliance automatically.',
    phases: 5,
    progress: 88,
    lastUpdated: '1 month ago',
    icon: 'security',
    iconType: 'security',
    isArchived: true,
    dependencies: [],
    documentation: [],
    integrations: []
  },
  {
    id: 'telemetry-collector',
    title: 'Telemetry Collector',
    description: 'Go-based collector daemon harvesting cluster performance diagnostics in real-time.',
    phases: 4,
    progress: 95,
    lastUpdated: '2 months ago',
    icon: 'terminal',
    iconType: 'terminal',
    isArchived: true,
    dependencies: [],
    documentation: [],
    integrations: []
  },
  {
    id: 'backup-manager',
    title: 'Multi-Region Backup Manager',
    description: 'Database backup utility managing point-in-time snapshots to secure S3 storage buckets.',
    phases: 3,
    progress: 100,
    lastUpdated: '5 days ago',
    icon: 'inventory',
    iconType: 'inventory',
    isArchived: true,
    dependencies: [],
    documentation: [],
    integrations: []
  },
  {
    id: 'developer-onboarding',
    title: 'Developer Onboarding Guide',
    description: 'Unified documentation repository helping new engineers set up local dev containers and check out projects.',
    phases: 2,
    progress: 100,
    lastUpdated: '4 days ago',
    icon: 'sparkles',
    iconType: 'sparkles',
    isArchived: true,
    dependencies: [],
    documentation: [],
    integrations: []
  },
  {
    id: 'infra-monitoring',
    title: 'Infrastructure Monitoring Dashboard',
    description: 'React-based tracking portal visualization for physical cluster heatmaps and container health indicators.',
    phases: 6,
    progress: 75,
    lastUpdated: '6 days ago',
    icon: 'inventory',
    iconType: 'inventory',
    isArchived: true,
    dependencies: [],
    documentation: [],
    integrations: []
  }
];
