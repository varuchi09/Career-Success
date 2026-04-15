from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)

# Core Model Loader
try:
    # Loading the synchronized master bundle [model_3m, model_6m, model_12m, model_sal, model_p_rate]
    models = joblib.load('models.pkl')
    model_3m, model_6m, model_12m, model_sal, model_p_rate = models
except Exception as e:
    print(f"Error loading models: {e}")
    models = None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if not models:
        return jsonify({'error': 'Models not loaded'}), 500
    
    try:
        data = request.json
        
        # Derived metrics and financial risk vectors
        cgpa = float(data['cgpa'])
        backlogs = int(data['academic_backlogs'])
        comms = float(data['communication_skills'])
        projects = int(data['projects'])
        certs = int(data['certifications'])
        interns = int(data['internships'])
        
        # Sanitized Engineering 2.0 (Model M+ Synchronization)
        # 1. Success Score: Combining academic and communication excellence
        success_score = (cgpa * comms) / (backlogs + 1)
        
        # 2. Portfolio Strength: Weighting projects and certifications heavily
        portfolio_strength = (projects * 1.5) + (certs * 1.2) + (interns * 2.0)
        
        # 3. skills/skill_depth: Combined skills total
        skills_total = comms + certs + projects
        
        # Constructing the EXACT 21-column feature vector required by Model M+
        # Ordering must match training X columns: ['cgpa', 'academic_backlogs', 'internships', 'internship_quality', 'certifications', 'projects', 'communication_skills', 'extra_curricular', 'college_tier', 'branch', 'market_demand', 'region', 'year', 'delayed_placement_risk', 'loan_amount', 'emi_monthly', 'income_coverage_ratio', 'Success_Score', 'Portfolio_Strength', 'skill_depth', 'skills']
        input_df = pd.DataFrame([{
            'cgpa': cgpa,
            'academic_backlogs': backlogs,
            'internships': interns,
            'internship_quality': data['internship_quality'],
            'certifications': certs,
            'projects': projects,
            'communication_skills': comms,
            'extra_curricular': int(data['extra_curricular']),
            'college_tier': int(data['college_tier']),
            'branch': data['branch'],
            'market_demand': data['market_demand'],
            'region': data['region'],
            'year': int(data['year']),
            'delayed_placement_risk': int(data.get('delayed_placement_risk', 0)),
            'loan_amount': float(data.get('loan_amount', 0)),
            'emi_monthly': float(data.get('emi_monthly', 0)),
            'income_coverage_ratio': 10.0,
            'Success_Score': success_score,
            'Portfolio_Strength': portfolio_strength,
            'skill_depth': skills_total,
            'skills': skills_total
        }])
        
        # Predicting using the sanitized M+ voting ensemble suite
        p_3m = int(model_3m.predict(input_df)[0])
        p_6m = int(model_6m.predict(input_df)[0])
        p_12m = int(model_12m.predict(input_df)[0])
        p_sal = round(float(model_sal.predict(input_df)[0]), 2)
        p_rate = round(float(model_p_rate.predict(input_df)[0]) * 100, 2)
        
        return jsonify({
            'placed_3m': 'Yes' if p_3m == 1 else 'No',
            'placed_6m': 'Yes' if p_6m == 1 else 'No',
            'placed_12m': 'Yes' if p_12m == 1 else 'No',
            'salary_lpa': p_sal,
            'placement_rate': p_rate
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
