import Link from 'next/link';

export default function CroStripTwo() {
  return (
    <div className="cro-strip">
      <p>Upto 200 Shots. Zero Side Effects. One Deep Breath Away.</p>
      <Link href="/checkout" className="btn-white">
        Order breathEN →
      </Link>
    </div>
  );
}
