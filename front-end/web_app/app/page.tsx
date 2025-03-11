'use client';

import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import FormatSelector from './components/FormatSelector';
import DownloadHistory from './components/DownloadHistory';
import ErrorMessage from './components/ErrorMessage';

export default function Home() {
  const [musicUrl, setMusicUrl] = useState('');
  const [format, setFormat] = useState('mp3');
  const { loading, error, fetchDownloadHistory, downloadSong } = useApi();
  const [downloadHistory, setDownloadHistory] = useState<string[]>([]);

  useEffect(() => {
    fetchDownloadHistory().then(setDownloadHistory);
  }, []);

  const handleDownload = async () => {
    const success = await downloadSong(musicUrl, format);
    if (success) setDownloadHistory(await fetchDownloadHistory());
  };

  const handleReDownload = async (fileName: string) => {
    try {
      const response = await fetch(`${'http://192.168.3.225:5000'}/download/${fileName}`);
      if (!response.ok) {
        throw new Error('Erro ao baixar o arquivo.');
      }
  
      const blob = await response.blob(); // Obtém o conteúdo como Blob
      const url = URL.createObjectURL(blob); // Cria uma URL temporária
      const a = Object.assign(document.createElement('a'), { href: url, download: fileName });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Erro ao rebaixar arquivo:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <img src="/logo.png" alt="Logo" className="w-32 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Baixar Música do Spotify</h1>

      <input
        type="text"
        placeholder="Cole o link do Spotify aqui..."
        value={musicUrl}
        onChange={(e) => setMusicUrl(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-80 mb-4 bg-gray-800 text-white"
      />

      <FormatSelector value={format} onChange={setFormat} />

      <button
        onClick={handleDownload}
        disabled={loading}
        className={`px-6 py-2 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
      >
        {loading ? 'Baixando...' : 'Baixar Música'}
      </button>

      {error && <ErrorMessage message={error} />}

      <DownloadHistory files={downloadHistory} onReDownload={handleReDownload} />
    </div>
  );
}