'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password) {
      setError('Enter the administrator password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? 'Authentication failed. Please try again.');
        setPassword('');
        setLoading(false);
        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setError('Unable to reach the authentication service.');
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-160px',
          left: '-120px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.14), transparent 70%)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-180px',
          right: '-140px',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.14), transparent 70%)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '430px',
          padding: '40px 36px 32px',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 30px 80px rgba(2, 8, 23, 0.65), 0 0 40px rgba(56, 189, 248, 0.08)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              boxShadow: '0 0 32px rgba(56, 189, 248, 0.35)',
            }}
          >
            🧠
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: '#38BDF8',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '999px',
              padding: '5px 12px',
              marginBottom: '14px',
            }}
          >
            <ShieldCheck size={12} />
            ADMINISTRATOR ACCESS
          </div>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #F0F9FF, #38BDF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.15,
            }}
          >
            Secure Sign In
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '8px', lineHeight: 1.5 }}>
            Enter the administrator password to access the XAI Banking decision platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="admin-password"
            style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              color: '#94A3B8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Administrator Password
          </label>

          <div style={{ position: 'relative', marginBottom: error ? '14px' : '20px' }}>
            <Lock
              size={16}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#475569',
                pointerEvents: 'none',
              }}
            />
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError('');
              }}
              placeholder="••••••••••••"
              autoComplete="current-password"
              autoFocus
              className="xai-input"
              style={{ paddingLeft: '42px', paddingRight: '46px', height: '46px' }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'login-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '6px',
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div
              id="login-error"
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(248, 113, 113, 0.08)',
                border: '1px solid rgba(248, 113, 113, 0.3)',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '18px',
                fontSize: '12px',
                color: '#F87171',
              }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'Verifying…' : 'Access Platform'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div
          style={{
            marginTop: '26px',
            paddingTop: '18px',
            borderTop: '1px solid rgba(56, 189, 248, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#4ADE80',
              boxShadow: '0 0 8px rgba(74, 222, 128, 0.7)',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '10px', color: '#475569', lineHeight: 1.4 }}>
            Authorized personnel only. All access attempts are logged and monitored.
          </span>
        </div>
      </div>
    </div>
  );
}
