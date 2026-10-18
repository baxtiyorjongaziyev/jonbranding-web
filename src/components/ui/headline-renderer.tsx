import React from 'react';

export function renderHeadline(headline: string, highlightColorClass: string = 'text-primary') {
  if (!headline) return '';

  const segments = headline.split(/(\*\*.*?\*\*|\|.*?\|)/g);

  return (
    <>
      {segments.map((segment, i) => {
        if (!segment) return null;

        const isDoubleStar = segment.startsWith('**') && segment.endsWith('**');
        const isPipe = segment.startsWith('|') && segment.endsWith('|');

        if (isDoubleStar || isPipe) {
          const text = isDoubleStar ? segment.slice(2, -2) : segment.slice(1, -1);
          return (
            <span key={i} className={`font-serif italic font-normal ${highlightColorClass}`}>
              {text}
            </span>
          );
        }

        return <span key={i}>{segment}</span>;
      })}
    </>
  );
}
