import { brandMarquee } from '@/content/home';

export default function BrandMarquee() {
  return (
    <div className="marquee-wrap marquee-dark">
      <div className="marquee-track">
        {brandMarquee.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
