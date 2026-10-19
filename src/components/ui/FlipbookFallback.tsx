import React, { useState } from 'react';
import { TOTAL_PAGES } from '../../data/bookData';
import { audioService } from '../../utils/audio';
import { ChevronLeftIcon, ChevronRightIcon } from '../common/Icons';

interface FlipbookFallbackProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  isMuted: boolean;
}

export const FlipbookFallback: React.FC<FlipbookFallbackProps> = ({
  currentPage,
  onPageChange,
  isMuted,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Spread calculation for 2D book
  // Page 1 is cover (single right page)
  // Page 2 & 3, Page 4 & 5, etc.
  const isCover = currentPage === 1;
  const leftPage = isCover ? null : currentPage % 2 === 0 ? currentPage : currentPage - 1;
  const rightPage = isCover ? 1 : leftPage ? (leftPage + 1 <= TOTAL_PAGES ? leftPage + 1 : null) : null;

  const handleNext = () => {
    if (currentPage >= TOTAL_PAGES || isAnimating) return;
    setIsAnimating(true);
    if (!isMuted) audioService.playPageTurnSound();

    setTimeout(() => {
      if (currentPage === 1) {
        onPageChange(2);
      } else {
        onPageChange(Math.min(TOTAL_PAGES, currentPage + 2));
      }
      setIsAnimating(false);
    }, 280);
  };

  const handlePrev = () => {
    if (currentPage <= 1 || isAnimating) return;
    setIsAnimating(true);
    if (!isMuted) audioService.playPageTurnSound();

    setTimeout(() => {
      if (currentPage <= 3) {
        onPageChange(1);
      } else {
        onPageChange(Math.max(1, currentPage - 2));
      }
      setIsAnimating(false);
    }, 280);
  };

  return (
    <div className="fallback-2d-book-wrapper">
      {/* Previous Page Click Zone / Button */}
      <button
        className="fallback-turn-btn prev-btn"
        onClick={handlePrev}
        disabled={currentPage <= 1 || isAnimating}
        title="Previous Page"
      >
        <ChevronLeftIcon size={28} />
      </button>

      {/* 2D Spread Container */}
      <div className={`fallback-spread-container ${isCover ? 'cover-spread' : ''} ${isAnimating ? 'turning' : ''}`}>
        {/* Left Page (Verso) */}
        {!isCover && (
          <div
            className="fallback-page-side left-side"
            onClick={handlePrev}
            title="Click to turn to previous page"
          >
            {leftPage ? (
              <img
                src={`/pages/page-${String(leftPage).padStart(2, '0')}.jpg`}
                alt={`The Fake of Loyal — Page ${leftPage}`}
                className="fallback-page-img"
              />
            ) : (
              <div className="fallback-empty-page" />
            )}
            <div className="gutter-shadow-left" />
            <div className="page-curl-corner corner-left" />
          </div>
        )}

        {/* Right Page (Recto) */}
        <div
          className={`fallback-page-side right-side ${isCover ? 'cover-page' : ''}`}
          onClick={handleNext}
          title="Click to turn to next page"
        >
          {rightPage ? (
            <img
              src={`/pages/page-${String(rightPage).padStart(2, '0')}.jpg`}
              alt={`The Fake of Loyal — Page ${rightPage}`}
              className="fallback-page-img"
            />
          ) : (
            <div className="fallback-empty-page" />
          )}
          <div className="gutter-shadow-right" />
          <div className="page-curl-corner corner-right" />
        </div>
      </div>

      {/* Next Page Click Zone / Button */}
      <button
        className="fallback-turn-btn next-btn"
        onClick={handleNext}
        disabled={currentPage >= TOTAL_PAGES || isAnimating}
        title="Next Page"
      >
        <ChevronRightIcon size={28} />
      </button>
    </div>
  );
};
