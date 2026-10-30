'use client';

interface ConfidenceMeterProps {
  confidence: number; // 0-100
  decision: 'APPROVED' | 'REJECTED' | 'REVIEW';
  riskScore: number; // 0-100
}

export default function ConfidenceMeter({ confidence, decision, riskScore }: ConfidenceMeterProps) {
  const decisionColor = decision === 'APPROVED' ? '#4ADE80' : decision === 'REJECTED' ? '#F87171' : '#FBBF24';
  const decisionBg = decision === 'APPROVED' ? 'rgba(74,222,128,0.1)' : decision === 'REJECTED' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)';
  const decisionBorder = decision === 'APPROVED' ? 'rgba(74,222,128,0.3)' : decision === 'REJECTED' ? 'rgba(248,113,113,0.3)' : 'rgba(251,191,36,0.3)';

  // SVG ring
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  const riskLevel = riskScore < 33 ? 'LOW' : riskScore < 66 ? 'MEDIUM' : 'HIGH';
  const riskColor = riskScore < 33 ? '#4ADE80' : riskScore < 66 ? '#FBBF24' : '#F87171';

  return (
    <div style={{
      background: 'rgba(13, 31, 60, 0.6)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(56, 189, 248, 0.15)',
      borderRadius: '16px',
      padding: '28px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${decisionColor}, transparent)`,
      }} />

      <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '24px' }}>
        AI Decision Confidence
      </h3>

      {/* Ring gauge */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* Background ring */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="rgba(56,189,248,0.1)"
            strokeWidth="12"
          />
          {/* Animated progress ring */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={decisionColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 70 70)"
            style={{
              filter: `drop-shadow(0 0 8px ${decisionColor})`,
              transition: 'stroke-dashoffset 1.5s ease',
            }}
          />
          {/* Inner text */}
          <text x="70" y="62" textAnchor="middle" fill={decisionColor} fontSize="24" fontWeight="800" fontFamily="Inter">
            {confidence}%
          </text>
          <text x="70" y="80" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="Inter">
            Confidence
          </text>
        </svg>

        {/* Glow effect under ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${decisionColor}15 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      </div>

      {/* Decision badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 24px',
        borderRadius: '50px',
        background: decisionBg,
        border: `1px solid ${decisionBorder}`,
        marginBottom: '24px',
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: decisionColor,
          boxShadow: `0 0 8px ${decisionColor}`,
        }} />
        <span style={{
          fontSize: '16px',
          fontWeight: 800,
          color: decisionColor,
          letterSpacing: '0.1em',
        }}>{decision}</span>
      </div>

      {/* Risk score bar */}
      <div style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Risk Score</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: riskColor }}>{riskLevel} ({riskScore}/100)</span>
        </div>
        <div style={{
          height: '6px',
          background: 'rgba(56, 189, 248, 0.1)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${riskScore}%`,
            background: `linear-gradient(90deg, #4ADE80, ${riskColor})`,
            borderRadius: '3px',
            boxShadow: `0 0 8px ${riskColor}`,
            transition: 'width 1s ease',
          }} />
        </div>
      </div>

      {/* XAI Method Tag */}
      <div style={{
        marginTop: '16px',
        padding: '8px',
        background: 'rgba(5, 11, 24, 0.4)',
        borderRadius: '8px',
        border: '1px solid rgba(56, 189, 248, 0.08)',
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {['XGBoost', 'SHAP', 'LIME', 'Fairness'].map(tag => (
          <span key={tag} style={{
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: '#38BDF8',
            background: 'rgba(56, 189, 248, 0.08)',
            borderRadius: '3px',
            padding: '2px 6px',
          }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
