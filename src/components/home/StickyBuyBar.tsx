import Link from 'next/link';

export default function StickyBuyBar() {
  return (
    <div className="sticky-buy-bar">
      <div className="sticky-text">
        <strong>breathEN Oxygen</strong>
        <span className="sticky-mrp">₹900</span> <span className="sticky-sale-price">₹495</span>
      </div>
      <Link href="/checkout" className="sticky-buy-btn">
        Buy Now — ₹495
      </Link>
    </div>
  );
}
