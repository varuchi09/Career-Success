# PRAGYA — Career Success Predictor

An ML-powered career outcome prediction system built for the **TenzorX 2026 National AI Hackathon**. PRAGYA analyzes student profiles — academic history, skills, internships, financial data, and market conditions — to forecast placement probability, expected salary, and career readiness.

> Move beyond CGPA. Get holistic career insights across 21 features.

---

## Features

- **Multi-horizon placement prediction** — 3, 6, and 12 month placement probability
- **Salary forecasting** — Expected salary in LPA using tuned XGBoost regressor
- **Aggregate placement score** — Composite readiness metric
- **Interactive dashboard** — Radar chart (skills), line chart (timeline), doughnut chart (industry match)
- **Glassmorphic dark UI** — Responsive, animated, mobile-friendly interface

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python, Flask |
| ML Core | XGBoost (XGBClassifier, XGBRegressor), Scikit-learn pipelines |
| Data | Pandas, NumPy, OneHotEncoder, OrdinalEncoder, ColumnTransformer |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Visualization | Chart.js |
| Serialization | joblib |

---

## Project Structure

```
PRAGYA/
├── app.py                  # Flask web application (entry point)
├── models.pkl              # Serialized model bundle (5 models)
├── dataset.csv             # Training dataset (10,000 records)
├── model.ipynb             # Jupyter notebook — model training
├── templates/
│   └── index.html          # Single-page web app (Jinja2)
├── static/
│   ├── css/style.css       # Glassmorphism dark-theme UI
│   └── js/app.js           # Client-side logic, charts, API calls
└── career success/         # Earlier experimental iteration
```

---

## How It Works

1. **User Input** — Fill the form with 16+ parameters (CGPA, backlogs, projects, internships, skills, etc.)
2. **Feature Engineering** — Server computes derived metrics:
   - `Success Score = (cgpa × communication_skills) / (backlogs + 1)`
   - `Portfolio Strength = (projects × 1.5) + (certifications × 1.2) + (internships × 2.0)`
   - `Skill Depth = communication_skills + certifications + projects`
3. **Multi-Model Inference** — 5 specialized XGBoost models run simultaneously
4. **Results** — JSON response populates dashboard with predictions and charts

---

## Installation

```bash
# Clone the repo
git clone https://github.com/MAYANKGARG785/PRAGYA.git
cd PRAGYA

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # macOS/Linux

# Install dependencies
pip install flask pandas numpy scikit-learn xgboost joblib

# Train models (generates models.pkl)
jupyter notebook model.ipynb

# Run the app
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

> **Note:** `models.pkl` is gitignored. Run all cells in `model.ipynb` to generate it.

---

## Dataset

- **10,000 student records**, 23 columns, zero null values
- Features: CGPA, backlogs, internships, certifications, projects, communication skills, college tier, branch, placement rate, market demand, region, loan amount, EMI, and more
- Targets: `placed_3m`, `placed_6m`, `placed_12m` (binary), `salary_lpa` (continuous), `placement_rate` (continuous)

---

## Team

| Name | Role |
|------|------|
| **Mayank Garg** | System Architect & ML Engineer |
| **Varuchi Maurya** | Data Scientist & AI Architect |

---

## License

This project was developed for the TenzorX 2026 National AI Hackathon.
