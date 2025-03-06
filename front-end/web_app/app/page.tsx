'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDownload } from 'react-icons/fa';

export default function Home() {
  const [musicUrl, setMusicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadHistory, setDownloadHistory] = useState<string[]>([]);

  useEffect(() => {
    fetchDownloadHistory();
  }, []);

  const fetchDownloadHistory = async () => {
    try {
      const response = await axios.get('http://192.168.3.225:5000/downloads');
      setDownloadHistory(response.data.slice(-10));
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
    }
  };

  const handleDownload = async () => {
    if (!musicUrl) {
      setError('Insira um link do Spotify.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('http://192.168.3.225:5000/convert_to_mp3', { url: musicUrl });

      if (!data.file_name) {
        throw new Error('Nome do arquivo não encontrado.');
      }

      const response = await axios.get(`http://192.168.3.225:5000/download/${data.file_name}`, { responseType: 'blob' });

      if (response.status !== 200) {
        throw new Error('Erro ao baixar o arquivo.');
      }

      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      await fetchDownloadHistory();
    } catch (err) {
      console.error('Erro ao baixar música:', err);
      setError('Erro ao baixar música.');
    } finally {
      setLoading(false);
    }
  };

  const handleReDownload = async (fileName: string) => {
    try {
      const response = await axios.get(`http://192.168.3.225:5000/download/${fileName}`, { responseType: 'blob' });

      if (response.status !== 200) {
        throw new Error('Erro ao baixar o arquivo.');
      }

      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Erro ao rebaixar arquivo:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="mb-6">
        <img src="/logo.png" alt="Logo" className="w-32" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Baixar Música do Spotify</h1>

      <input
        type="text"
        placeholder="Cole o link do Spotify aqui..."
        value={musicUrl}
        onChange={(e) => setMusicUrl(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-80 mb-4 bg-gray-800 text-white"
      />

      <button
        onClick={handleDownload}
        disabled={loading}
        className={`px-6 py-2 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
      >
        {loading ? 'Baixando...' : 'Baixar Música'}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-6 w-80">
        <h2 className="text-lg font-semibold">Últimos downloads:</h2>
        <ul className="mt-2 border p-2 rounded bg-gray-800 shadow">
          {downloadHistory.length > 0 ? (
            downloadHistory.map((file, index) => (
              <li key={index} className="flex justify-between items-center py-1 border-b last:border-0">
                <span className="truncate max-w-xs">{file}</span>
                <button
                  onClick={() => handleReDownload(file)}
                  className="text-blue-500 hover:underline"
                >
                  <FaDownload className="w-5 h-5" />
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Nenhum download recente.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
