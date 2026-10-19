import type { BookPage, Chapter } from '../types/book';

export const TOTAL_PAGES = 30;

export const CHAPTERS: Chapter[] = [
  { id: 0, title: 'Front Cover', subtitle: 'The Fake of Loyal', pageNumber: 1 },
  { id: 1, title: 'Disclaimer', subtitle: 'Author Statement', pageNumber: 3 },
  { id: 2, title: 'Contents', subtitle: 'Table of Contents', pageNumber: 5 },
  { id: 3, title: 'Chapter 1', subtitle: 'The Innocence of Trust', pageNumber: 6 },
  { id: 4, title: 'Chapter 2', subtitle: 'The Connection He Believed In', pageNumber: 11 },
  { id: 5, title: 'Chapter 3', subtitle: 'When Efforts Became One Sided', pageNumber: 17 },
  { id: 6, title: 'Chapter 4', subtitle: 'When Trust Finally Broke', pageNumber: 21 },
  { id: 7, title: 'Chapter 5', subtitle: 'No More Begging for a Place', pageNumber: 25 },
  { id: 8, title: 'Chapter 6', subtitle: 'What She Lost', pageNumber: 28 },
  { id: 9, title: 'Final Note', subtitle: 'A Final Note', pageNumber: 30 },
];

export const THOUGHTS_TO_KEEP: Record<number, string> = {
  10: '“A four-year story can begin with one notification and a question as small as, ‘Who are you?’”',
  16: '“Sometimes a person becomes family in your heart before you realise they never promised to stay.”',
  20: '“A friendship can survive distance, but it struggles when only one person keeps reaching across it.”',
  24: '“The truth does not always arrive loudly. Sometimes one small detail makes every old memory hurt again.”',
  27: '“You can care deeply for someone and still need to stop asking them to make room for you.”',
  29: '“Not begging anymore is not the same as no longer caring.”',
};

export const BOOK_PAGES: BookPage[] = Array.from({ length: TOTAL_PAGES }, (_, index) => {
  const pageNumber = index + 1;
  const chapter = CHAPTERS.find((ch) => ch.pageNumber === pageNumber);
  const thought = THOUGHTS_TO_KEEP[pageNumber];

  return {
    pageNumber,
    image: `/pages/page-${String(pageNumber).padStart(2, '0')}.jpg`,
    title: chapter ? `${chapter.title}${chapter.subtitle ? ` — ${chapter.subtitle}` : ''}` : undefined,
    isCover: pageNumber === 1,
    isThought: Boolean(thought),
    thoughtText: thought,
  };
});

export const BOOK_METADATA = {
  title: 'THE FAKE OF LOYAL',
  subtitle: 'An Emotional Story of Friendship',
  author: 'Sanjay',
  totalPages: TOTAL_PAGES,
  pdfUrl: '/The_Fake_of_Loyal_Original.pdf',
  originalPdfUrl: '/The_Fake_of_Loyal_October_Final_No2Pages-3.pdf',
  synopsis:
    'An honest, emotionally poignant journey through four years of trust, attachment, changing priorities, and the painful quiet of unreturned loyalty between Shiva and Akshara.',
  tagline: 'Some people stay in our hearts even when they are no longer a part of our lives.',
};
