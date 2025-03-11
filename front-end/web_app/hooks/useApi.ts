import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.3.225:5000';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDownloadHistory = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/downloads`);
      return data.slice(-10); // Retorna os 10 últimos downloads
    } catch {
      setError('Erro ao buscar histórico de downloads.');
      return [];
    }
  };

  const downloadSong = async (musicUrl: string, format: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/convert_to_mp3`, { url: musicUrl, format });

      if (!data.file_name) throw new Error('Nome do arquivo não encontrado.');

      const { data: blob } = await axios.get(`${API_BASE_URL}/download/${data.file_name}`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([blob], { type: format === 'mp3' ? 'audio/mpeg' : 'audio/wav' }));
      const a = Object.assign(document.createElement('a'), { href: url, download: data.file_name });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      return true;
    } catch {
      setError('Erro ao baixar música.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchDownloadHistory, downloadSong };
};