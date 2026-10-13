import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
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
  updatePreparedStatus: (id: string, status: PreparedStatus, moderatorId?: string, comment?: string) => void;
  updatePreparedText: (id: string, text: string) => void;
  schedulePublication: (preparedId: string, scheduledAt: Date) => void;
  
  // Validation
  canTransitionStatus: (currentStatus: PreparedStatus, newStatus: PreparedStatus) => boolean;
  hasScheduledTask: (preparedId: string) => boolean;
}

// Valid status transitions
const validTransitions: Record<PreparedStatus, PreparedStatus[]> = {
  DRAFT: ['APPROVED', 'REJECTED'],
  APPROVED: ['SCHEDULED', 'REJECTED'],
  REJECTED: ['DRAFT', 'APPROVED'],
  SCHEDULED: ['PUBLISHING', 'DRAFT'],
  PUBLISHING: ['PUBLISHED', 'FAILED'],
  PUBLISHED: [],
  FAILED: ['SCHEDULED', 'DRAFT'],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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

      addSource: (sourceData) => set((state) => {
        // Check for duplicate externalId
        if (sourceData.externalId && state.sources.some(s => s.externalId === sourceData.externalId)) {
          set({ notification: { type: 'error', message: 'Канал с таким ID уже существует' } });
          return state;
        }

        return {
          sources: [...state.sources, {
            id: uuidv4(),
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
        };
      }),

      updateSourceStatus: (id, status) => set((state) => ({
        sources: state.sources.map(s => s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s)
      })),

      deleteSource: (id) => set((state) => ({
        sources: state.sources.filter(s => s.id !== id)
      })),

      updatePreparedStatus: (id, status, moderatorId, comment) => set((state) => {
        const publication = state.preparedPublications.find(p => p.id === id);
        if (!publication) return state;

        // Validate status transition
        if (!validTransitions[publication.status].includes(status)) {
          set({ notification: { type: 'error', message: `Недопустимый переход: ${publication.status} → ${status}` } });
          return state;
        }

        return {
          preparedPublications: state.preparedPublications.map(p =>
            p.id === id ? {
              ...p,
              status,
              moderatorId: moderatorId || p.moderatorId,
              moderationComment: comment || p.moderationComment,
              updatedAt: new Date().toISOString()
            } : p
          )
        };
      }),

      updatePreparedText: (id, text) => set((state) => ({
        preparedPublications: state.preparedPublications.map(p =>
          p.id === id ? { ...p, adaptedText: text, updatedAt: new Date().toISOString() } : p
        )
      })),

      schedulePublication: (preparedId, scheduledAt) => set((state) => {
        // Check if already scheduled
        if (state.schedules.some(s => s.preparedPublicationId === preparedId)) {
          set({ notification: { type: 'error', message: 'Публикация уже запланирована' } });
          return state;
        }

        const publication = state.preparedPublications.find(p => p.id === preparedId);
        if (!publication || !validTransitions[publication.status].includes('SCHEDULED')) {
          set({ notification: { type: 'error', message: 'Невозможно запланировать публикацию с текущим статусом' } });
          return state;
        }

        return {
          schedules: [...state.schedules, {
            id: uuidv4(),
            preparedPublicationId: preparedId,
            scheduledAt: scheduledAt.toISOString(),
            status: 'SCHEDULED',
            retryCount: 0,
          }],
          preparedPublications: state.preparedPublications.map(p =>
            p.id === preparedId ? { ...p, status: 'SCHEDULED' as PreparedStatus, updatedAt: new Date().toISOString() } : p
          )
        };
      }),

      canTransitionStatus: (currentStatus, newStatus) => {
        return validTransitions[currentStatus].includes(newStatus);
      },

      hasScheduledTask: (preparedId) => {
        return get().schedules.some(s => s.preparedPublicationId === preparedId);
      },
    }),
    {
      name: 'maxnews-storage',
      partialize: (state) => ({
        sources: state.sources,
        preparedPublications: state.preparedPublications,
        schedules: state.schedules,
      }),
    }
  )
);
