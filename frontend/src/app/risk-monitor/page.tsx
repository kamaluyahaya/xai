'use client';

import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';

const riskCategories = [
  { name: 'Credit Risk', score: 42, trend: -3.2, alerts: 12, color: '#38BDF8' },
  { name: 'Market Risk', score: 67, trend: +5.8, alerts: 28, color: '#FBBF24' },
  { name: 'Operational Risk', score: 28, trend: -1.1, alerts: 5, color: '#4ADE80' },
  { name: 'Liquidity Risk', score: 55, trend: +2.3, alerts: 18, color: '#A78BFA' },
];

const riskAlerts = [
  { severity: 'CRITICAL', type: 'Portfolio Concentration', message: 'Real estate loan concentration exceeds 35% threshold (currently 38.2%)', time: '14:23', id: 'ALT-001' },
  { severity: 'HIGH', type: 'Credit Score Drift', message: 'Average applicant credit score declined 18 points vs 90-day baseline', time: '13:47', id: 'ALT-002' },
  { severity: 'HIGH', type: 'DTI Threshold Breach', message: '12 new applications with DTI > 50% in past hour (threshold: 5)', time: '12:55', id: 'ALT-003' },
  { severity: 'MEDIUM', type: 'Model Drift Detected', message: 'XGBoost prediction confidence degraded 2.3% from calibration baseline', time: '11:30', id: 'ALT-004' },
  { severity: 'MEDIUM', type: 'Geographic Cluster', message: 'Unusual loan request spike from Lagos region (+127% vs baseline)', time: '10:14', id: 'ALT-005' },
  { severity: 'LOW', type: 'Batch Processing Delay', message: 'End-of-day report processing running 8 minutes behind schedule', time: '09:45', id: 'ALT-006' },
];

const loanTypes = [
  { type: 'Mortgage', count: 412, approved: 298, rejected: 78, review: 36, avgScore: 706, avgDTI: 35.2 },
  { type: 'Auto Loan', count: 287, approved: 221, rejected: 42, review: 24, avgScore: 692, avgDTI: 31.8 },
  { type: 'Business', count: 198, approved: 112, rejected: 61, review: 25, avgScore: 668, avgDTI: 43.1 },
  { type: 'Personal', count: 244, approved: 148, rejected: 72, review: 24, avgScore: 641, avgDTI: 44.7 },
  { type: 'Education', count: 106, approved: 89, rejected: 11, review: 6, avgScore: 714, avgDTI: 28.4 },
];

// Simulated real-time sparkline data
const generateSparkline = (base: number) =>
  Array.from({ length: 24 }, (_, i) => base + Math.sin(i / 3) * 8 + (Math.random() - 0.5) * 6);

export default function RiskMonitorPage() {
  const [liveRisk, setLiveRisk] = useState(42);
  const [sparklines] = useState(() => ({
    credit: generateSparkline(42),
    market: generateSparkline(67),
    operational: generateSparkline(28),
    liquidity: generateSparkline(55),
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveRisk(prev => Math.max(20, Math.min(80, prev + (Math.random() - 0.5) * 4)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const renderSparkline = (data: number[], color: string) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = 120, h = 36;
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
        {/* Fill */}
        <polyline points={`0,${h} ${points} ${w},${h}`} fill={`${color}15`} />
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px', minHeight: '100vh' }}>

        <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F87171', boxShadow: '0 0 8px rgba(248,113,113,0.8)', animation: 'pulse-glow 1.5s ease infinite' }} />
              <span style={{ fontSize: '11px', color: '#F87171', fontWeight: 600, letterSpacing: '0.1em' }}>LIVE MONITORING</span>
            </div>
            <h1 style={{
              fontSize: '28px', fontWeight: 900, letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #F0F9FF, #F87171)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Risk Monitor</h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
              Real-time XAI-powered risk monitoring with automated alerts and portfolio analytics
            </p>
          </div>
          <div style={{
            textAlign: 'center',
            background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: '12px',
            padding: '16px 24px',
          }}>
            <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Live Portfolio Risk</div>
            <div style={{ fontSize: '40px', fontWeight: 900, color: liveRisk > 60 ? '#F87171' : liveRisk > 40 ? '#FBBF24' : '#4ADE80', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
              {liveRisk.toFixed(1)}
            </div>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>/ 100 risk index</div>
          </div>
        </div>

        {/* Risk category cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {riskCategories.map((rc, idx) => {
            const sparklineKey = ['credit', 'market', 'operational', 'liquidity'][idx] as keyof typeof sparklines;
            return (
              <div key={idx} style={{
                background: 'rgba(13,31,60,0.6)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${rc.color}25`,
                borderRadius: '14px',
                padding: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{rc.name}</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: rc.score > 60 ? '#F87171' : rc.score > 40 ? '#FBBF24' : '#4ADE80', fontFamily: 'monospace' }}>{rc.score}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: rc.trend > 0 ? '#F87171' : '#4ADE80', marginBottom: '4px' }}>
                      {rc.trend > 0 ? '↑' : '↓'} {Math.abs(rc.trend).toFixed(1)}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>{rc.alerts} alerts</div>
                  </div>
                </div>
                {renderSparkline(sparklines[sparklineKey], rc.color)}
                <div style={{ height: '3px', background: 'rgba(56,189,248,0.08)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${rc.score}%`, background: rc.score > 60 ? '#F87171' : rc.score > 40 ? '#FBBF24' : '#4ADE80', borderRadius: '2px' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', marginBottom: '24px' }}>

          {/* Active Alerts */}
          <div style={{
            background: 'rgba(13,31,60,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid rgba(248,113,113,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF' }}>Active Risk Alerts</h2>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#F87171', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '20px', padding: '3px 10px' }}>
                6 Active
              </span>
            </div>

            <div style={{ padding: '16px' }}>
              {riskAlerts.map((alert, idx) => {
                const severityColor = alert.severity === 'CRITICAL' ? '#F87171' : alert.severity === 'HIGH' ? '#FBBF24' : alert.severity === 'MEDIUM' ? '#38BDF8' : '#94A3B8';
                return (
                  <div key={idx} style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 1fr 60px',
                    gap: '12px',
                    alignItems: 'flex-start',
                    padding: '12px 0',
                    borderBottom: idx < riskAlerts.length - 1 ? '1px solid rgba(56,189,248,0.06)' : 'none',
                  }}>
                    <div>
                      <span style={{
                        fontSize: '9px', fontWeight: 800,
                        color: severityColor,
                        background: `${severityColor}12`,
                        border: `1px solid ${severityColor}35`,
                        borderRadius: '3px',
                        padding: '2px 6px',
                        letterSpacing: '0.06em',
                        display: 'inline-block',
                      }}>{alert.severity}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#F0F9FF', marginBottom: '3px' }}>{alert.type}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.4 }}>{alert.message}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '10px', color: '#475569', fontFamily: 'monospace' }}>{alert.time}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(13,31,60,0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(56,189,248,0.15)',
              borderRadius: '14px',
              padding: '20px',
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#F0F9FF', marginBottom: '16px' }}>XAI System Performance</h3>
              {[
                { label: 'Avg Decision Time', value: '148ms', color: '#4ADE80' },
                { label: 'Decisions / Hour', value: '312', color: '#38BDF8' },
                { label: 'SHAP Computations', value: '1,247', color: '#A78BFA' },
                { label: 'Human Overrides', value: '23 (1.8%)', color: '#FBBF24' },
                { label: 'Model Drift Index', value: '0.042', color: '#4ADE80' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 4 ? '1px solid rgba(56,189,248,0.06)' : 'none', fontSize: '12px' }}>
                  <span style={{ color: '#94A3B8' }}>{s.label}</span>
                  <span style={{ color: s.color, fontFamily: 'monospace', fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(13,31,60,0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: '14px',
              padding: '20px',
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#F0F9FF', marginBottom: '16px' }}>Portfolio Health</h3>
              {[
                { label: 'NPL Ratio', value: '2.8%', good: true },
                { label: 'Coverage Ratio', value: '148%', good: true },
                { label: 'Capital Adequacy', value: '14.2%', good: true },
                { label: 'Leverage Ratio', value: '8.7%', good: true },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(56,189,248,0.06)' : 'none', fontSize: '12px' }}>
                  <span style={{ color: '#94A3B8' }}>{s.label}</span>
                  <span style={{ color: s.good ? '#4ADE80' : '#F87171', fontFamily: 'monospace', fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loan Type Breakdown */}
        <div style={{
          background: 'rgba(13,31,60,0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(56,189,248,0.15)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(56,189,248,0.1)' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF' }}>Loan Type Risk Breakdown</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="xai-table">
              <thead>
                <tr>
                  <th>Loan Type</th>
                  <th>Total</th>
                  <th>Approved</th>
                  <th>Rejected</th>
                  <th>Review</th>
                  <th>Approval Rate</th>
                  <th>Avg Credit Score</th>
                  <th>Avg DTI</th>
                  <th>Risk Bar</th>
                </tr>
              </thead>
              <tbody>
                {loanTypes.map((lt, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: '#F0F9FF' }}>{lt.type}</td>
                    <td style={{ fontFamily: 'monospace' }}>{lt.count}</td>
                    <td style={{ color: '#4ADE80', fontFamily: 'monospace' }}>{lt.approved}</td>
                    <td style={{ color: '#F87171', fontFamily: 'monospace' }}>{lt.rejected}</td>
                    <td style={{ color: '#FBBF24', fontFamily: 'monospace' }}>{lt.review}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#4ADE80', fontSize: '12px' }}>
                          {((lt.approved / lt.count) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td style={{
                      fontFamily: 'monospace', fontWeight: 700,
                      color: lt.avgScore >= 700 ? '#4ADE80' : lt.avgScore >= 640 ? '#FBBF24' : '#F87171',
                    }}>{lt.avgScore}</td>
                    <td style={{
                      fontFamily: 'monospace', fontWeight: 700,
                      color: lt.avgDTI < 36 ? '#4ADE80' : lt.avgDTI < 43 ? '#FBBF24' : '#F87171',
                    }}>{lt.avgDTI}%</td>
                    <td>
                      <div style={{ width: '80px', height: '6px', background: 'rgba(56,189,248,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${(lt.rejected / lt.count) * 100 * 3}%`,
                          background: '#F87171',
                          borderRadius: '3px',
                        }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
