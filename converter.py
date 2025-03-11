from savify import Savify
from savify.types import Quality
from savify.utils import PathHolder
from savify.logger import Logger
import os
from pydub import AudioSegment
from pathlib import Path

class MusicDownloader:
    DOWNLOAD_FOLDER = "downloads"
    LOG_FOLDER = "logs"

    def __init__(self, music_url, file_format='mp3', quality=Quality.Q320K):
        self.music_url = music_url
        self.file_format = file_format.lower()  # Garante consistência
        self.quality = quality

        # Cria pastas necessárias
        os.makedirs(self.DOWNLOAD_FOLDER, exist_ok=True)
        os.makedirs(self.LOG_FOLDER, exist_ok=True)

        self.logger = Logger(log_location=self.LOG_FOLDER, log_level=None)

        self.instance = Savify(
            path_holder=PathHolder(downloads_path=self.DOWNLOAD_FOLDER),
            logger=self.logger,
            quality=self.quality
        )

    def clean_old_downloads(self):
        """Remove os arquivos mais antigos se houver mais de 10."""
        files = sorted(Path(self.DOWNLOAD_FOLDER).glob("*"), key=os.path.getctime)
        for file in files[:-10]:
            file.unlink()
            print(f"Arquivo excluído: {file.name}")

    def convert_to_wav(self, mp3_file_path):
        """Converte um arquivo MP3 para WAV."""
        wav_file_path = mp3_file_path.with_suffix(".wav")
        audio = AudioSegment.from_mp3(mp3_file_path)
        audio.export(wav_file_path, format="wav")
        return wav_file_path

    def download_song(self):
        """Faz o download da música no formato especificado."""
        self.clean_old_downloads()

        # Faz o download no formato padrão (MP3)
        self.instance.download(self.music_url)

        # Encontra o arquivo mais recente
        files = sorted(Path(self.DOWNLOAD_FOLDER).glob("*"), key=os.path.getctime)
        if not files:
            raise Exception("Erro: Nenhum arquivo foi baixado.")

        downloaded_file_path = files[-1]

        # Converte para WAV, se necessário
        if self.file_format == "wav":
            mp3_file_path = downloaded_file_path
            downloaded_file_path = self.convert_to_wav(mp3_file_path)

            if mp3_file_path.exists():
                mp3_file_path.unlink()
                print(f"Arquivo MP3 original excluído: {mp3_file_path.name}")
            else:
                print(f"Arquivo MP3 original não encontrado para exclusão: {mp3_file_path.name}")

        return str(downloaded_file_path)