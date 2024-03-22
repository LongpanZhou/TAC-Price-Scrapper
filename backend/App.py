import sys
from flask import Flask, jsonify, request
from io import StringIO
import pandas as pd
import requests


app = Flask(__name__)


def exit_program():
    print("Exiting the program...")
    sys.exit(0)


def download_csv():
    response = requests.get("http://tacdb.osmocom.org/export/tacdb.csv")
    if response.status_code == 200:
        print("CSV file downloaded successfully.")
    else:
        print('Failed to download CSV file. Status code:', response.status_code)
        exit_program()
    return pd.read_csv(StringIO(response.text), skiprows=1)
# DF = download_csv()
DF = pd.read_csv("tacdb.csv", skiprows=1)

def query(param):
    param = param.strip("\"")
    if (len(param) == 8 or len(param) == 15 or len(param) == 16) and all([_.isdigit() for _ in param]):
        return DF[DF['tac'] == int(param[:8])].to_dict(orient="records")
    else:
        print("Error: Wrong query TAC/IMEI Parameter")
        return None


@app.route("/")
def hello_world():
    return "Hello, World!"

@app.route("/get")
def get():
    return jsonify(query(request.args.get("param")))

if __name__ == "__main__":
    app.run(debug=True)