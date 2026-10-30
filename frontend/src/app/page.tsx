'use client';

import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import { useState, useEffect } from 'react';

const recentDecisions = [
  { id: 'TXN-00842', customer: 'Amara Osei', type: 'Mortgage Loan', amount: '₦285,000,000', score: 742, status: 'APPROVED', confidence: 94, risk: 'LOW', time: '2 mins ago' },
  { id: 'TXN-00841', customer: 'David Chen', type: 'Business Credit', amount: '₦50,000,000', score: 589, status: 'REVIEW', confidence: 61, risk: 'MEDIUM', time: '7 mins ago' },
  { id: 'TXN-00840', customer: 'Fatima Al-Rashid', type: 'Personal Loan', amount: '₦12,500,000', score: 478, status: 'REJECTED', confidence: 88, risk: 'HIGH', time: '15 mins ago' },
  { id: 'TXN-00839', customer: 'James Okonkwo', type: 'Auto Loan', amount: '₦32,000,000', score: 711, status: 'APPROVED', confidence: 91, risk: 'LOW', time: '23 mins ago' },
  { id: 'TXN-00838', customer: 'Priya Sharma', type: 'Mortgage Loan', amount: '₦195,000,000', score: 668, status: 'APPROVED', confidence: 78, risk: 'MEDIUM', time: '31 mins ago' },
];

const modelMetrics = [
  { name: 'XGBoost Classifier', accuracy: 94.2, auc: 0.97, precision: 93.1, recall: 95.3, status: 'Primary' },
  { name: 'Random Forest', accuracy: 91.8, auc: 0.95, precision: 90.7, recall: 93.2, status: 'Ensemble' },
  { name: 'Logistic Regression', accuracy: 87.4, auc: 0.91, precision: 86.9, recall: 88.1, status: 'Baseline' },
];

const featureImportance = [
  { feature: 'Credit Score', importance: 0.34, category: 'Credit History' },
  { feature: 'Debt-to-Income Ratio', importance: 0.22, category: 'Financial' },
  { feature: 'Employment Duration', importance: 0.15, category: 'Employment' },
  { feature: 'Payment History', importance: 0.13, category: 'Credit History' },
  { feature: 'Loan-to-Value Ratio', importance: 0.09, category: 'Collateral' },
  { feature: 'Monthly Income', importance: 0.07, category: 'Financial' },
];

export default function DashboardPage() {
  const [liveCount, setLiveCount] = useState(1247);
  const [animTick, setAnimTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
      setAnimTick(t => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      {/* Main content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#4ADE80',
                  boxShadow: '0 0 8px rgba(74,222,128,0.8)',
                  animation: 'pulse-glow 2s ease infinite',
                }} />
                <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Live System
                </span>
              </div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #F0F9FF, #38BDF8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}>XAI Banking Decision System</h1>
              <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '6px', maxWidth: '500px' }}>
                Explainable AI for transparent & fair credit decisions — powered by SHAP, LIME and ensemble models
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#475569', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Decisions Today
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: 900,
                color: '#38BDF8',
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '-0.02em',
              }}>{liveCount.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Metric cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '32px',
        }}>
          <MetricCard
            title="Approval Rate"
            value="68.4%"
            subtext="↑ from 65.1% last month"
            color="green"
            icon="✓"
            trend={{ value: '3.3%', up: true }}
          />
          <MetricCard
            title="Model Accuracy"
            value="94.2%"
            subtext="XGBoost primary model"
            color="blue"
            icon="🎯"
            badge="Live"
            trend={{ value: '0.8%', up: true }}
          />
          <MetricCard
            title="Avg Risk Score"
            value="38.6"
            subtext="Across active applications"
            color="amber"
            icon="⚡"
            trend={{ value: '2.1', up: false }}
          />
          <MetricCard
            title="Under Review"
            value="147"
            subtext="Requires human review"
            color="purple"
            icon="👁"
          />
        </div>

        {/* Content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', marginBottom: '28px' }}>

          {/* Recent Decisions Table */}
          <div style={{
            background: 'rgba(13, 31, 60, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(56, 189, 248, 0.15)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(56, 189, 248, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF' }}>Recent AI Decisions</h2>
                <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Real-time decision log with explainability scores</p>
              </div>
              <a href="/decision-engine" style={{
                fontSize: '12px',
                color: '#38BDF8',
                textDecoration: 'none',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontWeight: 500,
              }}>View All →</a>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="xai-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Customer</th>
                    <th>Loan Type</th>
                    <th>Amount</th>
                    <th>Credit Score</th>
                    <th>Status</th>
                    <th>Confidence</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDecisions.map((row, idx) => (
                    <tr key={idx} style={{ cursor: 'pointer' }}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#38BDF8' }}>{row.id}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: `hsl(${idx * 60}, 60%, 35%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: '#fff',
                            flexShrink: 0,
                          }}>
                            {row.customer.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span style={{ fontSize: '13px' }}>{row.customer}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '12px', color: '#94A3B8' }}>{row.type}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '13px' }}>{row.amount}</td>
                      <td>
                        <span style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: row.score >= 700 ? '#4ADE80' : row.score >= 600 ? '#FBBF24' : '#F87171',
                        }}>{row.score}</span>
                      </td>
                      <td>
                        <span className={`status-${row.status.toLowerCase()}`} style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          letterSpacing: '0.06em',
                        }}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            height: '4px',
                            width: '50px',
                            background: 'rgba(56, 189, 248, 0.1)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${row.confidence}%`,
                              background: row.confidence > 80 ? '#4ADE80' : row.confidence > 60 ? '#FBBF24' : '#F87171',
                              borderRadius: '2px',
                            }} />
                          </div>
                          <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>{row.confidence}%</span>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: row.risk === 'LOW' ? '#4ADE80' : row.risk === 'MEDIUM' ? '#FBBF24' : '#F87171',
                        }}>{row.risk}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feature Importance Panel */}
          <div style={{
            background: 'rgba(13, 31, 60, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(56, 189, 248, 0.15)',
            borderRadius: '16px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)',
            }} />
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF', marginBottom: '4px' }}>Global Feature Importance</h2>
            <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '20px' }}>Averaged SHAP values across all decisions</p>

            {featureImportance.map((item, idx) => (
              <div key={idx} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#F0F9FF', fontWeight: 500 }}>{item.feature}</span>
                    <span style={{
                      marginLeft: '6px',
                      fontSize: '9px',
                      color: '#A78BFA',
                      background: 'rgba(167,139,250,0.1)',
                      borderRadius: '3px',
                      padding: '1px 5px',
                    }}>{item.category}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#38BDF8', fontFamily: 'monospace', fontWeight: 600 }}>
                    {(item.importance * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{
                  height: '6px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${item.importance * 100}%`,
                      background: `linear-gradient(90deg, #6366F1, #38BDF8)`,
                      borderRadius: '3px',
                      boxShadow: '0 0 8px rgba(99,102,241,0.4)',
                    }}
                  />
                </div>
              </div>
            ))}

            <div style={{
              marginTop: '20px',
              padding: '12px',
              background: 'rgba(5, 11, 24, 0.5)',
              borderRadius: '8px',
              border: '1px solid rgba(167,139,250,0.15)',
            }}>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Fairness Score
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#A78BFA', letterSpacing: '-0.02em' }}>91.3%</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>Disparate Impact Ratio: 0.94</div>
            </div>
          </div>
        </div>

        {/* Model Performance */}
        <div style={{
          background: 'rgba(13, 31, 60, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(56, 189, 248, 0.15)',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '28px',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(56, 189, 248, 0.1)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF' }}>Model Performance Comparison</h2>
            <p style={{ fontSize: '11px', color: '#94A3B8' }}>Benchmarking XGBoost, Random Forest, and Logistic Regression</p>
          </div>
          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {modelMetrics.map((model, idx) => (
              <div key={idx} style={{
                background: idx === 0 ? 'rgba(56, 189, 248, 0.05)' : 'rgba(5, 11, 24, 0.4)',
                border: `1px solid ${idx === 0 ? 'rgba(56, 189, 248, 0.3)' : 'rgba(56, 189, 248, 0.08)'}`,
                borderRadius: '12px',
                padding: '20px',
                position: 'relative',
              }}>
                {idx === 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#38BDF8',
                    background: 'rgba(56, 189, 248, 0.15)',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    letterSpacing: '0.06em',
                  }}>ACTIVE</span>
                )}
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#F0F9FF', marginBottom: '4px' }}>{model.name}</div>
                <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '16px' }}>{model.status} Model</div>

                {[
                  { label: 'Accuracy', value: `${model.accuracy}%`, color: '#38BDF8' },
                  { label: 'AUC-ROC', value: model.auc.toFixed(2), color: '#4ADE80' },
                  { label: 'Precision', value: `${model.precision}%`, color: '#A78BFA' },
                  { label: 'Recall', value: `${model.recall}%`, color: '#FBBF24' },
                ].map((metric, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                    <span style={{ color: '#94A3B8' }}>{metric.label}</span>
                    <span style={{ color: metric.color, fontWeight: 700, fontFamily: 'monospace' }}>{metric.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* XAI Architecture Overview */}
        <div style={{
          background: 'rgba(13, 31, 60, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(56, 189, 248, 0.15)',
          borderRadius: '16px',
          padding: '28px',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF', marginBottom: '6px' }}>XAI System Architecture</h2>
          <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '24px' }}>
            The explainability pipeline processes each decision through multiple interpretability layers
          </p>

          <div style={{ display: 'flex', gap: '0', alignItems: 'stretch' }}>
            {[
              { step: '01', label: 'Data Ingestion', desc: 'Customer profiles, credit history, financial records', color: '#38BDF8', icon: '📊' },
              { step: '02', label: 'Feature Engineering', desc: 'DTI ratio, credit utilization, payment velocity', color: '#A78BFA', icon: '⚙' },
              { step: '03', label: 'AI Model (XGBoost)', desc: 'Gradient boosted ensemble with 94.2% accuracy', color: '#4ADE80', icon: '🧠' },
              { step: '04', label: 'SHAP Analysis', desc: 'Shapley values for each feature contribution', color: '#FBBF24', icon: '📈' },
              { step: '05', label: 'Decision Output', desc: 'Approved/Rejected with full explanation report', color: '#F87171', icon: '✓' },
            ].map((step, idx, arr) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
                <div style={{
                  flex: 1,
                  background: `${step.color}08`,
                  border: `1px solid ${step.color}25`,
                  borderRadius: '12px',
                  padding: '18px',
                  textAlign: 'center',
                  position: 'relative',
                }}>
                  <div style={{ fontSize: '22px', marginBottom: '8px' }}>{step.icon}</div>
                  <div style={{ fontSize: '9px', color: step.color, fontWeight: 700, letterSpacing: '0.1em', marginBottom: '4px' }}>STEP {step.step}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#F0F9FF', marginBottom: '6px' }}>{step.label}</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8', lineHeight: 1.4 }}>{step.desc}</div>
                </div>
                {idx < arr.length - 1 && (
                  <div style={{
                    width: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38BDF8',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
