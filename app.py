from flask import Flask, render_template, redirect
from converter import MusicDownloader

app = Flask("__name__")

@app.route("/")
def homepage():
    return render_template("index.html")

@app.route("/convert_to_mp3")
def convert():
    downloader = MusicDownloader("https://open.spotify.com/intl-pt/track/1158ckiB5S4cpsdYHDB9IF?si=069f678ce50049e0")
    downloader.download_song()
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)
    


