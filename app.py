from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from converter import MusicDownloader
import os
from werkzeug.exceptions import BadRequest, NotFound, InternalServerError

app = Flask(__name__)
CORS(app)

# Função para validar a URL do Spotify
def validate_spotify_url(url):
    if not url or "open.spotify.com" not in url or "/track/" not in url:
        raise BadRequest("Link do Spotify inválido")

# Função para validar o formato
def validate_format(file_format):
    if file_format not in ["mp3", "wav"]:
        raise BadRequest("Formato inválido. Escolha entre 'mp3' ou 'wav'.")

@app.route("/convert_to_mp3", methods=['POST'])
def convert():
    try:
        data = request.get_json()
        music_url = data.get("url")
        file_format = data.get("format", "mp3")

        # Validações
        validate_spotify_url(music_url)
        validate_format(file_format)

        # Download da música
        downloader = MusicDownloader(music_url, file_format)
        file_path = downloader.download_song()
        file_name = os.path.basename(file_path)
        return jsonify({'file_name': file_name})

    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Ocorreu um erro ao baixar a música: {str(e)}'}), 500

@app.route("/download/<file_name>", methods=['GET'])
def download(file_name):
    download_folder = "downloads"
    file_path = os.path.join(download_folder, file_name)

    # Verifica se o arquivo existe
    if not os.path.exists(file_path):
        raise NotFound("Arquivo não encontrado")

    # Determina o MIME type com base na extensão
    mimetype = 'audio/mpeg' if file_name.endswith('.mp3') else 'audio/wav'
    return send_file(file_path, as_attachment=True, mimetype=mimetype)

@app.route("/downloads", methods=['GET'])
def list_downloads():
    download_folder = "downloads"

    # Lista os arquivos mais recentes
    if not os.path.exists(download_folder):
        return jsonify([])

    files = sorted(os.listdir(download_folder), key=lambda f: os.path.getctime(os.path.join(download_folder, f)), reverse=True)
    return jsonify(files[:10])

if __name__ == "__main__":
    app.run(debug=True, host='192.168.3.225', port=5000)