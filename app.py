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

    if "open.spotify.com" not in music_url or "/track/" not in music_url:
        return jsonify({'error': 'Link do Spotify inválido'}), 400

    try:
        downloader = MusicDownloader(music_url)
        file_path = downloader.download_song()
        file_name = os.path.basename(file_path)
        return jsonify({'file_name': file_name})

    except (RuntimeError, FileNotFoundError) as e:
        return jsonify({'error': f'Ocorreu um erro ao baixar a música: {str(e)}'}), 500

@app.route("/download/<file_name>", methods=['GET'])
def download(file_name):
    file_path = os.path.join("downloads", file_name)

    if not os.path.exists(file_path):
        return jsonify({'error': 'Arquivo não encontrado'}), 404

    return send_file(
        file_path,
        as_attachment=True,
        mimetype='audio/mpeg'
    )

@app.route("/downloads", methods=['GET'])
def list_downloads():
    download_folder = "downloads"
    if not os.path.exists(download_folder):
        return jsonify([])
    
    files = sorted(os.listdir(download_folder), key=lambda f: os.path.getctime(os.path.join(download_folder, f)), reverse=True)
    return jsonify(files[:10])

if __name__ == "__main__":
    app.run(debug=True, host='192.168.3.225', port=5000)
