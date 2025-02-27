from savify import Savify
from savify.types import Quality
from savify.utils import PathHolder
from savify.logger import Logger
import os
import re

class MusicDownloader:
    def __init__(self, music_url, log_folder='logs', quality=Quality.Q320K):
        self.music_url = music_url
        self.download_folder = 'downloads'  # Pasta de downloads

        os.makedirs(self.download_folder, exist_ok=True)

        self.logger = Logger(log_location=log_folder, log_level=None)

        self.instance = Savify(
            path_holder=PathHolder(downloads_path=self.download_folder),
            logger=self.logger,
            quality=quality
        )

    def sanitize_filename(self, filename):
        # Remove caracteres especiais ou espaços do nome do arquivo
        return re.sub(r'[^a-zA-Z0-9_-]', '_', filename)

    def download_song(self):
        # Baixar a música
        self.instance.download(self.music_url)

        files = os.listdir(self.download_folder)

        if not files:
            raise Exception("Erro: Nenhum arquivo foi baixado.")

        # Pega o arquivo mais recente baixado
        latest_file = sorted(files, key=lambda f: os.path.getctime(os.path.join(self.download_folder, f)))[-1]
        print(f"Nome do arquivo baixado: {latest_file}")  # Verificando o nome do arquivo

        # Sanitizando o nome do arquivo para evitar problemas
        file_name = self.sanitize_filename(latest_file)

        # Garantir que o nome do arquivo tenha a extensão correta
        if not file_name.endswith('.mp3'):
            file_name += '.mp3'

        file_path = os.path.join(self.download_folder, latest_file)

        return file_path, file_name  # Retornando tanto o caminho quanto o nome
