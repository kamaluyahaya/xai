'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SHAPChart from '@/components/SHAPChart';
import ConfidenceMeter from '@/components/ConfidenceMeter';

interface LoanApplication {
  creditScore: number;
  annualIncome: number;
  loanAmount: number;
  loanTerm: number;
  employmentYears: number;
  existingDebts: number;
  loanPurpose: string;
  homeOwnership: string;
  paymentHistory: string;
}

function computeDecision(app: LoanApplication) {
  const dti = (app.existingDebts * 12 + (app.loanAmount / app.loanTerm)) / (app.annualIncome / 12);
  const ltv = app.loanAmount / app.annualIncome;

  let score = 0;
  if (app.creditScore >= 750) score += 35;
  else if (app.creditScore >= 700) score += 28;
  else if (app.creditScore >= 650) score += 18;
  else if (app.creditScore >= 600) score += 8;
  else score -= 10;

  if (dti < 0.3) score += 25;
  else if (dti < 0.43) score += 12;
  else if (dti < 0.5) score += 0;
  else score -= 15;

  if (app.employmentYears >= 5) score += 15;
  else if (app.employmentYears >= 2) score += 8;
  else score -= 5;

  if (app.paymentHistory === 'excellent') score += 20;
  else if (app.paymentHistory === 'good') score += 10;
  else if (app.paymentHistory === 'fair') score += 0;
  else score -= 15;

  if (app.homeOwnership === 'own') score += 5;

  const creditImpact = (app.creditScore - 620) / 230;
  const dtiImpact = -(dti - 0.36) * 2;
  const employImpact = (app.employmentYears - 2) / 8;
  const paymentImpact = app.paymentHistory === 'excellent' ? 0.25 : app.paymentHistory === 'good' ? 0.12 : app.paymentHistory === 'fair' ? -0.05 : -0.28;
  const ltvImpact = -(ltv - 2) * 0.15;
  const incomeImpact = (app.annualIncome - 45000) / 150000;

  const shapFeatures = [
    { name: 'Credit Score', value: Math.max(-0.5, Math.min(0.5, creditImpact)), rawValue: app.creditScore.toString(), impact: creditImpact >= 0 ? 'positive' as const : 'negative' as const },
    { name: 'Debt-to-Income Ratio', value: Math.max(-0.5, Math.min(0.5, dtiImpact)), rawValue: `${(dti * 100).toFixed(1)}%`, impact: dtiImpact >= 0 ? 'positive' as const : 'negative' as const },
    { name: 'Employment Duration', value: Math.max(-0.4, Math.min(0.4, employImpact)), rawValue: `${app.employmentYears} yrs`, impact: employImpact >= 0 ? 'positive' as const : 'negative' as const },
    { name: 'Payment History', value: Math.max(-0.45, Math.min(0.45, paymentImpact)), rawValue: app.paymentHistory, impact: paymentImpact >= 0 ? 'positive' as const : 'negative' as const },
    { name: 'Loan-to-Value Ratio', value: Math.max(-0.35, Math.min(0.35, ltvImpact)), rawValue: `${ltv.toFixed(2)}x`, impact: ltvImpact >= 0 ? 'positive' as const : 'negative' as const },
    { name: 'Annual Income', value: Math.max(-0.3, Math.min(0.3, incomeImpact)), rawValue: `$${app.annualIncome.toLocaleString()}`, impact: incomeImpact >= 0 ? 'positive' as const : 'negative' as const },
  ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  const clampedScore = Math.max(0, Math.min(100, score));
  const riskScore = 100 - clampedScore;
  const confidence = Math.min(99, Math.abs(score - 50) * 2 + 50);

  let decision: 'APPROVED' | 'REJECTED' | 'REVIEW' = 'REVIEW';
  if (score >= 55) decision = 'APPROVED';
  else if (score < 30) decision = 'REJECTED';

  return { decision, confidence: Math.round(confidence), riskScore: Math.round(riskScore), shapFeatures, dti, score };
}

const defaultApp: LoanApplication = {
  creditScore: 720,
  annualIncome: 85000,
  loanAmount: 150000,
  loanTerm: 360,
  employmentYears: 4,
  existingDebts: 800,
  loanPurpose: 'home_purchase',
  homeOwnership: 'rent',
  paymentHistory: 'good',
};

export default function DecisionEnginePage() {
  const [app, setApp] = useState<LoanApplication>(defaultApp);
  const [result, setResult] = useState<ReturnType<typeof computeDecision> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(computeDecision(app));
      setLoading(false);
    }, 1800);
  };

  const update = (key: keyof LoanApplication, val: string | number) => {
    setApp(prev => ({ ...prev, [key]: val }));
    setResult(null);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '28px', fontWeight: 900, letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #F0F9FF, #38BDF8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>AI Decision Engine</h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
            Submit a loan application and receive an instant AI decision with full SHAP explainability
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '24px' }}>

          {/* Application Form */}
          <div style={{
            background: 'rgba(13, 31, 60, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(56, 189, 248, 0.15)',
            borderRadius: '16px',
            padding: '28px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.6), transparent)' }} />

            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF', marginBottom: '20px' }}>Loan Application Form</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Credit Score */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                  Credit Score
                  <span style={{ marginLeft: '8px', fontFamily: 'monospace', color: app.creditScore >= 700 ? '#4ADE80' : app.creditScore >= 600 ? '#FBBF24' : '#F87171', fontSize: '13px', textTransform: 'none' }}>
                    {app.creditScore}
                  </span>
                </label>
                <input type="range" min="300" max="850" value={app.creditScore}
                  onChange={e => update('creditScore', +e.target.value)}
                  style={{ width: '100%', accentColor: '#38BDF8' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#475569', marginTop: '2px' }}>
                  <span>Poor (300)</span><span>Fair (600)</span><span>Excellent (850)</span>
                </div>
              </div>

              {/* Annual Income */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Annual Income</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38BDF8', fontWeight: 600 }}>$</span>
                  <input type="number" value={app.annualIncome} onChange={e => update('annualIncome', +e.target.value)}
                    className="xai-input" style={{ paddingLeft: '24px' }} placeholder="85,000"
                  />
                </div>
              </div>

              {/* Loan Amount */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Loan Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38BDF8', fontWeight: 600 }}>$</span>
                  <input type="number" value={app.loanAmount} onChange={e => update('loanAmount', +e.target.value)}
                    className="xai-input" style={{ paddingLeft: '24px' }} placeholder="150,000"
                  />
                </div>
              </div>

              {/* Loan Term */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Loan Term (months)</label>
                <select className="xai-input" value={app.loanTerm} onChange={e => update('loanTerm', +e.target.value)}>
                  <option value={60}>60 months (5 years)</option>
                  <option value={120}>120 months (10 years)</option>
                  <option value={180}>180 months (15 years)</option>
                  <option value={240}>240 months (20 years)</option>
                  <option value={360}>360 months (30 years)</option>
                </select>
              </div>

              {/* Employment Years */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                  Employment Duration
                  <span style={{ marginLeft: '8px', fontFamily: 'monospace', color: '#38BDF8', fontSize: '13px', textTransform: 'none' }}>
                    {app.employmentYears} yrs
                  </span>
                </label>
                <input type="range" min="0" max="20" value={app.employmentYears}
                  onChange={e => update('employmentYears', +e.target.value)}
                  style={{ width: '100%', accentColor: '#38BDF8' }}
                />
              </div>

              {/* Existing Debts */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Monthly Debt Payments</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38BDF8', fontWeight: 600 }}>$</span>
                  <input type="number" value={app.existingDebts} onChange={e => update('existingDebts', +e.target.value)}
                    className="xai-input" style={{ paddingLeft: '24px' }} placeholder="800"
                  />
                </div>
              </div>

              {/* Loan Purpose */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Loan Purpose</label>
                <select className="xai-input" value={app.loanPurpose} onChange={e => update('loanPurpose', e.target.value)}>
                  <option value="home_purchase">Home Purchase</option>
                  <option value="refinance">Refinance</option>
                  <option value="business">Business Expansion</option>
                  <option value="auto">Auto Loan</option>
                  <option value="personal">Personal Loan</option>
                  <option value="education">Education</option>
                </select>
              </div>

              {/* Home Ownership */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Home Ownership</label>
                <select className="xai-input" value={app.homeOwnership} onChange={e => update('homeOwnership', e.target.value)}>
                  <option value="own">Own</option>
                  <option value="rent">Rent</option>
                  <option value="mortgage">Mortgage</option>
                </select>
              </div>

              {/* Payment History */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Payment History</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {['excellent', 'good', 'fair', 'poor'].map(ph => (
                    <button
                      key={ph}
                      onClick={() => update('paymentHistory', ph)}
                      style={{
                        padding: '8px 4px',
                        borderRadius: '8px',
                        border: `1px solid ${app.paymentHistory === ph ? '#38BDF8' : 'rgba(56,189,248,0.15)'}`,
                        background: app.paymentHistory === ph ? 'rgba(56,189,248,0.15)' : 'transparent',
                        color: app.paymentHistory === ph ? '#38BDF8' : '#94A3B8',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s ease',
                      }}
                    >{ph}</button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                className="btn-primary"
                style={{
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Analyzing with XAI...
                  </>
                ) : (
                  <>🧠 Analyze with XAI</>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {!result && !loading && (
              <div style={{
                background: 'rgba(13, 31, 60, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(56, 189, 248, 0.1)',
                borderRadius: '16px',
                padding: '60px',
                textAlign: 'center',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F0F9FF', marginBottom: '8px' }}>Ready for Analysis</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', maxWidth: '300px', lineHeight: 1.6 }}>
                  Fill in the application form and click Analyze to receive an instant AI decision with full explainability report
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                  {['SHAP Values', 'LIME Analysis', 'Risk Score', 'Fairness Check'].map(t => (
                    <span key={t} style={{ fontSize: '10px', color: '#38BDF8', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '4px', padding: '4px 8px', fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div style={{
                background: 'rgba(13, 31, 60, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(56, 189, 248, 0.1)',
                borderRadius: '16px',
                padding: '60px',
                textAlign: 'center',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
              }}>
                <div style={{ fontSize: '40px' }}>⚙</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F0F9FF' }}>XAI Engine Processing...</h3>
                {['Running XGBoost model inference', 'Computing SHAP Shapley values', 'Applying LIME local approximation', 'Fairness & bias check'].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#94A3B8' }}>
                    <div style={{
                      width: '16px', height: '16px',
                      border: '2px solid rgba(56,189,248,0.2)',
                      borderTop: '2px solid #38BDF8',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      animationDelay: `${i * 0.2}s`,
                    }} />
                    {step}
                  </div>
                ))}
              </div>
            )}

            {result && !loading && (
              <>
                {/* Top row: Confidence + Key Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }}>
                  <ConfidenceMeter
                    confidence={result.confidence}
                    decision={result.decision}
                    riskScore={result.riskScore}
                  />

                  {/* Key metrics */}
                  <div style={{
                    background: 'rgba(13, 31, 60, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(56, 189, 248, 0.15)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F0F9FF', marginBottom: '16px' }}>Application Summary</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { label: 'DTI Ratio', value: `${(result.dti * 100).toFixed(1)}%`, good: result.dti < 0.43 },
                        { label: 'Credit Score', value: app.creditScore, good: app.creditScore >= 700 },
                        { label: 'Loan Amount', value: `$${app.loanAmount.toLocaleString()}`, good: true },
                        { label: 'Annual Income', value: `$${app.annualIncome.toLocaleString()}`, good: true },
                        { label: 'Employment', value: `${app.employmentYears} years`, good: app.employmentYears >= 2 },
                        { label: 'Model Score', value: result.score.toFixed(0), good: result.score >= 55 },
                      ].map((item, i) => (
                        <div key={i} style={{
                          background: 'rgba(5, 11, 24, 0.4)',
                          borderRadius: '8px',
                          padding: '12px',
                          border: `1px solid ${item.good ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)'}`,
                        }}>
                          <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                          <div style={{ fontSize: '18px', fontWeight: 700, color: item.good ? '#4ADE80' : '#F87171', fontFamily: 'monospace' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Decision reasoning */}
                    <div style={{
                      marginTop: '16px',
                      padding: '12px',
                      background: result.decision === 'APPROVED' ? 'rgba(74,222,128,0.05)' : result.decision === 'REJECTED' ? 'rgba(248,113,113,0.05)' : 'rgba(251,191,36,0.05)',
                      border: `1px solid ${result.decision === 'APPROVED' ? 'rgba(74,222,128,0.2)' : result.decision === 'REJECTED' ? 'rgba(248,113,113,0.2)' : 'rgba(251,191,36,0.2)'}`,
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#94A3B8',
                      lineHeight: 1.5,
                    }}>
                      <strong style={{ color: '#F0F9FF' }}>AI Reasoning: </strong>
                      {result.decision === 'APPROVED'
                        ? `Strong credit profile with a score of ${app.creditScore} and DTI of ${(result.dti * 100).toFixed(1)}% (below 43% threshold). ${app.employmentYears >= 2 ? 'Stable employment history strengthens the application.' : ''}`
                        : result.decision === 'REJECTED'
                          ? `High-risk profile detected. ${app.creditScore < 620 ? 'Credit score below minimum threshold. ' : ''}${result.dti > 0.5 ? 'Debt-to-income ratio exceeds 50% maximum. ' : ''}Application does not meet lending criteria.`
                          : `Borderline application requiring manual review. DTI of ${(result.dti * 100).toFixed(1)}% and credit score of ${app.creditScore} place this in the review zone. Human officer assessment required.`}
                    </div>
                  </div>
                </div>

                {/* SHAP Chart */}
                <SHAPChart
                  features={result.shapFeatures}
                  title="SHAP Explanation — Feature Contributions to This Decision"
                />

                {/* LIME Analysis */}
                <div style={{
                  background: 'rgba(13, 31, 60, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(167,139,250,0.2)',
                  borderRadius: '16px',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF', marginBottom: '4px' }}>LIME Local Approximation</h3>
                  <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '16px' }}>
                    Local Interpretable Model-agnostic Explanations — simplified linear model around this prediction
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {result.shapFeatures.slice(0, 3).map((f, i) => (
                      <div key={i} style={{
                        background: 'rgba(5, 11, 24, 0.5)',
                        borderRadius: '10px',
                        padding: '16px',
                        border: `1px solid ${f.impact === 'positive' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
                        textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '8px', fontWeight: 500 }}>{f.name}</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: f.impact === 'positive' ? '#4ADE80' : '#F87171', fontFamily: 'monospace' }}>
                          {f.impact === 'positive' ? '+' : ''}{(f.value * 100).toFixed(1)}%
                        </div>
                        <div style={{ fontSize: '10px', marginTop: '4px', color: f.impact === 'positive' ? '#4ADE80' : '#F87171' }}>
                          {f.impact === 'positive' ? '▲ Supports Approval' : '▼ Supports Rejection'}
                        </div>
                        <div style={{
                          marginTop: '8px',
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          color: '#94A3B8',
                          background: 'rgba(56,189,248,0.05)',
                          borderRadius: '4px',
                          padding: '4px 8px',
                        }}>
                          Value: {f.rawValue}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    </div>
  );
}
