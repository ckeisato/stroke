# model training
import pandas as pd
import numpy as np
import pickle

from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# gets/cleans data, trains model, pickles model
def initModel():
  data = pd.read_csv('resources/stroke-data.csv')

  print("Number of records", data.shape)
  test_data = data.copy(deep=True)
  test_data = test_data.rename(columns={"Residence_type": "residence_type"})


  # set up label encoders
  encoders = {
    "gender": LabelEncoder().fit(test_data["gender"].values),
    "ever_married": LabelEncoder().fit(test_data["ever_married"].values),
    "work_type": LabelEncoder().fit(test_data["work_type"].values),
    "residence_type": LabelEncoder().fit(test_data["residence_type"].values),
    "smoking_status": LabelEncoder().fit(test_data["smoking_status"].values)
  }

  for label in ["gender", "ever_married", "work_type",
    "residence_type", "smoking_status"]:
    test_data[label] = encoders[label].transform(test_data[label])

  # account for nan in BMI column
  bmi_avg = test_data["bmi"].mean()
  test_data["bmi"] = test_data["bmi"].replace(np.nan, bmi_avg)
    
  x_train, x_test, y_train, y_test = train_test_split(
      test_data.drop(["id", "stroke"], axis=1),
      test_data["stroke"],
      test_size=0.2
  )
  print('done splitting data')


  # train model
  neigh = KNeighborsClassifier(n_neighbors=5, weights="distance")
  neigh.fit(x_train, y_train)
  print('done fitting model, will start scoring')

  score = neigh.score(x_test, y_test)
  print('model score', score)

  pickle.dump(neigh, open('serialized/model.sav', 'wb'))
  pickle.dump(encoders, open('serialized/encoder.sav', 'wb'))

initModel()
