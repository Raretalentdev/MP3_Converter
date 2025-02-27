'use client'
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [musicUrl, setMusicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!musicUrl) {
      setError('Insira um link do Spotify.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/convert_to_mp3',
        { 
          url: musicUrl,
        },
        { responseType: 'blob' }
      );

      // Tentando obter o nome do arquivo a partir dos cabeçalhos
      const contentDisposition = response.headers['content-disposition'];
      let fileName = '';

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }
      }

      // Verificando o nome do arquivo antes de iniciar o download
      console.log('Nome do arquivo recebido: ', fileName);

      if (!fileName) {
        setError('Erro: Nome do arquivo não encontrado.');
        return;
      }

      const blob = new Blob([response.data], { type: 'audio/mp3' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;  // Agora, usamos o nome correto ou retornamos um erro
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch {
      setError('Erro ao baixar música.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Baixar Música do Spotify</h1>

      <input
        type="text"
        placeholder="Cole o link do Spotify aqui..."
        value={musicUrl}
        onChange={(e) => setMusicUrl(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-80 mb-4"
      />

      <button
        onClick={handleDownload}
        disabled={loading}
        className={`px-6 py-2 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
      >
        {loading ? 'Baixando...' : 'Baixar Música'}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
