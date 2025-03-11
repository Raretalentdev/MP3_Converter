'use client'; 

import React from 'react';

interface FormatSelectorProps {
  value: string;
  onChange: (format: string) => void;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="mr-2">Formato:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md bg-gray-800 text-white"
      >
        <option value="mp3">MP3</option>
        <option value="wav">WAV</option>
      </select>
    </div>
  );
};

export default FormatSelector;