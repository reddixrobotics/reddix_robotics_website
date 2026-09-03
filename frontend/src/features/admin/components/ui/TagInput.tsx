import React, { useState, KeyboardEvent, useEffect } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string; // comma separated string for backward compatibility
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder = "Type and press Enter" }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    // Parse incoming comma-separated string into tags array
    if (value) {
      const parsedTags = value.split(',').map(t => t.trim()).filter(Boolean);
      setTags(parsedTags);
    } else {
      setTags([]);
    }
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        onChange(newTags.join(', '));
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag if backspace is pressed on empty input
      const newTags = tags.slice(0, -1);
      onChange(newTags.join(', '));
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    onChange(newTags.join(', '));
  };

  return (
    <div className="w-full bg-surface-card border border-border rounded-lg p-2 flex flex-wrap gap-2 items-center focus-within:border-red-500 transition-colors">
      {tags.map((tag, index) => (
        <div key={index} className="flex items-center gap-1 bg-surface-tertiary text-sm px-2 py-1 rounded-md text-content">
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="text-content-secondary hover:text-content focus:outline-none flex items-center justify-center"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <input
        type="text"
        className="flex-1 bg-transparent border-none text-content focus:outline-none min-w-[120px] px-1 text-sm py-1"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
      />
    </div>
  );
}
