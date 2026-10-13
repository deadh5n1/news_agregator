import { create } from 'zustand';
import { Source, Publication, PreparedPublication, PublicationTemplate, PublicationSchedule, Category, DashboardStats, PreparedStatus, SourceStatus } from '../types';
import { sources as mockSources, publications as mockPublications, preparedPublications as mockPrepared, templates as mockTemplates, schedules as mockSchedules, categories as mockCategories, dashboardStats as mockStats } from '../data/mockData';

interface AppState {
  // Data
  sources: Source[];
  publications: Publication[];
  preparedPublications: PreparedPublication[];
  templates: PublicationTemplate[];
  schedules: PublicationSchedule[];
  categories: Category[];
  stats: DashboardStats;

  // UI State
  sidebarOpen: boolean;
  currentPage: string;
  searchQuery: string;
  selectedSource: string | null;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedSource: (id: string | null) => void;
  setNotification: (notification: { type: 'success' | 'error' | 'info'; message: string } | null) => void;

  // Source actions
  addSource: (source: Partial<Source>) => void;
  updateSourceStatus: (id: string, status: SourceStatus) => void;
  deleteSource: (id: string) => void;

  // Publication actions
  updatePreparedStatus: (id: string, status: PreparedStatus, comment?: string) => void;
  updatePreparedText: (id: string, text: string) => void;
  schedulePublication: (preparedId: string, scheduledAt: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sources: mockSources,
  publications: mockPublications,
  preparedPublications: mockPrepared,
  templates: mockTemplates,
  schedules: mockSchedules,
  categories: mockCategories,
  stats: mockStats,

  sidebarOpen: true,
  currentPage: 'dashboard',
  searchQuery: '',
  selectedSource: null,
  notification: null,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedSource: (id) => set({ selectedSource: id }),
  setNotification: (notification) => set({ notification }),

  addSource: (sourceData) => set((state) => ({
    sources: [...state.sources, {
      id: String(Date.now()),
      externalId: sourceData.externalId || '',
      name: sourceData.name || '',
      url: sourceData.url || '',
      avatarUrl: sourceData.avatarUrl,
      description: sourceData.description,
      categoryId: sourceData.categoryId,
      language: sourceData.language || 'ru',
      status: 'ACTIVE',
      priority: sourceData.priority || 'MEDIUM',
      followersCount: 0,
      postsCount: 0,
      engagementRate: 0,
      growthRate: 0,
      pollingIntervalMin: sourceData.pollingIntervalMin || 30,
      addedBy: 'admin',
      notes: sourceData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Source]
  })),

  updateSourceStatus: (id, status) => set((state) => ({
    sources: state.sources.map(s => s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s)
  })),

  deleteSource: (id) => set((state) => ({
    sources: state.sources.filter(s => s.id !== id)
  })),

  updatePreparedStatus: (id, status, comment) => set((state) => ({
    preparedPublications: state.preparedPublications.map(p =>
      p.id === id ? { ...p, status, moderationComment: comment || p.moderationComment, updatedAt: new Date().toISOString() } : p
    )
  })),

  updatePreparedText: (id, text) => set((state) => ({
    preparedPublications: state.preparedPublications.map(p =>
      p.id === id ? { ...p, adaptedText: text, updatedAt: new Date().toISOString() } : p
    )
  })),

  schedulePublication: (preparedId, scheduledAt) => set((state) => ({
    schedules: [...state.schedules, {
      id: String(Date.now()),
      preparedPublicationId: preparedId,
      scheduledAt,
      status: 'SCHEDULED',
      retryCount: 0,
    }],
    preparedPublications: state.preparedPublications.map(p =>
      p.id === preparedId ? { ...p, status: 'SCHEDULED' as PreparedStatus } : p
    )
  })),
}));
