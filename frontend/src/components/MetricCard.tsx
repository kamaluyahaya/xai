'use client';

interface MetricCardProps {
  title: string;
  value: string;
  subtext?: string;
  color?: 'blue' | 'green' | 'red' | 'amber' | 'purple';
  icon: string;
  trend?: { value: string; up: boolean };
  badge?: string;
}

const colorMap = {
  blue: { border: 'rgba(56, 189, 248, 0.3)', glow: 'rgba(56, 189, 248, 0.1)', text: '#38BDF8', bg: 'rgba(56, 189, 248, 0.08)' },
  green: { border: 'rgba(74, 222, 128, 0.3)', glow: 'rgba(74, 222, 128, 0.1)', text: '#4ADE80', bg: 'rgba(74, 222, 128, 0.08)' },
  red: { border: 'rgba(248, 113, 113, 0.3)', glow: 'rgba(248, 113, 113, 0.1)', text: '#F87171', bg: 'rgba(248, 113, 113, 0.08)' },
  amber: { border: 'rgba(251, 191, 36, 0.3)', glow: 'rgba(251, 191, 36, 0.1)', text: '#FBBF24', bg: 'rgba(251, 191, 36, 0.08)' },
  purple: { border: 'rgba(167, 139, 250, 0.3)', glow: 'rgba(167, 139, 250, 0.1)', text: '#A78BFA', bg: 'rgba(167, 139, 250, 0.08)' },
};

export default function MetricCard({ title, value, subtext, color = 'blue', icon, trend, badge }: MetricCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className="metric-card"
      style={{
        background: 'rgba(13, 31, 60, 0.6)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 4px 24px ${colors.glow}`,
      }}
    >
      {/* Top glow line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${colors.text}, transparent)`,
      }} />

      {/* Corner decoration */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '80px',
        height: '80px',
        background: `radial-gradient(circle, ${colors.bg} 0%, transparent 70%)`,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#94A3B8',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}>{title}</div>
          {badge && (
            <span style={{
              fontSize: '9px',
              fontWeight: 700,
              color: colors.text,
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              padding: '2px 6px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>{badge}</span>
          )}
        </div>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}>{icon}</div>
      </div>

      <div style={{
        fontSize: '32px',
        fontWeight: 800,
        color: colors.text,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        marginBottom: '8px',
      }}>{value}</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {subtext && (
          <div style={{ fontSize: '12px', color: '#475569' }}>{subtext}</div>
        )}
        {trend && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 600,
            color: trend.up ? '#4ADE80' : '#F87171',
            background: trend.up ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
            borderRadius: '6px',
            padding: '3px 8px',
          }}>
            <span>{trend.up ? '↑' : '↓'}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
