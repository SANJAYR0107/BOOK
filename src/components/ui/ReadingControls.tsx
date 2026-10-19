import React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  BookmarkIcon,
  Volume2Icon,
  VolumeXIcon,
  MusicIcon,
  MaximizeIcon,
  MinimizeIcon,
  ListIcon,
  LampIcon,
  CompassIcon,
  CloseIcon,
} from '../common/Icons';
import type { LightingTheme, ViewMode } from '../../types/book';
import { CHAPTERS } from '../../data/bookData';

interface ReadingControlsProps {
  currentPage: number;
  totalPages: number;
  isBookmarked: boolean;
  isMuted: boolean;
  isAmbientPlaying: boolean;
  lightingTheme: LightingTheme;
  isInspectMode: boolean;
  viewMode: ViewMode;
  isFullscreen: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  onJumpToPage: (page: number) => void;
  onToggleBookmark: () => void;
  onToggleMute: () => void;
  onToggleAmbient: () => void;
  onChangeLighting: (theme: LightingTheme) => void;
  onToggleInspect: () => void;
  onChangeViewMode: (mode: ViewMode) => void;
  onToggleFullscreen: () => void;
  onCloseBook: () => void;
  onOpenTOC: () => void;
}

export const ReadingControls: React.FC<ReadingControlsProps> = ({
  currentPage,
  totalPages,
  isBookmarked,
  isMuted,
  isAmbientPlaying,
  lightingTheme,
  isInspectMode,
  viewMode,
  isFullscreen,
  onPrevPage,
  onNextPage,
  onFirstPage,
  onLastPage,
  onJumpToPage,
  onToggleBookmark,
  onToggleMute,
  onToggleAmbient,
  onChangeLighting,
  onToggleInspect,
  onChangeViewMode,
  onToggleFullscreen,
  onCloseBook,
  onOpenTOC,
}) => {
  // Find current chapter
  const currentChapter = [...CHAPTERS]
    .reverse()
    .find((ch) => currentPage >= ch.pageNumber);

  // Format page display
  const leftPageNum = currentPage === 1 ? 1 : currentPage % 2 === 0 ? currentPage : currentPage - 1;
  const rightPageNum = currentPage === 1 ? null : leftPageNum + 1 <= totalPages ? leftPageNum + 1 : null;
  const pageLabel =
    currentPage === 1
      ? 'Cover (Page 1)'
      : rightPageNum
      ? `Pages ${leftPageNum}–${rightPageNum} of ${totalPages}`
      : `Page ${leftPageNum} of ${totalPages}`;

  const progressPercent = Math.round((currentPage / totalPages) * 100);

  const cycleLighting = () => {
    const themes: LightingTheme[] = ['warm', 'midnight', 'studio'];
    const nextIdx = (themes.indexOf(lightingTheme) + 1) % themes.length;
    onChangeLighting(themes[nextIdx]);
  };

  return (
    <div className="reading-controls-container">
      {/* Top Floating Glassmorphism Bar */}
      <header className="reading-top-bar">
        <div className="top-left-actions">
          <button className="control-btn" onClick={onCloseBook} title="Close Book & Return Home">
            <CloseIcon size={18} />
            <span className="btn-label-desktop">Close Book</span>
          </button>
          <button className="control-btn" onClick={onOpenTOC} title="Chapters & Table of Contents">
            <ListIcon size={18} />
            <span className="btn-label-desktop">Contents</span>
          </button>
        </div>

        {/* Current Chapter & Spread Status */}
        <div className="top-center-meta">
          <div className="active-chapter-title">
            {currentChapter?.title} {currentChapter?.subtitle ? `— ${currentChapter.subtitle}` : ''}
          </div>
          <div className="active-page-number">{pageLabel}</div>
        </div>

        {/* Top Right Tool Icons */}
        <div className="top-right-actions">
          {/* Bookmark Button */}
          <button
            className={`control-btn ${isBookmarked ? 'active-gold' : ''}`}
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this page'}
          >
            <BookmarkIcon size={18} filled={isBookmarked} />
          </button>

          {/* Ambient Music Toggle */}
          <button
            className={`control-btn ${isAmbientPlaying ? 'active-gold' : ''}`}
            onClick={onToggleAmbient}
            title={isAmbientPlaying ? 'Stop Ambient Atmosphere' : 'Play Gentle Ambient Atmosphere'}
          >
            <MusicIcon size={18} />
          </button>

          {/* Page Turn Sound Mute */}
          <button
            className="control-btn"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isMuted ? <VolumeXIcon size={18} /> : <Volume2Icon size={18} />}
          </button>

          {/* Lighting Theme Picker */}
          {viewMode === '3d' && (
            <button
              className="control-btn"
              onClick={cycleLighting}
              title={`Lighting: ${lightingTheme} (Click to change)`}
            >
              <LampIcon size={18} />
            </button>
          )}

          {/* 3D Inspect Mode Toggle */}
          {viewMode === '3d' && (
            <button
              className={`control-btn ${isInspectMode ? 'active-gold' : ''}`}
              onClick={onToggleInspect}
              title={isInspectMode ? 'Exit Free 3D Orbit' : 'Inspect 3D Book Free Orbit'}
            >
              <CompassIcon size={18} />
            </button>
          )}

          {/* View Mode Dropdown / Button */}
          <div className="view-mode-selector">
            <button
              className={`mode-btn ${viewMode === '3d' ? 'active' : ''}`}
              onClick={() => onChangeViewMode('3d')}
              title="Realistic 3D Virtual Book"
            >
              3D
            </button>
            <button
              className={`mode-btn ${viewMode === '2d' ? 'active' : ''}`}
              onClick={() => onChangeViewMode('2d')}
              title="2D Flipbook Mode"
            >
              2D
            </button>
            <button
              className={`mode-btn ${viewMode === 'pdf' ? 'active' : ''}`}
              onClick={() => onChangeViewMode('pdf')}
              title="Original PDF Reader"
            >
              PDF
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            className="control-btn"
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <MinimizeIcon size={18} /> : <MaximizeIcon size={18} />}
          </button>
        </div>
      </header>

      {/* Bottom Floating Navigation Bar */}
      <footer className="reading-bottom-bar">
        <div className="bottom-nav-row">
          <button
            className="nav-btn"
            onClick={onFirstPage}
            disabled={currentPage <= 1}
            title="First Page (Cover)"
          >
            <ChevronsLeftIcon size={18} />
            <span className="btn-label-desktop">First</span>
          </button>

          <button
            className="nav-btn primary-nav"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            title="Previous Page (Left Arrow / Drag right)"
          >
            <ChevronLeftIcon size={20} />
            <span>Prev</span>
          </button>

          {/* Scrubber slider */}
          <div className="scrubber-container">
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => onJumpToPage(Number(e.target.value))}
              className="scrubber-slider"
              aria-label="Book page slider"
            />
            <div className="scrubber-progress-track" style={{ width: `${progressPercent}%` }} />
            <div className="scrubber-meta">
              <span>{pageLabel}</span>
              <span className="progress-badge">{progressPercent}%</span>
            </div>
          </div>

          <button
            className="nav-btn primary-nav"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            title="Next Page (Right Arrow / Drag left)"
          >
            <span>Next</span>
            <ChevronRightIcon size={20} />
          </button>

          <button
            className="nav-btn"
            onClick={onLastPage}
            disabled={currentPage >= totalPages}
            title="Last Page (Final Note)"
          >
            <span className="btn-label-desktop">Last</span>
            <ChevronsRightIcon size={18} />
          </button>
        </div>

        <div className="reading-gesture-tip">
          <span>💡 Tip: Click page edges, drag to flip, or use ← / → arrow keys.</span>
        </div>
      </footer>
    </div>
  );
};
