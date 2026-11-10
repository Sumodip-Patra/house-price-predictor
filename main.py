from pydantic import BaseModel,Field
from typing import Annotated
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import pickle
import pandas as pd

app = FastAPI()

#loading the model
with open("model.pkl", "rb") as file:
    model= pickle.load(file)

class UserInput(BaseModel):
    MedInc: Annotated[float,Field(...,description = "Median Income")]
    HouseAge: Annotated[int,Field(...,description="House Age")]
    Population: Annotated[float,Field(...,description="Population of the area")]


@app.get("/")
def descp():
    return "Predict the median price of your property"

@app.post("/predict")
def predict_prices(data: UserInput):

    input_data= pd.DataFrame([{
        'MedInc': data.MedInc,
        'HouseAge':data.HouseAge,
        'Population':data.Population
    }])
    prediction_model = model.predict(input_data)[0]
    return JSONResponse(status_code=200, content={'prediction':  prediction_model})

