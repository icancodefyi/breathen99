import { quoteMarquee } from '@/content/home';

export default function QuoteMarquee() {
  return (
    <div
      className="marquee-wrap"
      style={{
        background: '#f5f5f5',
        borderTop: '1px solid rgba(0,0,0,.07)',
        borderBottom: '1px solid rgba(0,0,0,.07)',
      }}
    >
      <div className="marquee-track" style={{ animationDuration: '26s', color: 'rgba(26,26,26,.5)' }}>
        {quoteMarquee.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
