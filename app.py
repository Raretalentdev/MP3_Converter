from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from converter import MusicDownloader
import os

app = Flask(__name__)
CORS(app)

@app.route("/convert_to_mp3", methods=['POST'])
def convert():
    data = request.get_json()
    music_url = data.get("url")

    if not music_url:
        return jsonify({'error': 'Nenhum link fornecido'}), 400

    # Validar se a URL contém "open.spotify.com" e "/track/"
    if "open.spotify.com" not in music_url or "/track/" not in music_url:
        return jsonify({'error': 'Link do Spotify inválido'}), 400

    try:
        downloader = MusicDownloader(music_url)
        file_path, file_name = downloader.download_song()

        # Verificando o nome do arquivo
        print(f"Nome do arquivo antes de enviar: {file_name}")

        # Corrigindo a resposta do cabeçalho Content-Disposition
        return send_file(
            file_path,
            as_attachment=True,
            mimetype='audio/mpeg',
            download_name=file_name  # Esse parâmetro foi substituído por filename no cabeçalho
        )

    except (RuntimeError, FileNotFoundError) as e:
        return jsonify({'error': f'Ocorreu um erro ao baixar a música: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
