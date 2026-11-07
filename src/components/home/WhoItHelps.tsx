import Image from 'next/image';
import { whyCards, whyBenefits } from '@/content/home';

export default function WhoItHelps() {
  return (
    <section id="why" aria-label="Who breathEN helps">
      <div className="why-header">
        <span className="section-label" style={{ opacity: 1, textAlign: 'center', display: 'block' }}>
          Who breathEN Helps
        </span>
        <h2 className="why-title">
          One Product.
          <br />
          <em>Five Real Needs.</em>
        </h2>
        <p className="why-sub">
          Whether you&apos;re ascending a mountain, managing a deadline, or supporting an elderly parent — breathEN
          delivers 99% pure oxygen when your body needs it most.
        </p>
      </div>
      <div className="why-grid">
        {whyCards.map((c) => (
          <div key={c.num} className="why-card">
            <span className="why-card-num">{c.num}</span>
            <Image
              src={`/assets/${c.img}`}
              className="why-card-img"
              alt={c.title}
              width={400}
              height={280}
              loading="lazy"
            />
            <div className="why-card-body">
              <span className="why-card-icon">{c.icon}</span>
              <span className="why-card-title">{c.title}</span>
              <p className="why-card-desc">{c.desc}</p>
              <ul className="why-card-list">
                {c.list.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
            <div className="why-card-line" />
          </div>
        ))}
      </div>

      {/* Photo strip */}
      <div className="who-helps-photo-strip">
        <div className="who-photo-side">
          <Image src="/assets/person-using.jpg" alt="Person using breathEN" width={480} height={600} loading="lazy" />
          <div className="who-photo-caption">breathEN — 99% Pure Recreational Oxygen</div>
        </div>
        <div className="who-role-side">
          <h3>
            ONE CANISTER.
            <br />
            FIVE LIVES.
          </h3>
          <p className="who-role-tagline">
            breathEN is not a medical device — it is a companion designed to give your body comfortable breaths when the
            air around you simply isn&apos;t enough.
          </p>
          <div className="who-benefits-grid">
            {whyBenefits.map((b) => (
              <div key={b} className="who-benefit-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  opacity={0.7}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="who-benefit-text">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
