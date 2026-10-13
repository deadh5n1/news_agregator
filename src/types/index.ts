export type UserRole = 'USER' | 'EDITOR' | 'ADMIN';
export type SourceStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'ERROR' | 'BANNED';
export type SourcePriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type ProcessingStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED' | 'DUPLICATE';
export type PublicationStatus = 'ACTIVE' | 'HIDDEN' | 'DELETED';
export type PreparedStatus = 'DRAFT' | 'APPROVED' | 'REJECTED' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';
export type ScheduleStatus = 'QUEUED' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';
export type ModerationAction = 'APPROVED' | 'REJECTED' | 'EDITED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}

export interface Source {
  id: string;
  externalId: string;
  name: string;
  url: string;
  avatarUrl?: string;
  description?: string;
  categoryId?: string;
  language: string;
  status: SourceStatus;
  priority: SourcePriority;
  followersCount: number;
  postsCount: number;
  engagementRate: number;
  growthRate: number;
  pollingIntervalMin: number;
  lastPostAt?: string;
  lastCheckedAt?: string;
  addedBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RawPublication {
  id: string;
  sourceId: string;
  externalPostId: string;
  rawPayload: Record<string, unknown>;
  fetchedAt: string;
  processingStatus: ProcessingStatus;
  errorMessage?: string;
}

export interface Publication {
  id: string;
  sourceId: string;
  sourceName: string;
  externalPostId: string;
  title: string;
  bodyText: string;
  summary: string;
  url?: string;
  publishedAt: string;
  collectedAt: string;
  contentHash: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  category?: string;
  tags: string[];
  importanceScore: number;
  status: PublicationStatus;
  media?: MediaItem[];
}

export interface MediaItem {
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

export interface PreparedPublication {
  id: string;
  originalPublicationId: string;
  sourceId: string;
  sourceName: string;
  adaptedText: string;
  title: string;
  media: MediaItem[];
  templateId?: string;
  customHashtags: string[];
  ctaText?: string;
  status: PreparedStatus;
  moderatorId?: string;
  moderationComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationTemplate {
  id: string;
  name: string;
  structure: string;
  example: string;
  isActive: boolean;
  createdAt: string;
}

export interface PublicationSchedule {
  id: string;
  preparedPublicationId: string;
  scheduledAt: string;
  status: ScheduleStatus;
  retryCount: number;
  publishedAt?: string;
  errorMessage?: string;
}

export interface PublicationAnalytics {
  id: string;
  publicationId: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagementRate: number;
  updatedAt: string;
}

export interface DashboardStats {
  totalSources: number;
  activeSources: number;
  publicationsToday: number;
  publicationsWeek: number;
  pendingModeration: number;
  scheduledToday: number;
  publishedToday: number;
  totalReach: number;
}

export interface SourceMetricsHistory {
  id: string;
  sourceId: string;
  date: string;
  followersCount: number;
  postsCount: number;
  engagementRate: number;
  growthDelta: number;
}
