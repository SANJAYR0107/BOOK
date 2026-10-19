import React from 'react';
import { BOOK_METADATA } from '../../data/bookData';
import { BookIcon, DownloadIcon, ListIcon, CompassIcon } from '../common/Icons';

interface LandingOverlayProps {
  onStartReading: () => void;
  onContinueReading?: () => void;
  savedPage: number | null;
  onOpenTOC: () => void;
  onOpenPDF: () => void;
  onToggleInspect: () => void;
  isInspectMode: boolean;
}

export const LandingOverlay: React.FC<LandingOverlayProps> = ({
  onStartReading,
  onContinueReading,
  savedPage,
  onOpenTOC,
  onOpenPDF,
  onToggleInspect,
  isInspectMode,
}) => {
  return (
    <div className="landing-overlay">
      <header className="landing-header">
        <div className="landing-eyebrow">A NOVEL BY {BOOK_METADATA.author.toUpperCase()}</div>
        <h1 className="landing-title">{BOOK_METADATA.title}</h1>
        <p className="landing-subtitle">{BOOK_METADATA.subtitle}</p>
        <blockquote className="landing-tagline">
          “{BOOK_METADATA.tagline}”
        </blockquote>
      </header>

      <div className="landing-body">
        <p className="landing-synopsis">
          An honest, emotionally poignant journey through four years of trust, attachment,
          changing priorities, and the quiet heartbreak of unreturned loyalty between Shiva and Akshara.
        </p>

        <div className="landing-actions">
          {savedPage && savedPage > 1 ? (
            <>
              <button
                className="btn-primary"
                onClick={onContinueReading}
                title={`Continue from page ${savedPage}`}
              >
                <BookIcon size={18} />
                <span>Continue Reading (Page {savedPage})</span>
              </button>
              <button className="btn-secondary" onClick={onStartReading}>
                <span>Start from Beginning</span>
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={onStartReading}>
              <BookIcon size={18} />
              <span>Open Book & Start Reading</span>
            </button>
          )}

          <div className="landing-sub-actions">
            <button className="btn-ghost" onClick={onOpenTOC} title="Table of Contents">
              <ListIcon size={16} />
              <span>Chapters</span>
            </button>
            <button className="btn-ghost" onClick={onOpenPDF} title="Original PDF">
              <DownloadIcon size={16} />
              <span>Original PDF</span>
            </button>
            <button
              className={`btn-ghost ${isInspectMode ? 'active' : ''}`}
              onClick={onToggleInspect}
              title="Inspect 3D Book in 360°"
            >
              <CompassIcon size={16} />
              <span>{isInspectMode ? 'Exit 3D Inspect' : 'Inspect 3D Book'}</span>
            </button>
          </div>
        </div>

        <div className="landing-footer-hint">
          <span>Complete 30-Page Original Edition</span>
          <span className="dot">•</span>
          <span>Realistic 3D Paper Physics</span>
          <span className="dot">•</span>
          <span>Touch & Swipe Supported</span>
        </div>
      </div>
    </div>
  );
};
