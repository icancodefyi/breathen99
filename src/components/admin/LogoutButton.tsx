'use client';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.btnGhost}`}
      onClick={async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.replace('/admin/login');
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
