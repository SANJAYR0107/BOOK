export interface Chapter {
  id: number;
  title: string;
  subtitle?: string;
  pageNumber: number;
}

export interface BookPage {
  pageNumber: number;
  image: string;
  title?: string;
  isCover?: boolean;
  isThought?: boolean;
  thoughtText?: string;
}

export type ViewMode = '3d' | '2d' | 'pdf';
export type LightingTheme = 'warm' | 'midnight' | 'studio';

export interface ReadingState {
  currentPage: number; // 1 to 30
  totalPages: number;
  isBookOpen: boolean;
  viewMode: ViewMode;
  isMuted: boolean;
  isAmbientPlaying: boolean;
  lightingTheme: LightingTheme;
  isInspectMode: boolean;
  bookmarks: number[];
}
