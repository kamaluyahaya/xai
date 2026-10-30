'use client';

import Sidebar from '@/components/Sidebar';

const confusionMatrix = {
  tp: 842, fp: 48,
  fn: 31, tn: 1079,
};

const rocPoints = [
  [0, 0], [0.02, 0.18], [0.05, 0.38], [0.08, 0.55], [0.12, 0.68],
  [0.18, 0.78], [0.25, 0.85], [0.35, 0.91], [0.50, 0.95], [0.70, 0.97], [1, 1],
];

const biasMetrics = [
  { group: 'Gender (Male vs Female)', metric: 'Disparate Impact', value: 0.96, threshold: 0.8, pass: true },
  { group: 'Age (18-30 vs 31+)', metric: 'Equal Opportunity', value: 0.91, threshold: 0.8, pass: true },
  { group: 'Ethnicity', metric: 'Statistical Parity', value: 0.88, threshold: 0.8, pass: true },
  { group: 'Location (Urban vs Rural)', metric: 'Disparate Impact', value: 0.84, threshold: 0.8, pass: true },
  { group: 'Income Level', metric: 'Calibration', value: 0.93, threshold: 0.85, pass: true },
];

const hyperparams = [
  { name: 'n_estimators', value: '300', description: 'Number of boosting rounds' },
  { name: 'max_depth', value: '6', description: 'Maximum tree depth' },
  { name: 'learning_rate', value: '0.05', description: 'Shrinkage step size' },
  { name: 'subsample', value: '0.85', description: 'Row sampling fraction' },
  { name: 'colsample_bytree', value: '0.80', description: 'Feature sampling per tree' },
  { name: 'min_child_weight', value: '3', description: 'Minimum sum of instance weight' },
  { name: 'gamma', value: '0.1', description: 'Minimum loss reduction for split' },
  { name: 'reg_alpha', value: '0.05', description: 'L1 regularization' },
  { name: 'reg_lambda', value: '1.0', description: 'L2 regularization' },
  { name: 'scale_pos_weight', value: '1.15', description: 'Class imbalance correction' },
];

export default function ModelTransparencyPage() {
  const total = confusionMatrix.tp + confusionMatrix.fp + confusionMatrix.fn + confusionMatrix.tn;
  const accuracy = ((confusionMatrix.tp + confusionMatrix.tn) / total * 100).toFixed(1);
  const precision = (confusionMatrix.tp / (confusionMatrix.tp + confusionMatrix.fp) * 100).toFixed(1);
  const recall = (confusionMatrix.tp / (confusionMatrix.tp + confusionMatrix.fn) * 100).toFixed(1);
  const f1 = (2 * +precision * +recall / (+precision + +recall)).toFixed(1);

  // ROC SVG path
  const w = 320, h = 200;
  const path = rocPoints.map(([x, y], i) => {
    const px = x * w;
    const py = h - y * h;
    return `${i === 0 ? 'M' : 'L'}${px},${py}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px', minHeight: '100vh' }}>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '28px', fontWeight: 900, letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #F0F9FF, #A78BFA)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Model Transparency</h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
            Full explainability report — model architecture, performance, fairness, and hyperparameters
          </p>
        </div>

        {/* Performance overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Accuracy', value: `${accuracy}%`, color: '#38BDF8' },
            { label: 'Precision', value: `${precision}%`, color: '#4ADE80' },
            { label: 'Recall', value: `${recall}%`, color: '#A78BFA' },
            { label: 'F1 Score', value: `${f1}%`, color: '#FBBF24' },
          ].map((m, i) => (
            <div key={i} style={{
              background: 'rgba(13,31,60,0.6)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${m.color}25`,
              borderRadius: '14px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{m.label}</div>
              <div style={{ fontSize: '36px', fontWeight: 900, color: m.color, letterSpacing: '-0.02em', fontFamily: 'monospace' }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

          {/* Confusion Matrix */}
          <div style={{
            background: 'rgba(13,31,60,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(56,189,248,0.15)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF', marginBottom: '6px' }}>Confusion Matrix</h2>
            <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '20px' }}>Validation set — 2,000 test samples</p>

            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gridTemplateRows: '30px 1fr 1fr', gap: '4px', maxWidth: '380px' }}>
              {/* Headers */}
              <div />
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8', fontWeight: 600, padding: '4px' }}>Predicted: Approve</div>
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8', fontWeight: 600, padding: '4px' }}>Predicted: Reject</div>

              <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Actual: Approve</div>
              {/* TP */}
              <div style={{
                background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)',
                borderRadius: '8px', padding: '20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#4ADE80', fontFamily: 'monospace' }}>{confusionMatrix.tp}</div>
                <div style={{ fontSize: '9px', color: '#4ADE80', fontWeight: 700, letterSpacing: '0.06em' }}>TRUE POS</div>
              </div>
              {/* FN */}
              <div style={{
                background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: '8px', padding: '20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#F87171', fontFamily: 'monospace' }}>{confusionMatrix.fn}</div>
                <div style={{ fontSize: '9px', color: '#F87171', fontWeight: 700, letterSpacing: '0.06em' }}>FALSE NEG</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Actual: Reject</div>
              {/* FP */}
              <div style={{
                background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: '8px', padding: '20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#F87171', fontFamily: 'monospace' }}>{confusionMatrix.fp}</div>
                <div style={{ fontSize: '9px', color: '#F87171', fontWeight: 700, letterSpacing: '0.06em' }}>FALSE POS</div>
              </div>
              {/* TN */}
              <div style={{
                background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)',
                borderRadius: '8px', padding: '20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#4ADE80', fontFamily: 'monospace' }}>{confusionMatrix.tn}</div>
                <div style={{ fontSize: '9px', color: '#4ADE80', fontWeight: 700, letterSpacing: '0.06em' }}>TRUE NEG</div>
              </div>
            </div>

            <div style={{ marginTop: '16px', fontSize: '11px', color: '#94A3B8', lineHeight: 1.5 }}>
              AUC-ROC: <strong style={{ color: '#38BDF8' }}>0.974</strong> · 
              Gini: <strong style={{ color: '#38BDF8' }}>0.948</strong> · 
              KS Stat: <strong style={{ color: '#38BDF8' }}>0.712</strong>
            </div>
          </div>

          {/* ROC Curve */}
          <div style={{
            background: 'rgba(13,31,60,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(56,189,248,0.15)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF', marginBottom: '6px' }}>ROC Curve (AUC = 0.974)</h2>
            <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '16px' }}>Receiver Operating Characteristic — XGBoost primary model</p>

            <svg width="100%" viewBox={`0 0 ${w + 40} ${h + 40}`} style={{ maxWidth: '400px', display: 'block' }}>
              {/* Grid */}
              {[0.2, 0.4, 0.6, 0.8].map(v => (
                <g key={v}>
                  <line x1="30" y1={h - v * h + 5} x2={w + 30} y2={h - v * h + 5} stroke="rgba(56,189,248,0.08)" strokeDasharray="4 4" />
                  <text x="24" y={h - v * h + 9} textAnchor="end" fill="#475569" fontSize="9">{v.toFixed(1)}</text>
                  <line x1={v * w + 30} y1="5" x2={v * w + 30} y2={h + 5} stroke="rgba(56,189,248,0.08)" strokeDasharray="4 4" />
                  <text x={v * w + 30} y={h + 18} textAnchor="middle" fill="#475569" fontSize="9">{v.toFixed(1)}</text>
                </g>
              ))}
              {/* Diagonal baseline */}
              <line x1="30" y1={h + 5} x2={w + 30} y2="5" stroke="rgba(248,113,113,0.3)" strokeDasharray="6 4" />
              {/* ROC fill */}
              <path
                d={`${path.replace(/M/g, 'M').split('M')[1] ? 'M30,' + (h + 5) + ' ' + path.split(' ').map(s => {
                  const parts = s.split(',');
                  if (parts.length === 2) return (s.startsWith('M') ? 'L' : s[0]) + (parseFloat(s.slice(1).split(',')[0] || parts[0].slice(1)) + 30) + ',' + (parseFloat(parts[1]) + 5);
                  return s;
                }).join(' ') + ' L' + (w + 30) + ',' + (h + 5) + ' Z' : ''}`}
                fill="url(#rocGrad)"
                opacity="0.15"
              />
              {/* ROC line */}
              <path
                d={path.split(' ').map(s => {
                  if (s.startsWith('M') || s.startsWith('L')) {
                    const coords = s.slice(1).split(',');
                    return s[0] + (parseFloat(coords[0]) + 30) + ',' + (parseFloat(coords[1]) + 5);
                  }
                  return s;
                }).join(' ')}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 0 4px rgba(56,189,248,0.6))' }}
              />
              <defs>
                <linearGradient id="rocGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              {/* Labels */}
              <text x={(w + 60) / 2} y={h + 34} textAnchor="middle" fill="#94A3B8" fontSize="10">False Positive Rate</text>
              <text x="10" y={h / 2 + 5} textAnchor="middle" fill="#94A3B8" fontSize="10" transform={`rotate(-90 10 ${h / 2})`}>True Positive Rate</text>
            </svg>
          </div>
        </div>

        {/* Fairness Metrics */}
        <div style={{
          background: 'rgba(13,31,60,0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(74,222,128,0.15)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <div style={{ position: 'absolute', display: 'none' }} />
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF', marginBottom: '4px' }}>Fairness & Bias Analysis</h2>
          <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '20px' }}>
            Algorithmic fairness checks across protected demographic groups (EU AI Act compliance)
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {biasMetrics.map((bm, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '240px 160px 1fr 80px 80px',
                gap: '16px',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(5,11,24,0.4)',
                borderRadius: '10px',
                border: '1px solid rgba(56,189,248,0.06)',
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#F0F9FF' }}>{bm.group}</div>
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{bm.metric}</div>
                <div style={{ position: 'relative' }}>
                  {/* Bar */}
                  <div style={{ height: '6px', background: 'rgba(56,189,248,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${bm.value * 100}%`,
                      background: 'linear-gradient(90deg, #4ADE80, #22D3EE)',
                      borderRadius: '3px',
                    }} />
                  </div>
                  {/* Threshold marker */}
                  <div style={{
                    position: 'absolute',
                    left: `${bm.threshold * 100}%`,
                    top: '-4px',
                    width: '2px',
                    height: '14px',
                    background: '#FBBF24',
                    borderRadius: '1px',
                  }} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#4ADE80', fontFamily: 'monospace', textAlign: 'center' }}>
                  {bm.value.toFixed(2)}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 700,
                    color: bm.pass ? '#4ADE80' : '#F87171',
                    background: bm.pass ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                    border: `1px solid ${bm.pass ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                    borderRadius: '4px',
                    padding: '2px 8px',
                  }}>{bm.pass ? '✓ PASS' : '✗ FAIL'}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '11px', color: '#94A3B8' }}>
            <div style={{ width: '12px', height: '2px', background: '#FBBF24', borderRadius: '1px' }} />
            Threshold line = minimum acceptable fairness score
            <span style={{ marginLeft: '8px', color: '#4ADE80', fontWeight: 600 }}>✓ All fairness checks passed</span>
          </div>
        </div>

        {/* Hyperparameters */}
        <div style={{
          background: 'rgba(13,31,60,0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(56,189,248,0.15)',
          borderRadius: '16px',
          padding: '24px',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF', marginBottom: '4px' }}>Model Hyperparameters</h2>
          <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '20px' }}>XGBoost configuration — optimized via Bayesian hyperparameter search</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            {hyperparams.map((hp, i) => (
              <div key={i} style={{
                background: 'rgba(5,11,24,0.5)',
                border: '1px solid rgba(56,189,248,0.1)',
                borderRadius: '10px',
                padding: '14px',
              }}>
                <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '6px', fontFamily: 'monospace' }}>{hp.name}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#38BDF8', fontFamily: 'monospace', marginBottom: '4px' }}>{hp.value}</div>
                <div style={{ fontSize: '9px', color: '#475569', lineHeight: 1.3 }}>{hp.description}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
