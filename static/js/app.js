let radarChart, lineChart, doughnutChart;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Charts
    initCharts();

    // Real-time slider value updates
    const sliders = [
        { id: 'cgpa', valId: 'cgpa-val', suffix: '' },
        { id: 'academic_backlogs', valId: 'backlogs-val', suffix: '' },
        { id: 'internships', valId: 'internships-val', suffix: '' },
        { id: 'projects', valId: 'projects-val', suffix: '' },
        { id: 'communication_skills', valId: 'comm-val', suffix: '' },
        { id: 'certifications', valId: 'cert-val', suffix: '' },
        { id: 'college_tier', valId: 'tier-val', suffix: '' },
        { id: 'year', valId: 'year-val', suffix: '' },
        { id: 'loan_amount', valId: 'loan-val', isCurrency: true }
    ];

    sliders.forEach(slider => {
        const el = document.getElementById(slider.id);
        const valEl = document.getElementById(slider.valId);

        if (el && valEl) {
            el.addEventListener('input', (e) => {
                let value = e.target.value;
                if (slider.isCurrency) {
                    valEl.textContent = (value / 100000).toFixed(1) + ' L';
                } else {
                    valEl.textContent = value + (slider.suffix || '');
                }

                updateRadarChart();
                updateDoughnutChart();
            });
        }
    });

    // Select listeners for charts
    ['branch', 'internship_quality', 'market_demand'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', () => {
                updateRadarChart();
                updateDoughnutChart();
            });
        }
    });
});

function initCharts() {
    const radarCtx = document.getElementById('radarChart').getContext('2d');
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Outfit', sans-serif";

    radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: ['CGPA', 'Consistency', 'Internships', 'Projects', 'Communication', 'Certifications'],
            datasets: [{
                label: 'Profile',
                data: [8.5, 0, 1, 3, 7, 2],
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: '#6366f1',
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                suggestedMin: 0,
                suggestedMax: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    suggestedMin: 0,
                    suggestedMax: 10,
                    ticks: { display: false }
                }
            },
            plugins: { legend: { display: false } }
        }
    });

    lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Current', '3M', '6M', '12M'],
            datasets: [{
                data: [0, 0, 0, 0],
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { font: { size: 10 } } }
            },
            plugins: { legend: { display: false } }
        }
    });

    doughnutChart = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
            labels: ['Fit', 'Demand', 'Stability'],
            datasets: [{
                data: [70, 60, 80],
                backgroundColor: ['#6366f1', '#a855f7', '#10b981'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 10, padding: 15, font: { size: 10 } } }
            }
        }
    });

    updateRadarChart();
    updateDoughnutChart();
}

function updateRadarChart() {
    if (!radarChart) return;
    const data = [
        parseFloat(document.getElementById('cgpa').value),
        Math.max(0, 10 - (parseInt(document.getElementById('academic_backlogs').value) * 1.5)),
        Math.min(10, parseInt(document.getElementById('internships').value) * 2),
        Math.min(10, parseInt(document.getElementById('projects').value)),
        parseFloat(document.getElementById('communication_skills').value),
        Math.min(10, parseInt(document.getElementById('certifications').value) * 1.25)
    ];
    radarChart.data.datasets[0].data = data;
    radarChart.update('none');
}

function updateDoughnutChart() {
    if (!doughnutChart) return;
    const cgpa = parseFloat(document.getElementById('cgpa').value) || 8;
    const backlogs = parseInt(document.getElementById('academic_backlogs').value) || 0;
    const comms = parseFloat(document.getElementById('communication_skills').value) || 7;
    const projects = parseInt(document.getElementById('projects').value) || 0;
    const certs = parseInt(document.getElementById('certifications').value) || 0;
    const interns = parseInt(document.getElementById('internships').value) || 0;
    const market = document.getElementById('market_demand').value;
    const branch = document.getElementById('branch').value;

    // Model-Linked Logic (Synchronized with M+ Backend Algorithms)
    // 1. Fit (Portfolio_Strength equivalent)
    let portfolio_power = (projects * 1.5) + (certs * 1.2) + (interns * 2.0);
    let fit = (portfolio_power / 15) * 100; // Normalized to 100
    if (branch === 'CSE' || branch === 'MBA') fit += 10;

    // 2. Demand (Market + Tier influence)
    let demand = 45;
    if (market === 'high') demand = 90;
    else if (market === 'medium') demand = 70;
    if (branch === 'CSE') demand += 5;

    // 3. Stability (Success_Score equivalent) - Highly sensitive to academic setbacks
    let success_logic = (cgpa * comms) / (Math.pow(backlogs, 1.5) + 1);
    let stability = (success_logic / 60) * 100;

    const finalData = [
        Math.min(100, Math.max(15, fit)),
        Math.min(100, Math.max(20, demand)),
        Math.min(100, Math.max(10, stability))
    ];

    doughnutChart.data.datasets[0].data = finalData;
    doughnutChart.update();
}

function updateLineChart(p3, p6, p12, rate) {
    if (!lineChart) return;

    // Map probabilistic milestones based on Model M+ outcomes
    const data = [
        0,
        p3 === 'Yes' ? Math.max(75, rate * 0.8) : 35,
        p6 === 'Yes' ? Math.max(88, rate * 0.9) : 55,
        rate
    ];

    lineChart.data.datasets[0].data = data;
    lineChart.update();
}

document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const loader = document.getElementById('loader');
    const submitBtn = e.target.querySelector('button');
    loader.style.display = 'inline-block';
    submitBtn.disabled = true;

    const formData = {
        cgpa: document.getElementById('cgpa').value,
        academic_backlogs: document.getElementById('academic_backlogs').value,
        internships: document.getElementById('internships').value,
        internship_quality: document.getElementById('internship_quality').value,
        certifications: document.getElementById('certifications').value,
        projects: document.getElementById('projects').value,
        communication_skills: document.getElementById('communication_skills').value,
        extra_curricular: document.getElementById('extra_curricular').value,
        college_tier: document.getElementById('college_tier').value,
        year: document.getElementById('year').value,
        branch: document.getElementById('branch').value,
        region: document.getElementById('region').value,
        market_demand: document.getElementById('market_demand').value,
        loan_amount: document.getElementById('loan_amount').value,
        emi_monthly: document.getElementById('emi_monthly').value,
        delayed_placement_risk: document.getElementById('delayed_placement_risk').value
    };

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('val_3m').textContent = result.placed_3m;
            document.getElementById('val_6m').textContent = result.placed_6m;
            document.getElementById('val_12m').textContent = result.placed_12m;
            document.getElementById('val_sal').textContent = `₹ ${result.salary_lpa} L`;
            document.getElementById('val_rate').textContent = `${result.placement_rate}%`;

            updateLineChart(result.placed_3m, result.placed_6m, result.placed_12m, result.placement_rate);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        loader.style.display = 'none';
        submitBtn.disabled = false;
    }
});
