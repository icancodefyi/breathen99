import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '@/components/admin/admin.module.css';
import LogoutButton from '@/components/admin/LogoutButton';
import { isAdminAuthenticated } from '@/server/services/admin-auth';

export const metadata: Metadata = {
  title: 'Admin — breathEN',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthenticated();
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link href="/admin" className={styles.brand}>
          breath<span>EN</span> admin
        </Link>
        {authed && <LogoutButton />}
      </header>
      {children}
    </div>
  );
}
