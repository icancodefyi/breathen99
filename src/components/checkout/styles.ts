/**
 * Page-scoped styles. Injected only while this page is mounted, so the page-level
 * resets below never leak into the landing page.
 */
export const checkoutStyles = `
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--red:#e8260a;--red-dark:#b81d07;--red-light:#fef2f0;--black:#0a0a0a;--white:#ffffff;--gray-50:#fafafa;--gray-100:#f4f4f4;--gray-200:#e8e8e8;--gray-400:#999;--gray-600:#555;--gray-800:#222;--font-sans:var(--nf-dm-sans),'DM Sans',sans-serif;--font-serif:var(--nf-playfair),'Playfair Display',serif;--font-display:var(--nf-bebas),'Bebas Neue',sans-serif}
        html{font-size:16px;scroll-behavior:smooth}
        body{font-family:var(--font-sans);background:var(--gray-50);color:var(--black);min-height:100vh}
        .topbar{background:#fff;border-bottom:1px solid var(--gray-200);padding:14px 24px;display:flex;align-items:center;justify-content:space-between}
        .topbar-back{color:var(--gray-600);text-decoration:none;font-size:13px;display:flex;align-items:center;gap:6px}
        .topbar-back:hover{color:var(--black)}
        .trust-bar{background:var(--red);color:#fff;text-align:center;font-size:12px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;padding:9px 16px}
        .trust-bar span{opacity:.65;margin:0 12px}
        .checkout-wrap{max-width:980px;margin:0 auto;padding:40px 20px 80px;display:grid;grid-template-columns:1fr 400px;gap:32px;align-items:start}
        @media(max-width:760px){.checkout-wrap{grid-template-columns:1fr;padding:24px 16px 80px;gap:24px}}
        .card{background:#fff;border:1px solid var(--gray-200);border-radius:4px;padding:28px}
        .card-title{font-family:var(--font-serif);font-size:1.1rem;margin-bottom:20px;color:var(--black)}
        .section-step{display:flex;align-items:center;gap:12px;margin-bottom:20px}
        .step-num{width:28px;height:28px;background:var(--red);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:600;flex-shrink:0}
        .step-title{font-weight:500;font-size:.95rem}
        .field{margin-bottom:16px}
        .field label{display:block;font-size:.78rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--gray-600);margin-bottom:6px}
        .field input,.field select,.field textarea{width:100%;border:1px solid var(--gray-200);border-radius:3px;padding:11px 14px;font-size:.9rem;font-family:var(--font-sans);background:#fff;color:var(--black);outline:none;transition:border .2s}
        .field input:focus,.field select:focus,.field textarea:focus{border-color:var(--red)}
        .field input.error,.field select.error,.field textarea.error{border-color:#e8260a}
        .field textarea{min-height:80px;resize:vertical}
        .field-error{font-size:.75rem;color:var(--red);margin-top:4px;display:none}
        .field-error.show{display:block}
        .field-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        @media(max-width:480px){.field-row{grid-template-columns:1fr}}
        .qty-wrap{display:flex;align-items:center;gap:0;width:fit-content;border:1px solid var(--gray-200);border-radius:3px;overflow:hidden}
        .qty-btn{width:44px;height:44px;background:#fff;border:none;cursor:pointer;font-size:1.3rem;font-weight:300;color:var(--black);transition:background .15s}
        .qty-btn:hover{background:var(--gray-100)}
        .qty-display{width:56px;height:44px;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:500;border-left:1px solid var(--gray-200);border-right:1px solid var(--gray-200)}
        .bulk-tiers{margin-top:12px;display:flex;flex-direction:column;gap:8px}
        .bulk-tier{display:flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid var(--gray-200);border-radius:3px;font-size:.82rem;transition:border .2s,background .2s}
        .bulk-tier.active{border-color:var(--red);background:var(--red-light)}
        .bulk-tier-badge{font-weight:600;color:var(--red);font-size:.75rem;letter-spacing:.04em;min-width:110px}
        .bulk-tier-label{color:var(--gray-600)}
        .coupon-row{display:flex;gap:10px}
        .coupon-row input{flex:1;border:1px solid var(--gray-200);border-radius:3px;padding:11px 14px;font-size:.9rem;font-family:var(--font-sans);outline:none}
        .coupon-row input:focus{border-color:var(--red)}
        .coupon-apply{background:var(--black);color:#fff;border:none;border-radius:3px;padding:11px 20px;font-size:.82rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:background .2s}
        .coupon-apply:hover{background:#333}
        .coupon-apply:disabled{opacity:.5;cursor:not-allowed}
        .coupon-feedback{margin-top:8px;font-size:.82rem}
        .coupon-feedback.success{color:#1a8a3a}
        .coupon-feedback.error{color:var(--red)}
        .summary-product{display:flex;gap:16px;align-items:flex-start;margin-bottom:20px}
        .summary-product-img{width:70px;height:90px;object-fit:contain;flex-shrink:0;border-radius:3px;border:1px solid var(--gray-200)}
        .summary-product-info{flex:1}
        .summary-product-name{font-weight:500;font-size:.9rem;margin-bottom:3px}
        .summary-product-sub{font-size:.78rem;color:var(--gray-400)}
        .summary-mrp-line{display:flex;gap:8px;align-items:center;margin-top:4px}
        .summary-mrp{text-decoration:line-through;color:var(--gray-400);font-size:.8rem}
        .summary-sale{font-size:.75rem;background:var(--red-light);color:var(--red);padding:1px 6px;border-radius:2px;font-weight:500}
        .summary-product-qty{font-size:.9rem;color:var(--gray-600)}
        .summary-line{display:flex;justify-content:space-between;font-size:.88rem;color:var(--gray-600);padding:8px 0;border-bottom:1px solid var(--gray-100)}
        .summary-line.discount span:last-child,.summary-line.coupon span:last-child{color:#1a8a3a;font-weight:500}
        .summary-divider{border:none;border-top:2px solid var(--gray-200);margin:12px 0}
        .summary-total{display:flex;justify-content:space-between;font-size:1.05rem;font-weight:600;padding:4px 0}
        .summary-total-sub{font-size:.74rem;color:var(--gray-400);text-align:right;margin-bottom:20px}
        .pay-btn{width:100%;background:var(--red);color:#fff;border:none;border-radius:3px;padding:16px;font-size:.95rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:background .2s;min-height:52px}
        .pay-btn:hover{background:var(--red-dark)}
        .pay-btn:disabled{opacity:.6;cursor:not-allowed}
        .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .pay-secure{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:12px;font-size:.74rem;color:var(--gray-400)}
        .mobile-summary-bar{display:none;background:#fff;border-bottom:1px solid var(--gray-200);padding:10px 16px}
        @media(max-width:760px){.mobile-summary-bar{display:block}}
        .msb-row{display:flex;justify-content:space-between;align-items:center;font-size:.86rem}
        .msb-total{font-weight:600}
        .mobile-pay-bar{display:none;position:fixed;bottom:0;left:0;right:0;padding:12px 16px;background:#fff;border-top:1px solid #e8e8e8;z-index:200}
        @media(max-width:760px){.mobile-pay-bar{display:block}}
        .legal-note{margin-top:16px;font-size:.78rem;color:var(--gray-600);line-height:1.5}
        .legal-note a{color:var(--red);text-decoration:underline}
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
        .step-title{font-family:var(--font-sans)}
        .pay-alert{background:#fef2f0;color:#b81d07;border:1px solid #f5c4bc;border-radius:3px;padding:10px 12px;font-size:.82rem;line-height:1.4;margin-bottom:12px}
        .pay-alert--mobile{margin-bottom:8px}
        .qty-btn:disabled{opacity:.35;cursor:not-allowed}
        .coupon-row input:disabled{background:var(--gray-100)}
        button:focus-visible,a:focus-visible,.field input:focus-visible,.field select:focus-visible,.field textarea:focus-visible,.coupon-row input:focus-visible{outline:2px solid var(--red);outline-offset:2px}
      `;
