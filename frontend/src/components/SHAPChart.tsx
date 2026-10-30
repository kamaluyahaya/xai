'use client';

import { useEffect, useRef } from 'react';

interface SHAPFeature {
  name: string;
  value: number; // -1 to 1 range
  rawValue: string;
  impact: 'positive' | 'negative';
}

interface SHAPChartProps {
  features: SHAPFeature[];
  title?: string;
}

export default function SHAPChart({ features, title = "SHAP Feature Importance" }: SHAPChartProps) {
  const maxVal = Math.max(...features.map(f => Math.abs(f.value)));

  return (
    <div style={{
      background: 'rgba(13, 31, 60, 0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(56, 189, 248, 0.15)',
      borderRadius: '16px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Header glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.6), transparent)',
      }} />

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#F0F9FF', marginBottom: '4px' }}>{title}</h3>
        <p style={{ fontSize: '12px', color: '#94A3B8' }}>
          SHAP (SHapley Additive exPlanations) — contribution of each feature to the AI decision
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#4ADE80' }} />
          Pushes toward Approval
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#F87171' }} />
          Pushes toward Rejection
        </div>
      </div>

      {/* Zero line container */}
      <div style={{ position: 'relative' }}>
        {features.map((feature, idx) => {
          const pct = (Math.abs(feature.value) / maxVal) * 100;
          const isPositive = feature.impact === 'positive';

          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr 80px',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '10px',
              }}
            >
              {/* Feature name */}
              <div style={{
                fontSize: '12px',
                color: '#94A3B8',
                fontWeight: 500,
                textAlign: 'right',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }} title={feature.name}>{feature.name}</div>

              {/* Bar container */}
              <div style={{ position: 'relative', height: '28px', display: 'flex', alignItems: 'center' }}>
                {/* Center line */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '1px',
                  height: '100%',
                  background: 'rgba(56, 189, 248, 0.2)',
                }} />

                {/* Bar */}
                <div
                  style={{
                    position: 'absolute',
                    height: '18px',
                    borderRadius: '4px',
                    transition: 'width 1s ease',
                    ...(isPositive
                      ? {
                          left: '50%',
                          width: `${pct / 2}%`,
                          background: 'linear-gradient(90deg, rgba(74,222,128,0.4), #4ADE80)',
                          boxShadow: '0 0 8px rgba(74, 222, 128, 0.3)',
                        }
                      : {
                          right: `${50}%`,
                          width: `${pct / 2}%`,
                          background: 'linear-gradient(270deg, rgba(248,113,113,0.4), #F87171)',
                          boxShadow: '0 0 8px rgba(248, 113, 113, 0.3)',
                        }),
                  }}
                />
              </div>

              {/* Value */}
              <div style={{
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
                color: isPositive ? '#4ADE80' : '#F87171',
                fontWeight: 600,
              }}>
                {isPositive ? '+' : ''}{feature.value.toFixed(3)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Raw values footer */}
      <div style={{
        marginTop: '20px',
        padding: '12px',
        background: 'rgba(5, 11, 24, 0.6)',
        border: '1px solid rgba(56, 189, 248, 0.1)',
        borderRadius: '8px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        {features.slice(0, 5).map((f, idx) => (
          <div key={idx} style={{
            fontSize: '10px',
            color: '#94A3B8',
            background: 'rgba(56, 189, 248, 0.05)',
            borderRadius: '4px',
            padding: '3px 8px',
          }}>
            <span style={{ color: '#475569' }}>{f.name.split(' ')[0]}: </span>
            <span style={{ color: '#F0F9FF', fontFamily: 'monospace' }}>{f.rawValue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
