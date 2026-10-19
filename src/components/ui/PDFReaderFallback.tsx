import React from 'react';
import { BOOK_METADATA } from '../../data/bookData';
import { CloseIcon, DownloadIcon, BookIcon } from '../common/Icons';

interface PDFReaderFallbackProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchTo3D: () => void;
}

export const PDFReaderFallback: React.FC<PDFReaderFallbackProps> = ({
  isOpen,
  onClose,
  onSwitchTo3D,
}) => {
  if (!isOpen) return null;

  return (
    <div className="pdf-modal-container">
      <header className="pdf-header">
        <div className="pdf-title-group">
          <h2>{BOOK_METADATA.title}</h2>
          <span className="pdf-sub">Original PDF Edition • {BOOK_METADATA.author}</span>
        </div>

        <div className="pdf-actions">
          <button className="control-btn" onClick={onSwitchTo3D} title="Return to 3D Virtual Book">
            <BookIcon size={18} />
            <span>Switch to 3D Book</span>
          </button>

          <a
            href={BOOK_METADATA.originalPdfUrl}
            download="The_Fake_of_Loyal_Sanjay.pdf"
            className="control-btn active-gold"
            title="Download PDF to your device"
          >
            <DownloadIcon size={18} />
            <span>Download PDF</span>
          </a>

          <button className="icon-btn-close" onClick={onClose} title="Close PDF Reader">
            <CloseIcon size={20} />
          </button>
        </div>
      </header>

      <div className="pdf-frame-wrapper">
        <iframe
          src={`${BOOK_METADATA.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          title="The Fake of Loyal Original PDF"
          className="pdf-iframe"
        />
      </div>
    </div>
  );
};
