import Link from 'next/link';

export default function CroStripOne() {
  return (
    <div className="cro-strip">
      <p>Ready to Breathe Better? Order breathEN Today.</p>
      <Link href="/checkout" className="btn-white">
        Get Your Can →
      </Link>
    </div>
  );
}
