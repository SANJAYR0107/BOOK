import React from 'react';
import { CHAPTERS, THOUGHTS_TO_KEEP } from '../../data/bookData';
import { CloseIcon, BookIcon, BookmarkIcon } from '../common/Icons';

interface ChapterNavigationProps {
  isOpen: boolean;
  currentPage: number;
  bookmarks: number[];
  onClose: () => void;
  onSelectPage: (page: number) => void;
}

export const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  isOpen,
  currentPage,
  bookmarks,
  onClose,
  onSelectPage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="chapter-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-row">
            <BookIcon size={20} className="gold-icon" />
            <h2>Table of Contents</h2>
          </div>
          <button className="icon-btn-close" onClick={onClose} title="Close drawer">
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="drawer-content">
          <div className="drawer-section-title">CHAPTERS & SECTIONS</div>
          <ul className="chapter-list">
            {CHAPTERS.map((ch) => {
              const isCurrent =
                currentPage >= ch.pageNumber &&
                (CHAPTERS.find((c) => c.pageNumber > ch.pageNumber)
                  ? currentPage < (CHAPTERS.find((c) => c.pageNumber > ch.pageNumber)?.pageNumber || 999)
                  : true);

              const hasBookmark = bookmarks.includes(ch.pageNumber);

              return (
                <li key={ch.id}>
                  <button
                    className={`chapter-item ${isCurrent ? 'active' : ''}`}
                    onClick={() => {
                      onSelectPage(ch.pageNumber);
                      onClose();
                    }}
                  >
                    <div className="chapter-info">
                      <span className="chapter-tag">{ch.title}</span>
                      <span className="chapter-sub">{ch.subtitle}</span>
                    </div>
                    <div className="chapter-meta">
                      {hasBookmark && <BookmarkIcon size={14} filled className="gold-icon" />}
                      <span className="page-pill">p. {ch.pageNumber}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="drawer-section-title" style={{ marginTop: '24px' }}>
            A THOUGHT TO KEEP
          </div>
          <div className="thoughts-list">
            {Object.entries(THOUGHTS_TO_KEEP).map(([pageNum, quote]) => (
              <div
                key={pageNum}
                className="thought-card"
                onClick={() => {
                  onSelectPage(Number(pageNum));
                  onClose();
                }}
              >
                <div className="thought-quote">{quote}</div>
                <div className="thought-page-link">Page {pageNum} →</div>
              </div>
            ))}
          </div>

          {bookmarks.length > 0 && (
            <>
              <div className="drawer-section-title" style={{ marginTop: '24px' }}>
                SAVED BOOKMARKS ({bookmarks.length})
              </div>
              <div className="bookmarks-list">
                {bookmarks.sort((a, b) => a - b).map((p) => (
                  <button
                    key={p}
                    className="bookmark-chip"
                    onClick={() => {
                      onSelectPage(p);
                      onClose();
                    }}
                  >
                    <BookmarkIcon size={14} filled className="gold-icon" />
                    <span>Page {p}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
