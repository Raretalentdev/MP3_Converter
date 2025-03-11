'use client'; 

import React from 'react';
import { FaDownload } from 'react-icons/fa';

interface DownloadHistoryProps {
  files: string[];
  onReDownload: (fileName: string) => void;
}

const DownloadHistory: React.FC<DownloadHistoryProps> = ({ files, onReDownload }) => {
  return (
    <div className="mt-6 w-80">
      <h2 className="text-lg font-semibold">Últimos downloads:</h2>
      <ul className="mt-2 border p-2 rounded bg-gray-800 shadow">
        {files.length > 0 ? (
          files.map((file, index) => (
            <li key={index} className="flex justify-between items-center py-1 border-b last:border-0">
              <span className="truncate max-w-xs">{file}</span>
              <button onClick={() => onReDownload(file)} className="text-blue-500 hover:underline">
                <FaDownload className="w-5 h-5" />
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Nenhum download recente.</p>
        )}
      </ul>
    </div>
  );
};

export default DownloadHistory;