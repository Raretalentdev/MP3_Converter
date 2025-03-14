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
      // Envia a solicitação para o back-end
      const response = await fetch(`${API_BASE_URL}/convert_to_mp3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: musicUrl, format }),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao converter música.');
      }
  
      const data = await response.json();
      if (!data.file_name) throw new Error('Nome do arquivo não encontrado.');
  
      // Cria uma tag <a> com o href apontando para a URL do arquivo
      const a = document.createElement('a');
      a.href = `${API_BASE_URL}/download/${data.file_name}`;
      a.download = data.file_name; // Define o nome do arquivo para download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      return true;
    } catch (err) {
      setError('Erro ao baixar música.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchDownloadHistory, downloadSong };
};