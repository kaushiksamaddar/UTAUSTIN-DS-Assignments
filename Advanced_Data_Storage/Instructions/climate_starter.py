import numpy as np
import pandas as pd
import datetime as dt
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

#========================================================================================
# Database setup
#========================================================================================
engine = create_engine("sqlite:///Resources/hawaii.sqlite")
Base = automap_base()
Base.prepare(engine, reflect=True)
# We can view all of the classes that automap found
Base.classes.keys()

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)
#========================================================================================

# Calculate the date 1 year ago from the last data point in the database
lastDate = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
lastDateDT = dt.datetime.strptime(lastDate[0], '%Y-%m-%d').date()
date12Delta = lastDateDT - dt.timedelta(days=365)
print("Date 1 year ago from the Last Date %s in the DB: %s" %(lastDateDT, str(date12Delta)))

# Perform a query to retrieve the data and precipitation scores
q = session.query(Measurement.date, Measurement.prcp).filter(Measurement.date >= date12Delta).filter(Measurement.date <= lastDateDT)
print(q.statement)

# Save the query results as a Pandas DataFrame and set the index to the date column
df = pd.read_sql(q.statement, engine.connect())
date_indx_df = df.set_index('date')

# Sort the dataframe by date
date_indx_df = date_indx_df.sort_values(by='date', axis=0)
date_indx_df = date_indx_df.dropna(how='any')

df = df.dropna(how='any')
#========================================================================================
# Flask Setup
#========================================================================================
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def welcome():
    '''
        List all available API Routes
    '''
    return(
        f"Available routes <br/>"
        f"<a href='http://127.0.0.1:5000/api/v0.1/precipitation'>Click to see the Precipitation</a><br />"
        f"<a href='http://127.0.0.1:5000/api/v0.1/stations'>Click to see the Stations</a><br />"
        f"<a href='http://127.0.0.1:5000/api/v0.1/tobs'>Click to see the tobs</a>"
    )

@app.route("/api/v0.1/precipitation")
def precipitation():
    '''
        Fetch precipitations against the days.
    '''
    precpList = []

    for indx, prec in df.iterrows():
        precpDict = {}
        print("For index: %s" %indx)
        precpDict[prec['date']]=prec['prcp']
        precpList.append(precpDict)

    return jsonify(precpList)

stations = session.query(Station.station).all()
stations = list(np.ravel(stations))

@app.route("/api/v0.1/stations")
def getStations():
    '''
        Fetch all the stations
    '''
    return jsonify(stations)

if __name__ == "__main__":
    app.run(debug=True)

