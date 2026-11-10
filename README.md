# House Price Predictor

A minimal web app that predicts median house price from median income,
house age and population. FastAPI backend, plain HTML/CSS/JS frontend.

## Run locally

```bash
git clone https://github.com/<your-username>/house-price-predictor.git
cd house-price-predictor
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn run:app --reload
```

Open http://127.0.0.1:8000/ui

## API

`POST /predict`

```json
{ "MedInc": 3.5, "HouseAge": 25, "Population": 1200 }
```

Interactive docs: http://127.0.0.1:8000/docs

## Notes

- Model trained on the California housing dataset; output is in units of $100,000.
- `run.py` adds CORS and serves the frontend without modifying `main.py`.