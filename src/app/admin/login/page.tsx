import { redirect } from 'next/navigation';
import styles from '@/components/admin/admin.module.css';
import LoginForm from '@/components/admin/LoginForm';
import { getAdminConfig, isAdminAuthenticated } from '@/server/services/admin-auth';

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect('/admin');
  const configured = Boolean(getAdminConfig());
  return (
    <main className={styles.loginWrap}>
      <h1 className={styles.h1}>Sign in</h1>
      {configured ? (
        <LoginForm />
      ) : (
        <div className={styles.card} role="alert">
          Admin access is not configured. Set <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code> in the
          environment.
        </div>
      )}
    </main>
  );
}
