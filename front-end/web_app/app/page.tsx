'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/convert_to_mp3')  // Chama a API Flask
      .then(response => setMessage(response.data.message))
      .catch(error => console.error('Erro ao buscar mensagem:', error));
  }, []);

  return (
    <div>
      <h1>Mensagem do Flask:</h1>
      <p>{message}</p>
    </div>
  );
}
