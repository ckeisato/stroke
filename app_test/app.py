from flask import Flask, escape, request, jsonify
import pickle
import pandas as pd
import numpy as np
import json

# flast run

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])

def main():
  headers = {
    'Access-Control-Allow-Origin': '*'
  }

  request_json = request.get_json(silent=True)

  if request_json:
    model = pickle.load(open('../model/serialized/model.sav', 'rb'))
    encoder = pickle.load(open('../model/serialized/encoder.sav', 'rb'))
    
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    try:
        request_json = request.get_json(silent=True)
        if request_json:
            gender = request_json['gender']
            age = request_json['age']
            hypertension = request_json['hypertension']
            heart_disease = request_json['heart_disease']
            ever_married = request_json['ever_married']
            work_type = request_json['work_type']
            residence_type = request_json['residence_type']
            glucose = request_json['glucose']
            bmi = request_json['bmi']
            smoking = request_json['smoking']

            params = np.array([
                encoder["gender"].transform([gender]),
                age,
                hypertension,
                heart_disease,
                encoder["ever_married"].transform([ever_married]),
                encoder["work_type"].transform([work_type]),
                encoder["residence_type"].transform([residence_type]),
                glucose,
                bmi,
                encoder["smoking_status"].transform([smoking])
            ]).flatten().astype(np.float32)

            result = model.predict_proba([params])
            return ((jsonify({"noStroke": result[0][0], "stroke": result[0][1]})), 200, headers)
        else:
            return ('Please send some info thnx', 200, headers)
    except Exception as e:
        return (str(e), 500, headers)

    return ('something else happened (._.)', 200, headers)

