# import necessary libraries
from flask import (
    Flask,
    render_template,
    jsonify,
    request)

from flask_sqlalchemy import SQLAlchemy

import pymysql
pymysql.install_as_MySQLdb

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/movies.sqlite"

db = SQLAlchemy(app)


class Imdbmovies(db.Model):
    __tablename__ = 'imdbmovies'

    Title = db.Column(db.String(64))
    Rated = db.Column(db.String(64))
    Released = db.Column(db.String(64))
    Runtime = db.Column(db.String(64))
    Genre = db.Column(db.String(64))
    Director = db.Column(db.String(64))
    Writer = db.Column(db.String(64))
    Actors = db.Column(db.String(64))
    Plot = db.Column(db.String(64))
    Language = db.Column(db.String(64))
    Country = db.Column(db.String(64))
    Awards = db.Column(db.String(64))
    Ratings = db.Column(db.String(64))
    Metascore = db.Column(db.Integer)
    imdbRating = db.Column(db.Float)
    imdbVotes = db.Column(db.String(64))
    imdbID = db.Column(db.Integer, primary_key = True)
    Boxoffice = db.Column(db.String(64))
    Production = db.Column(db.String(64))
    Website = db.Column(db.String(64))

    def __repr__(self):
        return '<Movie %r>' % (self.Title)

@app.route("/api/data")
def list_pets():
    results = db.session.query(Imdbmovies.Title, Imdbmovies.Director).all()

    movies = []
    for result in results:
        movies.append({
            "Title": result[0],
            "Director": result[1]
        })
    return jsonify(movies)

@app.route("/")
def home():
    return "Welcome to test!"


if __name__ == "__main__":
    app.run()