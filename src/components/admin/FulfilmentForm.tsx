'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

const OPTIONS = [
  { value: 'new', label: 'New (to ship)' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function FulfilmentForm({ publicId, status, note }: { publicId: string; status: string; note: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [text, setText] = useState(note);
  const [msg, setMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${publicId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value, note: text }),
      });
      if (res.ok) {
        setMsg({ type: 'ok', text: 'Saved.' });
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setMsg({ type: 'error', text: data.error || 'Could not save.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save}>
      <label className={styles.field} htmlFor="fulfil-status">
        Fulfilment status
        <select id="fulfil-status" className={styles.select} value={value} onChange={(e) => setValue(e.target.value)}>
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.field} htmlFor="fulfil-note" style={{ marginTop: 12 }}>
        Note (courier, tracking number, etc.)
        <textarea
          id="fulfil-note"
          className={styles.textarea}
          maxLength={500}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <div style={{ marginTop: 12 }}>
        <button type="submit" className={`${styles.btn} ${styles.btnRed}`} disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </button>
      </div>
      <div role="status" className={msg?.type === 'ok' ? styles.ok : styles.error}>
        {msg?.text}
      </div>
    </form>
  );
}
