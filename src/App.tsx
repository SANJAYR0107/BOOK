import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookScene } from './components/3d/BookScene';
import { LandingOverlay } from './components/ui/LandingOverlay';
import { ReadingControls } from './components/ui/ReadingControls';
import { ChapterNavigation } from './components/ui/ChapterNavigation';
import { PDFReaderFallback } from './components/ui/PDFReaderFallback';
import { FlipbookFallback } from './components/ui/FlipbookFallback';
import { CompletionModal } from './components/ui/CompletionModal';
import { audioService } from './utils/audio';
import { textureCache } from './utils/textureLoader';
import { TOTAL_PAGES, BOOK_METADATA } from './data/bookData';
import type { LightingTheme, ViewMode } from './types/book';
import './App.css';

// Check if WebGL is supported
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const App: React.FC = () => {
  const hasWebGL = useRef(checkWebGLSupport());

  // Stored state initialization
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const saved = localStorage.getItem('fake_of_loyal_page');
    return saved ? Math.max(1, Math.min(TOTAL_PAGES, Number(saved))) : 1;
  });

  const [savedPage] = useState<number | null>(() => {
    const saved = localStorage.getItem('fake_of_loyal_page');
    return saved ? Number(saved) : null;
  });

  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('fake_of_loyal_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isBookOpen, setIsBookOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(hasWebGL.current ? '3d' : '2d');
  const [lightingTheme, setLightingTheme] = useState<LightingTheme>('warm');
  const [isInspectMode, setIsInspectMode] = useState(false);
  const [isTOCDrawerOpen, setIsTOCDrawerOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('fake_of_loyal_muted') === 'true';
  });
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);

  // 3D Flipping Animation State
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');

  // Preload textures on mount
  useEffect(() => {
    textureCache.preloadAll();
    audioService.setMuted(isMuted);
  }, []);

  // Save current page to local storage
  useEffect(() => {
    if (isBookOpen) {
      localStorage.setItem('fake_of_loyal_page', String(currentPage));
    }
  }, [currentPage, isBookOpen]);

  // Save bookmarks
  useEffect(() => {
    localStorage.setItem('fake_of_loyal_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Save mute preference
  useEffect(() => {
    localStorage.setItem('fake_of_loyal_muted', String(isMuted));
    audioService.setMuted(isMuted);
  }, [isMuted]);

  // Check completion
  useEffect(() => {
    if (isBookOpen && currentPage === TOTAL_PAGES) {
      const timer = setTimeout(() => {
        setIsCompletionModalOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, isBookOpen]);

  // Turn Page with smooth physics-based animation in 3D
  const animatePageTurn = useCallback(
    (direction: 'forward' | 'backward', targetPage: number) => {
      if (isFlipping) return;

      setIsFlipping(true);
      setFlipDirection(direction);
      audioService.playPageTurnSound();

      const startTime = performance.now();
      const duration = 650; // ms

      const step = (now: number) => {
        const elapsed = now - startTime;
        const rawProgress = Math.min(1, elapsed / duration);
        // Smooth cubic ease in out
        const eased =
          rawProgress < 0.5
            ? 4 * rawProgress * rawProgress * rawProgress
            : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

        setFlipProgress(eased);

        if (rawProgress < 1) {
          requestAnimationFrame(step);
        } else {
          setCurrentPage(targetPage);
          setIsFlipping(false);
          setFlipProgress(0);
        }
      };

      requestAnimationFrame(step);
    },
    [isFlipping]
  );

  const handleNextPage = useCallback(() => {
    if (currentPage >= TOTAL_PAGES) return;

    if (viewMode === '3d') {
      let target: number;
      if (currentPage === 1) {
        target = 2;
      } else {
        target = Math.min(TOTAL_PAGES, currentPage + 2);
      }
      animatePageTurn('forward', target);
    } else {
      setCurrentPage((prev) => Math.min(TOTAL_PAGES, prev + 1));
      audioService.playPageTurnSound();
    }
  }, [currentPage, viewMode, animatePageTurn]);

  const handlePrevPage = useCallback(() => {
    if (currentPage <= 1) return;

    if (viewMode === '3d') {
      let target: number;
      if (currentPage <= 3) {
        target = 1;
      } else {
        target = Math.max(1, currentPage - 2);
      }
      animatePageTurn('backward', target);
    } else {
      setCurrentPage((prev) => Math.max(1, prev - 1));
      audioService.playPageTurnSound();
    }
  }, [currentPage, viewMode, animatePageTurn]);

  const handleFirstPage = useCallback(() => {
    if (viewMode === '3d' && currentPage > 1) {
      animatePageTurn('backward', 1);
    } else {
      setCurrentPage(1);
      audioService.playPageTurnSound();
    }
  }, [viewMode, currentPage, animatePageTurn]);

  const handleLastPage = useCallback(() => {
    if (viewMode === '3d' && currentPage < TOTAL_PAGES) {
      animatePageTurn('forward', TOTAL_PAGES);
    } else {
      setCurrentPage(TOTAL_PAGES);
      audioService.playPageTurnSound();
    }
  }, [viewMode, currentPage, animatePageTurn]);

  const handleJumpToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(TOTAL_PAGES, page));
      if (clamped === currentPage) return;

      const direction = clamped > currentPage ? 'forward' : 'backward';
      if (viewMode === '3d') {
        animatePageTurn(direction, clamped);
      } else {
        setCurrentPage(clamped);
        audioService.playPageTurnSound();
      }
    },
    [currentPage, viewMode, animatePageTurn]
  );

  // Bookmark current page
  const handleToggleBookmark = useCallback(() => {
    audioService.playBookmarkSound();
    setBookmarks((prev) => {
      if (prev.includes(currentPage)) {
        return prev.filter((p) => p !== currentPage);
      } else {
        return [...prev, currentPage];
      }
    });
  }, [currentPage]);

  // Toggle audio
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const handleToggleAmbient = useCallback(() => {
    const isPlaying = audioService.toggleAmbientSound();
    setIsAmbientPlaying(isPlaying);
  }, []);

  // Fullscreen
  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen not supported
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && isBookOpen)) {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleFirstPage();
      } else if (e.key === 'End') {
        e.preventDefault();
        handleLastPage();
      } else if (e.key === 'Escape') {
        if (isTOCDrawerOpen) {
          setIsTOCDrawerOpen(false);
        } else if (isCompletionModalOpen) {
          setIsCompletionModalOpen(false);
        } else if (viewMode === 'pdf') {
          setViewMode('3d');
        } else if (isInspectMode) {
          setIsInspectMode(false);
        }
      } else if (e.key === 'b' || e.key === 'B') {
        handleToggleBookmark();
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isBookOpen,
    isTOCDrawerOpen,
    isCompletionModalOpen,
    viewMode,
    isInspectMode,
    handleNextPage,
    handlePrevPage,
    handleFirstPage,
    handleLastPage,
    handleToggleBookmark,
    handleToggleMute,
  ]);

  // Click side of book spread
  const handlePageMeshClick = (side: 'left' | 'right') => {
    if (!isBookOpen) {
      setIsBookOpen(true);
      audioService.playPageTurnSound();
      return;
    }
    if (side === 'left') {
      handlePrevPage();
    } else {
      handleNextPage();
    }
  };

  // Drag swipe flip
  const handleDragFlip = (deltaX: number) => {
    if (!isBookOpen) {
      if (deltaX < -50) {
        setIsBookOpen(true);
        audioService.playPageTurnSound();
      }
      return;
    }

    if (deltaX < -40) {
      handleNextPage();
    } else if (deltaX > 40) {
      handlePrevPage();
    }
  };

  const isCurrentBookmarked = bookmarks.includes(currentPage);

  return (
    <div className={`app-root theme-${lightingTheme} ${isBookOpen ? 'reading-mode' : 'landing-mode'}`}>
      {/* 3D Scene Container */}
      <div className={`stage-viewport ${viewMode !== '3d' ? 'stage-hidden' : ''}`}>
        <BookScene
          currentPage={currentPage}
          isBookOpen={isBookOpen}
          isFlipping={isFlipping}
          flipProgress={flipProgress}
          flipDirection={flipDirection}
          isBookmarked={isCurrentBookmarked}
          lightingTheme={lightingTheme}
          isInspectMode={isInspectMode}
          onPageClick={handlePageMeshClick}
          onDragFlip={handleDragFlip}
        />
      </div>

      {/* 2D Flipbook Mode Fallback */}
      {viewMode === '2d' && (
        <div className="fallback-viewport">
          <FlipbookFallback
            currentPage={currentPage}
            onPageChange={(p) => setCurrentPage(p)}
            isMuted={isMuted}
          />
        </div>
      )}

      {/* PDF Reader Fallback */}
      <PDFReaderFallback
        isOpen={viewMode === 'pdf'}
        onClose={() => setViewMode(hasWebGL.current ? '3d' : '2d')}
        onSwitchTo3D={() => setViewMode('3d')}
      />

      {/* Landing Screen Overlay (when closed) */}
      {!isBookOpen && viewMode !== 'pdf' && (
        <LandingOverlay
          onStartReading={() => {
            setCurrentPage(1);
            setIsBookOpen(true);
            audioService.playPageTurnSound();
          }}
          onContinueReading={() => {
            if (savedPage) setCurrentPage(savedPage);
            setIsBookOpen(true);
            audioService.playPageTurnSound();
          }}
          savedPage={savedPage}
          onOpenTOC={() => setIsTOCDrawerOpen(true)}
          onOpenPDF={() => setViewMode('pdf')}
          onToggleInspect={() => setIsInspectMode((prev) => !prev)}
          isInspectMode={isInspectMode}
        />
      )}

      {/* Reading Controls Overlay (when open) */}
      {isBookOpen && viewMode !== 'pdf' && (
        <ReadingControls
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
          isBookmarked={isCurrentBookmarked}
          isMuted={isMuted}
          isAmbientPlaying={isAmbientPlaying}
          lightingTheme={lightingTheme}
          isInspectMode={isInspectMode}
          viewMode={viewMode}
          isFullscreen={isFullscreen}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          onFirstPage={handleFirstPage}
          onLastPage={handleLastPage}
          onJumpToPage={handleJumpToPage}
          onToggleBookmark={handleToggleBookmark}
          onToggleMute={handleToggleMute}
          onToggleAmbient={handleToggleAmbient}
          onChangeLighting={setLightingTheme}
          onToggleInspect={() => setIsInspectMode((prev) => !prev)}
          onChangeViewMode={setViewMode}
          onToggleFullscreen={handleToggleFullscreen}
          onCloseBook={() => {
            setIsBookOpen(false);
            audioService.playPageTurnSound();
          }}
          onOpenTOC={() => setIsTOCDrawerOpen(true)}
        />
      )}

      {/* Table of Contents Drawer */}
      <ChapterNavigation
        isOpen={isTOCDrawerOpen}
        currentPage={currentPage}
        bookmarks={bookmarks}
        onClose={() => setIsTOCDrawerOpen(false)}
        onSelectPage={(p) => {
          setIsBookOpen(true);
          handleJumpToPage(p);
        }}
      />

      {/* Completion Modal */}
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        onRestart={() => {
          setIsCompletionModalOpen(false);
          handleJumpToPage(1);
        }}
        onDownloadPDF={() => {
          window.open(BOOK_METADATA.pdfUrl, '_blank');
        }}
      />
    </div>
  );
};

export default App;
