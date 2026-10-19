import React, { useState } from 'react';

interface HighlightableTextProps {
  text: string;
  keywords: Record<string, string>;
}

export const HighlightableText: React.FC<HighlightableTextProps> = ({ text, keywords }) => {
  const keywordRegex = new RegExp(`\\b(${Object.keys(keywords).join('|')})\\b`, 'gi');
  const parts = text.split(keywordRegex);

  return (
    <span>
      {parts.map((part, index) => {
        const lowerPart = part.toLowerCase();
        if (keywords[lowerPart]) {
          return <Keyword key={index} keyword={part} definition={keywords[lowerPart]} />;
        }
        return part;
      })}
    </span>
  );
};

const Keyword: React.FC<{ keyword: string; definition: string }> = ({ keyword, definition }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="text-yellow-400 font-semibold border-b border-yellow-400/50 cursor-pointer">
        {keyword}
      </span>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-yellow-400 rounded-lg shadow-lg z-10 text-sm text-slate-200 font-normal">
          {definition}
        </div>
      )}
    </span>
  );
};