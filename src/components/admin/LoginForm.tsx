'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace('/admin');
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(res.status === 429 ? 'Too many attempts. Please wait a few minutes.' : data.error || 'Sign-in failed.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.card}>
      <label className={styles.field} htmlFor="admin-password">
        Password
        <input
          id="admin-password"
          type="password"
          className={styles.input}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
        />
      </label>
      <div style={{ marginTop: 14 }}>
        <button type="submit" className={`${styles.btn} ${styles.btnRed}`} disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </div>
      <div role="alert" className={styles.error}>
        {error}
      </div>
    </form>
  );
}
