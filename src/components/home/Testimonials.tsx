export default function Testimonials() {
  return (
    <section id="testimonials" aria-label="Customer testimonials">
      <div className="testimonials-header">
        <span className="section-label" style={{ opacity: 1, textAlign: 'center', display: 'block' }}>
          Real People. Real Breath.
        </span>
        <h2 className="testimonials-title">
          What They Say About <em>breathEN</em>
        </h2>
      </div>
      <div className="testimonials-grid">
        <div
          className="testimonial-card"
          style={{ gridColumn: '1/-1', background: '#fff8f7', border: '1px solid rgba(232,38,10,.08)' }}
        >
          <span className="quote-mark">&ldquo;</span>
          <p className="testimonial-text">Get your breath back almost immediately with breathEN.</p>
          <div className="testimonial-author">
            <span className="author-name">SS Patil</span>
            <span className="author-title">Fire Officer</span>
            <div className="fire-badge">🚒 Verified First Responder</div>
          </div>
        </div>
        <div className="testimonial-card">
          <span className="quote-mark">&ldquo;</span>
          <p className="testimonial-text">
            BreathEN reduces fatigue, gives a quick performance boost, and provides relief from smog and pollution.
            It&apos;s an awesome product and works like magic, totally indispensable.
          </p>
          <div className="testimonial-author">
            <span className="author-name">Imdad Fakhi</span>
            <span className="author-title">breathEN User</span>
          </div>
        </div>
        <div className="testimonial-card">
          <span className="quote-mark">&ldquo;</span>
          <p className="testimonial-text">
            For years, stepping outside felt frightening. My breathing would get heavy, and I avoided walking
            altogether. When my breathing starts to feel difficult, breathEN gives me comfort and support. It helps me
            calm down, breathe easier, and regain confidence to continue.
          </p>
          <div className="testimonial-author">
            <span className="author-name">Rabiya Bi, 68 years</span>
            <span className="author-title">Has Chronic Asthma</span>
          </div>
        </div>
        <div
          className="testimonial-card"
          style={{ gridColumn: '1/-1', background: 'rgba(232,38,10,.04)', border: '1px solid rgba(232,38,10,.12)' }}
        >
          <span className="quote-mark">&ldquo;</span>
          <p className="testimonial-text">
            Hospital visit avoided — just because breathEN supported their breathing immediately after evacuating the
            building. They were able to breathe normally again with only 10–12 shots.
          </p>
          <div className="testimonial-author">
            <span className="author-name">Anonymous Housewife</span>
            <span className="author-title">Fire Incident Evacuee</span>
            <div className="fire-badge">🏥 Hospital Visit Avoided</div>
          </div>
        </div>
      </div>
    </section>
  );
}
