import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer>
      <div className="footer-links">
        <a href="#faq">FAQ</a>
        <a href="mailto:info@breathen99.com">Contact</a>
        <a href="https://www.instagram.com/breathen_99" target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/refund-policy">Refunds</Link>
        <Link href="/shipping-policy">Shipping</Link>
      </div>
      <span className="footer-copy">© 2026 breathEN · Recreational Oxygen · Navi Mumbai, India</span>
    </footer>
  );
}
