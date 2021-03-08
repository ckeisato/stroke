from flask import Flask, escape, request, jsonify
import pickle
import pandas as pd
import numpy as np
import json


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
      encoder["Residence_type"].transform([residence_type]),
      glucose,
      bmi,
      encoder["smoking_status"].transform([smoking])
    ]).flatten().astype(np.float32)

    print(params)

    result = model.predict_proba([params])
    return ((jsonify({0: result[0][0], 1: result[0][1]})), 200, headers)

  # # result = loaded_model.predict_proba(loaded_vectorizer.transform([process_text(text)]))
  # print(text)
  # text = loaded_vectorizer.transform([text])
  # result = loaded_model.predict_proba(text)

  # print(result)
  return ('did not work', 200, headers)





# BUCKET = os.environ['BUCKET']
# ENCODER_FILENAME = os.environ['ENCODER_FILENAME']
# MODEL_FILENAME = os.environ['MODEL_FILENAME']

# client = storage.Client()
# bucket = client.get_bucket(BUCKET)

# encoder_blob = bucket.get_blob(ENCODER_FILENAME)
# model_blob = bucket.get_blob(MODEL_FILENAME)

# encoder = pickle.loads(encoder_blob.download_as_string())
# model = pickle.loads(model_blob.download_as_string())


# def stroke_predict(request):
#     headers = {
#         'Access-Control-Allow-Origin': '*',
#         'Access-Control-Allow-Headers': 'Content-Type',
#     }

#     try:
#         request_json = request.get_json(silent=True)
#         if request_json:
#             gender = request_json['gender']
#             age = request_json['age']
#             hypertension = request_json['hypertension']
#             heart_disease = request_json['heart_disease']
#             ever_married = request_json['ever_married']
#             work_type = request_json['work_type']
#             residence_type = request_json['residence_type']
#             glucose = request_json['glucose']
#             bmi = request_json['bmi']
#             smoking = request_json['smoking']

#             params = [
#               encoder.gender.transform(gender),
#               age,
#               hypertension,
#               heart_disease,
#               encoder.ever_married.transform(ever_married),
#               encoder.work_type.transform(work_type),
#               encoder.Residence_type.transform(residence_type),
#               glucose,
#               bmi,
#               encoder.smoking_status.transform(smoking)
#             ]

#             result = model.predict_proba([[params]])
#             return ((jsonify({ 'negative': result[0][0], 'positive': result[0][1]})), 200, headers)
#         else:
#             return ('Please send some info thnx', 200, headers)
#     except Exception as e:
#         return (str(e), 500, headers)

#     return ('something else happened (._.)', 200, headers)
