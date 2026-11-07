/**
 * Page-scoped styles. Injected only while this page is mounted, so the page-level
 * resets below never leak into the landing page.
 */
export const thankYouStyles = `
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--red:#e8260a;--black:#0a0a0a;--white:#ffffff;--gray-200:#e8e8e8;--gray-400:#999;--gray-600:#555;--font-sans:var(--nf-dm-sans),'DM Sans',sans-serif;--font-serif:var(--nf-playfair),'Playfair Display',serif}
        html,body{font-family:var(--font-sans);background:#fafafa;color:var(--black);min-height:100vh}
        .topbar{background:#fff;border-bottom:1px solid var(--gray-200);padding:14px 24px;display:flex;align-items:center;justify-content:center}
        .page{max-width:560px;margin:0 auto;padding:60px 20px 80px;text-align:center}
        .check-circle{width:72px;height:72px;background:var(--red);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 28px}
        .ty-headline{font-family:var(--font-serif);font-size:2rem;font-weight:700;margin-bottom:10px;line-height:1.2}
        .ty-sub{color:var(--gray-600);line-height:1.6;margin-bottom:32px}
        .ty-card{background:#fff;border:1px solid var(--gray-200);border-radius:4px;padding:24px;margin-bottom:28px;text-align:left}
        .ty-card h4{font-weight:600;font-size:.9rem;margin-bottom:14px;text-transform:uppercase;letter-spacing:.06em;font-size:.78rem}
        .ty-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f4f4f4;font-size:.88rem}
        .ty-row:last-child{border:none}
        .ty-row .label{color:var(--gray-400)}
        .ty-pid{font-size:.72rem;color:var(--gray-400);word-break:break-all;margin-top:12px}
        .btn-home{display:inline-block;background:var(--red);color:#fff;text-decoration:none;padding:14px 36px;border-radius:3px;font-size:.88rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;margin-top:8px;transition:background .2s}
        .btn-home:hover{background:#b81d07}
        .whatsapp-note{margin-top:20px;font-size:.82rem;color:var(--gray-600)}
        .whatsapp-note a{color:var(--red);text-decoration:none}
        a:focus-visible{outline:2px solid var(--red);outline-offset:2px}
      `;
