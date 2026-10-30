'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '⬡' },
  { href: '/decision-engine', label: 'Decision Engine', icon: '⚙' },
  { href: '/loan-analysis', label: 'Loan Analysis', icon: '◈' },
  { href: '/model-transparency', label: 'Model Transparency', icon: '◎' },
  { href: '/audit-trail', label: 'Audit Trail', icon: '⬢' },
  { href: '/risk-monitor', label: 'Risk Monitor', icon: '◆' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '260px',
        minHeight: '100vh',
        background: 'rgba(10, 22, 40, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(56, 189, 248, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(56, 189, 248, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0,
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)',
        }}>🧠</div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0F9FF', letterSpacing: '-0.02em' }}>XAI Banking</div>
            <div style={{ fontSize: '10px', color: '#38BDF8', letterSpacing: '0.1em', fontWeight: 500 }}>EXPLAINABLE AI</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 12px',
                borderRadius: '10px',
                marginBottom: '4px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#38BDF8' : '#94A3B8',
                background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid #38BDF8' : '3px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '16px', flexShrink: 0, width: '20px', textAlign: 'center' }}>{item.icon}</span>
              {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Status indicator */}
      {!collapsed && (
        <div style={{
          margin: '12px',
          padding: '12px',
          background: 'rgba(74, 222, 128, 0.05)',
          border: '1px solid rgba(74, 222, 128, 0.2)',
          borderRadius: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#4ADE80',
              boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 600 }}>SYSTEM ACTIVE</span>
          </div>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>AI Model v3.2.1</div>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>XGBoost + SHAP Engine</div>
        </div>
      )}

      {/* User */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(56, 189, 248, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #38BDF8, #6366F1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          fontWeight: 700,
          flexShrink: 0,
        }}>RA</div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#F0F9FF' }}>Risk Analyst</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Senior Officer</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out"
          style={{
            marginLeft: collapsed ? 0 : 'auto',
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '8px',
            flexShrink: 0,
            transition: 'color 0.2s ease, background 0.2s ease',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.color = '#F87171';
            event.currentTarget.style.background = 'rgba(248, 113, 113, 0.1)';
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.color = '#94A3B8';
            event.currentTarget.style.background = 'none';
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
