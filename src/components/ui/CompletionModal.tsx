import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BOOK_METADATA } from '../../data/bookData';
import { DownloadIcon, CloseIcon, RotateCcwIcon } from '../common/Icons';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  onDownloadPDF: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  onDownloadPDF,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Confetti burst with gold, navy, and cream tones
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d9ae68', '#f5eddf', '#101d30', '#eed9be', '#ffd700'],
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="completion-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn-close modal-close-top" onClick={onClose}>
          <CloseIcon size={20} />
        </button>

        <div className="completion-sparkle">✦ ✦ ✦</div>
        <h2 className="completion-title">You Have Finished Reading</h2>
        <h3 className="completion-book-name">{BOOK_METADATA.title}</h3>
        <p className="completion-author">by {BOOK_METADATA.author}</p>

        <blockquote className="completion-quote">
          “Shiva has not fully moved on. He is still hurt, angry, and unsure what to do next.
          The ending leaves him where he truly is: carrying memories without knowing what to do with them.”
        </blockquote>

        <p className="completion-subtext">
          Thank you for experiencing Shiva and Akshara's story in this realistic 3D edition.
        </p>

        <div className="completion-actions">
          <button className="btn-primary" onClick={onRestart}>
            <RotateCcwIcon size={18} />
            <span>Read From Beginning</span>
          </button>
          <button className="btn-secondary" onClick={onDownloadPDF}>
            <DownloadIcon size={18} />
            <span>Save Original PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
