from savify import Savify
from savify.types import Quality
from savify.utils import PathHolder
from savify.logger import Logger

class MusicDownloader:
    def __init__(self, music_url, download_folder='downloads', log_folder='logs', quality=Quality.Q320K):
        self.music_url = music_url
        self.download_folder = download_folder
        self.log_folder = log_folder
        self.quality = quality
        
        self.logger = Logger(log_location=self.log_folder, log_level=None)
        
        self.instance = Savify(
            path_holder=PathHolder(downloads_path=self.download_folder),
            logger=self.logger,
            quality=self.quality
        )

    def download_song(self):
        self.instance.download(self.music_url)


if __name__ == "__main__":
    
    music_url = 'https://open.spotify.com/intl-pt/track/1158ckiB5S4cpsdYHDB9IF?si=a2c7efd4d28d46f5'
    downloader = MusicDownloader(music_url)
    
    downloader.download_song()
