'use client';

import Sidebar from '@/components/Sidebar';

const applications = [
  { id: 'LA-2024-001', name: 'Amara Osei', age: 34, income: 92000, creditScore: 742, loanAmount: 285000, purpose: 'Mortgage', dti: 32.4, collateral: 'Property', status: 'APPROVED', confidence: 94, riskScore: 18 },
  { id: 'LA-2024-002', name: 'David Chen', age: 28, income: 65000, creditScore: 589, loanAmount: 50000, purpose: 'Business', dti: 47.8, collateral: 'None', status: 'REVIEW', confidence: 61, riskScore: 58 },
  { id: 'LA-2024-003', name: 'Fatima Al-Rashid', age: 45, income: 48000, creditScore: 478, loanAmount: 12500, purpose: 'Personal', dti: 55.2, collateral: 'None', status: 'REJECTED', confidence: 88, riskScore: 82 },
  { id: 'LA-2024-004', name: 'James Okonkwo', age: 38, income: 110000, creditScore: 711, loanAmount: 32000, purpose: 'Auto', dti: 28.6, collateral: 'Vehicle', status: 'APPROVED', confidence: 91, riskScore: 22 },
  { id: 'LA-2024-005', name: 'Priya Sharma', age: 31, income: 78000, creditScore: 668, loanAmount: 195000, purpose: 'Mortgage', dti: 41.3, collateral: 'Property', status: 'APPROVED', confidence: 78, riskScore: 35 },
  { id: 'LA-2024-006', name: 'Michael Torres', age: 52, income: 145000, creditScore: 801, loanAmount: 500000, purpose: 'Refinance', dti: 22.1, collateral: 'Property', status: 'APPROVED', confidence: 97, riskScore: 8 },
  { id: 'LA-2024-007', name: 'Sarah Müller', age: 25, income: 42000, creditScore: 612, loanAmount: 8000, purpose: 'Education', dti: 38.9, collateral: 'None', status: 'REVIEW', confidence: 54, riskScore: 49 },
];

const shapExplanations: Record<string, { features: { name: string; value: number; impact: string }[]; narrative: string }> = {
  'LA-2024-001': {
    features: [
      { name: 'Credit Score (742)', value: 0.38, impact: 'positive' },
      { name: 'DTI Ratio (32.4%)', value: 0.22, impact: 'positive' },
      { name: 'Employment (7 yrs)', value: 0.14, impact: 'positive' },
      { name: 'Loan-to-Income (3.1x)', value: -0.08, impact: 'negative' },
      { name: 'Payment History (Excellent)', value: 0.18, impact: 'positive' },
    ],
    narrative: 'Strong creditworthiness demonstrated by an above-average credit score of 742, a well-controlled DTI ratio of 32.4%, and 7 years of stable employment. The slightly elevated loan-to-income ratio is offset by excellent payment history and property collateral.',
  },
  'LA-2024-003': {
    features: [
      { name: 'Credit Score (478)', value: -0.42, impact: 'negative' },
      { name: 'DTI Ratio (55.2%)', value: -0.35, impact: 'negative' },
      { name: 'Payment History (Poor)', value: -0.28, impact: 'negative' },
      { name: 'Employment (1 yr)', value: -0.12, impact: 'negative' },
      { name: 'Loan Purpose (Personal)', value: -0.05, impact: 'negative' },
    ],
    narrative: 'Multiple high-risk indicators identified. Credit score of 478 falls below the 580 minimum threshold. DTI ratio of 55.2% significantly exceeds the 43% policy limit. Combined with poor payment history and limited employment, the application presents unacceptable credit risk.',
  },
};

export default function LoanAnalysisPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px', minHeight: '100vh' }}>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '28px', fontWeight: 900, letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #F0F9FF, #4ADE80)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Loan Portfolio Analysis</h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
            Detailed XAI analysis for each loan application with SHAP-driven narratives
          </p>
        </div>

        {/* Summary Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Applications', value: '7', color: '#38BDF8' },
            { label: 'Approved', value: '4 (57.1%)', color: '#4ADE80' },
            { label: 'Under Review', value: '2 (28.6%)', color: '#FBBF24' },
            { label: 'Rejected', value: '1 (14.3%)', color: '#F87171' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(13,31,60,0.6)',
              border: `1px solid ${s.color}25`,
              borderRadius: '12px',
              padding: '16px 20px',
              backdropFilter: 'blur(20px)',
            }}>
              <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, fontFamily: 'monospace' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Application cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {applications.map((app, idx) => {
            const explanation = shapExplanations[app.id];
            const statusColor = app.status === 'APPROVED' ? '#4ADE80' : app.status === 'REJECTED' ? '#F87171' : '#FBBF24';
            const statusBg = app.status === 'APPROVED' ? 'rgba(74,222,128,0.08)' : app.status === 'REJECTED' ? 'rgba(248,113,113,0.08)' : 'rgba(251,191,36,0.08)';

            return (
              <div key={idx} style={{
                background: 'rgba(13,31,60,0.6)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${statusColor}20`,
                borderRadius: '16px',
                overflow: 'hidden',
              }}>
                {/* Header bar */}
                <div style={{
                  background: statusBg,
                  padding: '16px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: `1px solid ${statusColor}15`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: `linear-gradient(135deg, hsl(${idx * 47}, 65%, 40%), hsl(${idx * 47 + 40}, 65%, 30%))`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: 800, color: '#fff',
                    }}>
                      {app.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF' }}>{app.name}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>Age {app.age} • {app.purpose} Loan • {app.id}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Confidence ring */}
                    <div style={{ textAlign: 'center' }}>
                      <svg width="52" height="52" viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(56,189,248,0.1)" strokeWidth="5" />
                        <circle cx="26" cy="26" r="20" fill="none" stroke={statusColor}
                          strokeWidth="5" strokeLinecap="round"
                          strokeDasharray={125.6}
                          strokeDashoffset={125.6 - (app.confidence / 100) * 125.6}
                          transform="rotate(-90 26 26)"
                          style={{ filter: `drop-shadow(0 0 4px ${statusColor})` }}
                        />
                        <text x="26" y="30" textAnchor="middle" fill={statusColor} fontSize="11" fontWeight="800" fontFamily="Inter">{app.confidence}%</text>
                      </svg>
                      <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '2px' }}>Confidence</div>
                    </div>

                    <span style={{
                      padding: '8px 18px',
                      borderRadius: '50px',
                      background: statusBg,
                      border: `1px solid ${statusColor}40`,
                      color: statusColor,
                      fontSize: '12px',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                    }}>{app.status}</span>
                  </div>
                </div>

                {/* Details grid */}
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '20px' }}>
                    {[
                      { label: 'Loan Amount', value: `$${app.loanAmount.toLocaleString()}`, color: '#38BDF8' },
                      { label: 'Annual Income', value: `$${app.income.toLocaleString()}`, color: '#F0F9FF' },
                      { label: 'Credit Score', value: app.creditScore, color: app.creditScore >= 700 ? '#4ADE80' : app.creditScore >= 600 ? '#FBBF24' : '#F87171' },
                      { label: 'DTI Ratio', value: `${app.dti}%`, color: app.dti < 43 ? '#4ADE80' : '#F87171' },
                      { label: 'Collateral', value: app.collateral, color: '#A78BFA' },
                      { label: 'Risk Score', value: `${app.riskScore}/100`, color: app.riskScore < 33 ? '#4ADE80' : app.riskScore < 66 ? '#FBBF24' : '#F87171' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div style={{ fontSize: '9px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{item.label}</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: item.color, fontFamily: 'monospace' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* SHAP mini-chart (if available) */}
                  {explanation && (
                    <div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                        SHAP Feature Impact
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                        {explanation.features.map((f, fi) => {
                          const barPct = Math.abs(f.value) * 80;
                          return (
                            <div key={fi} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 60px', gap: '10px', alignItems: 'center' }}>
                              <div style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'right' }}>{f.name}</div>
                              <div style={{ height: '12px', background: 'rgba(56,189,248,0.06)', borderRadius: '4px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <div style={{ position: 'absolute', left: '50%', width: '1px', height: '100%', background: 'rgba(56,189,248,0.2)' }} />
                                <div style={{
                                  position: 'absolute',
                                  height: '8px', width: `${barPct}%`,
                                  borderRadius: '3px',
                                  ...(f.impact === 'positive'
                                    ? { left: '50%', background: 'linear-gradient(90deg, rgba(74,222,128,0.4), #4ADE80)', boxShadow: '0 0 4px rgba(74,222,128,0.4)' }
                                    : { right: '50%', background: 'linear-gradient(270deg, rgba(248,113,113,0.4), #F87171)', boxShadow: '0 0 4px rgba(248,113,113,0.4)' }),
                                }} />
                              </div>
                              <div style={{ fontSize: '10px', fontFamily: 'monospace', color: f.impact === 'positive' ? '#4ADE80' : '#F87171', fontWeight: 600 }}>
                                {f.impact === 'positive' ? '+' : ''}{(f.value * 100).toFixed(0)}%
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{
                        padding: '12px 16px',
                        background: 'rgba(5,11,24,0.5)',
                        border: '1px solid rgba(56,189,248,0.08)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#94A3B8',
                        lineHeight: 1.6,
                      }}>
                        <strong style={{ color: '#38BDF8' }}>XAI Narrative: </strong>{explanation.narrative}
                      </div>
                    </div>
                  )}

                  {!explanation && (
                    <div style={{
                      padding: '12px 16px',
                      background: 'rgba(5,11,24,0.5)',
                      border: '1px solid rgba(56,189,248,0.08)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#94A3B8',
                    }}>
                      Click on the application to view full SHAP explanation in the Decision Engine →
                      <a href="/decision-engine" style={{ color: '#38BDF8', marginLeft: '6px', textDecoration: 'none' }}>Open Decision Engine</a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
