from flask import Flask, render_template, redirect, jsonify, request
from flask_cors import CORS
from converter import MusicDownloader

app = Flask("__name__")
CORS(app)

@app.route("/")
def homepage():
    return render_template("index.html")

@app.route("/convert_to_mp3", methods = ['GET'])
def convert():
    downloader = MusicDownloader("https://open.spotify.com/intl-pt/track/1158ckiB5S4cpsdYHDB9IF?si=069f678ce50049e0")
    downloader.download_song()
    return jsonify({'message': 'Música Baixada!'})

#API
@app.route("/api/hello", methods = ['GET'])
def hello():
    return jsonify({'message': 'Oi Oi Oi'})


if __name__ == "__main__":
    app.run(debug=True, port = 5000)
    


