from savify import Savify
from savify.types import Quality
from savify.utils import PathHolder
from savify.logger import Logger
import os

class MusicDownloader:
    def __init__(self, music_url, log_folder='logs', quality=Quality.Q320K):
        self.music_url = music_url
        self.download_folder = 'downloads'

        os.makedirs(self.download_folder, exist_ok=True)

        self.logger = Logger(log_location=log_folder, log_level=None)

        self.instance = Savify(
            path_holder=PathHolder(downloads_path=self.download_folder),
            logger=self.logger,
            quality=quality
        )

    def clean_old_downloads(self):
        files = sorted(os.listdir(self.download_folder), key=lambda f: os.path.getctime(os.path.join(self.download_folder, f)))
        
        if len(files) >= 10:
            oldest_file = files[0]
            oldest_file_path = os.path.join(self.download_folder, oldest_file)
            os.remove(oldest_file_path)
            print(f"Arquivo excluído: {oldest_file}")

    def download_song(self):
        self.clean_old_downloads()

        self.instance.download(self.music_url)
        
        files = os.listdir(self.download_folder)
        if not files:
            raise Exception("Erro: Nenhum arquivo foi baixado.")

        latest_file = sorted(files, key=lambda f: os.path.getctime(os.path.join(self.download_folder, f)))[-1]

        return os.path.join(self.download_folder, latest_file)
