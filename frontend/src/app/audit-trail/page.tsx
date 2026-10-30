'use client';

import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

const auditLogs = [
  {
    id: 'AUD-20241030-0842',
    timestamp: '2026-10-30 10:42:18',
    transactionId: 'TXN-00842',
    customer: 'Amara Osei',
    loanType: 'Mortgage',
    amount: '₦285,000,000',
    decision: 'APPROVED',
    confidence: 94,
    modelVersion: 'XGB-v3.2.1',
    explainabilityMethod: 'SHAP',
    reviewedBy: 'System',
    shapTopFeature: 'Credit Score (742): +0.38',
    riskScore: 18,
    complianceFlags: [],
    processingMs: 142,
  },
  {
    id: 'AUD-20241030-0841',
    timestamp: '2026-10-30 10:35:07',
    transactionId: 'TXN-00841',
    customer: 'David Chen',
    loanType: 'Business Credit',
    amount: '₦50,000,000',
    decision: 'REVIEW',
    confidence: 61,
    modelVersion: 'XGB-v3.2.1',
    explainabilityMethod: 'SHAP+LIME',
    reviewedBy: 'Officer K. Williams',
    shapTopFeature: 'DTI Ratio (47.8%): -0.29',
    riskScore: 58,
    complianceFlags: ['MANUAL_REVIEW_REQUIRED'],
    processingMs: 188,
  },
  {
    id: 'AUD-20241030-0840',
    timestamp: '2026-10-30 10:27:45',
    transactionId: 'TXN-00840',
    customer: 'Fatima Al-Rashid',
    loanType: 'Personal Loan',
    amount: '₦12,500,000',
    decision: 'REJECTED',
    confidence: 88,
    modelVersion: 'XGB-v3.2.1',
    explainabilityMethod: 'SHAP',
    reviewedBy: 'System',
    shapTopFeature: 'Credit Score (478): -0.42',
    riskScore: 82,
    complianceFlags: ['HIGH_RISK', 'CREDIT_SCORE_BELOW_THRESHOLD'],
    processingMs: 134,
  },
  {
    id: 'AUD-20241030-0839',
    timestamp: '2026-10-30 10:19:22',
    transactionId: 'TXN-00839',
    customer: 'James Okonkwo',
    loanType: 'Auto Loan',
    amount: '₦32,000,000',
    decision: 'APPROVED',
    confidence: 91,
    modelVersion: 'XGB-v3.2.1',
    explainabilityMethod: 'SHAP',
    reviewedBy: 'System',
    shapTopFeature: 'Credit Score (711): +0.31',
    riskScore: 22,
    complianceFlags: [],
    processingMs: 119,
  },
  {
    id: 'AUD-20241030-0838',
    timestamp: '2026-10-30 10:11:09',
    transactionId: 'TXN-00838',
    customer: 'Priya Sharma',
    loanType: 'Mortgage',
    amount: '₦195,000,000',
    decision: 'APPROVED',
    confidence: 78,
    modelVersion: 'XGB-v3.2.1',
    explainabilityMethod: 'SHAP+LIME',
    reviewedBy: 'System',
    shapTopFeature: 'Payment History: +0.18',
    riskScore: 35,
    complianceFlags: [],
    processingMs: 167,
  },
];

const complianceStats = [
  { label: 'GDPR Article 22', desc: 'Right to explanation', status: 'Compliant', color: '#4ADE80' },
  { label: 'EU AI Act', desc: 'High-risk AI documentation', status: 'Compliant', color: '#4ADE80' },
  { label: 'ECOA / Fair Credit', desc: 'Equal credit opportunity', status: 'Compliant', color: '#4ADE80' },
  { label: 'Basel III', desc: 'Credit risk framework', status: 'Compliant', color: '#4ADE80' },
  { label: 'FCRA', desc: 'Consumer reporting accuracy', status: 'Review', color: '#FBBF24' },
];

export default function AuditTrailPage() {
  const [filter, setFilter] = useState('ALL');
  const filtered = auditLogs.filter(l => filter === 'ALL' || l.decision === filter);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px', minHeight: '100vh' }}>

        <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{
              fontSize: '28px', fontWeight: 900, letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #F0F9FF, #FBBF24)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Decision Audit Trail</h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
              Immutable log of all AI decisions with full explainability records and compliance status
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" style={{ fontSize: '12px', padding: '8px 16px' }}>
              📥 Export CSV
            </button>
            <button className="btn-secondary" style={{ fontSize: '12px', padding: '8px 16px' }}>
              📄 Generate Report
            </button>
          </div>
        </div>

        {/* Compliance status */}
        <div style={{
          background: 'rgba(13,31,60,0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(74,222,128,0.2)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          gap: '0',
          alignItems: 'stretch',
        }}>
          <div style={{ marginRight: '24px', paddingRight: '24px', borderRight: '1px solid rgba(56,189,248,0.1)' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Compliance Status</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#4ADE80' }}>✓ 4/5 Passed</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flex: 1, alignItems: 'center' }}>
            {complianceStats.map((c, i) => (
              <div key={i} style={{
                flex: 1,
                background: `${c.color}08`,
                border: `1px solid ${c.color}25`,
                borderRadius: '10px',
                padding: '10px 12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: c.color, marginBottom: '2px' }}>{c.status}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#F0F9FF' }}>{c.label}</div>
                <div style={{ fontSize: '9px', color: '#94A3B8' }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['ALL', 'APPROVED', 'REJECTED', 'REVIEW'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: `1px solid ${filter === f ? 'rgba(56,189,248,0.5)' : 'rgba(56,189,248,0.15)'}`,
                background: filter === f ? 'rgba(56,189,248,0.15)' : 'transparent',
                color: filter === f ? '#38BDF8' : '#94A3B8',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {f} {f !== 'ALL' && `(${auditLogs.filter(l => l.decision === f).length})`}
            </button>
          ))}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>Search:</span>
            <input className="xai-input" style={{ width: '200px', padding: '6px 12px', fontSize: '12px' }} placeholder="Customer name, ID..." />
          </div>
        </div>

        {/* Audit log entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((log, idx) => {
            const statusColor = log.decision === 'APPROVED' ? '#4ADE80' : log.decision === 'REJECTED' ? '#F87171' : '#FBBF24';

            return (
              <div key={idx} style={{
                background: 'rgba(13,31,60,0.6)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${statusColor}20`,
                borderRadius: '14px',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '14px 20px',
                  display: 'grid',
                  gridTemplateColumns: '220px 1fr 140px 120px 120px 120px 100px',
                  gap: '12px',
                  alignItems: 'center',
                  borderBottom: `1px solid ${statusColor}10`,
                }}>
                  {/* Timestamp + ID */}
                  <div>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#38BDF8' }}>{log.id}</div>
                    <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px' }}>{log.timestamp}</div>
                  </div>

                  {/* Customer */}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#F0F9FF' }}>{log.customer}</div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>{log.loanType} · {log.amount}</div>
                  </div>

                  {/* Decision */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{
                      fontSize: '10px', fontWeight: 700,
                      color: statusColor,
                      background: `${statusColor}12`,
                      border: `1px solid ${statusColor}35`,
                      borderRadius: '4px',
                      padding: '4px 10px',
                      letterSpacing: '0.06em',
                    }}>{log.decision}</span>
                  </div>

                  {/* Confidence */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: statusColor, fontFamily: 'monospace' }}>{log.confidence}%</div>
                    <div style={{ fontSize: '9px', color: '#94A3B8' }}>Confidence</div>
                  </div>

                  {/* Risk */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: log.riskScore < 33 ? '#4ADE80' : log.riskScore < 66 ? '#FBBF24' : '#F87171', fontFamily: 'monospace' }}>{log.riskScore}</div>
                    <div style={{ fontSize: '9px', color: '#94A3B8' }}>Risk Score</div>
                  </div>

                  {/* XAI Method */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#A78BFA' }}>{log.explainabilityMethod}</div>
                    <div style={{ fontSize: '9px', color: '#94A3B8' }}>{log.modelVersion}</div>
                  </div>

                  {/* Processing time */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#38BDF8', fontFamily: 'monospace' }}>{log.processingMs}ms</div>
                    <div style={{ fontSize: '9px', color: '#94A3B8' }}>Processing</div>
                  </div>
                </div>

                {/* Details row */}
                <div style={{
                  padding: '10px 20px',
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center',
                  fontSize: '11px',
                  color: '#94A3B8',
                }}>
                  <div>
                    <span style={{ color: '#475569' }}>Top SHAP Factor: </span>
                    <span style={{ color: '#F0F9FF', fontFamily: 'monospace' }}>{log.shapTopFeature}</span>
                  </div>
                  <div>
                    <span style={{ color: '#475569' }}>Reviewed By: </span>
                    <span style={{ color: '#F0F9FF' }}>{log.reviewedBy}</span>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                    {log.complianceFlags.length === 0 ? (
                      <span style={{ fontSize: '9px', color: '#4ADE80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '3px', padding: '2px 6px' }}>
                        ✓ NO FLAGS
                      </span>
                    ) : (
                      log.complianceFlags.map((flag, fi) => (
                        <span key={fi} style={{ fontSize: '9px', color: '#FBBF24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '3px', padding: '2px 6px' }}>
                          ⚠ {flag.replace(/_/g, ' ')}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(13,31,60,0.4)',
          borderRadius: '10px',
          border: '1px solid rgba(56,189,248,0.08)',
        }}>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>Showing {filtered.length} of 1,247 records</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['← Prev', '1', '2', '3', '...', '124', 'Next →'].map((p, i) => (
              <button key={i} style={{
                padding: '6px 10px',
                fontSize: '12px',
                border: `1px solid ${p === '1' ? 'rgba(56,189,248,0.5)' : 'rgba(56,189,248,0.15)'}`,
                background: p === '1' ? 'rgba(56,189,248,0.15)' : 'transparent',
                color: p === '1' ? '#38BDF8' : '#94A3B8',
                borderRadius: '6px',
                cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
