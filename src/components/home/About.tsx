export default function About() {
  return (
    <section id="about" aria-label="About breathEN">
      <div className="about-inner">
        <div className="about-left">
          <span className="section-label">About Us</span>
          <h2 className="about-headline">
            We Built breath<span style={{ color: 'var(--red)' }}>EN</span>
            <br />
            Because the Air
            <br />
            <em>Stopped Being Enough.</em>
          </h2>
          <div className="about-body">
            <p>
              Polluted air. Relentless stress. Daily exertion. These quiet forces drain our energy, focus, and
              productivity — and we barely realise it until our bodies begin to struggle.
            </p>
            <p>
              This is felt when we are in closed offices for a long time, travelling in packed air-conditioned cars,
              walking on polluted streets where breathing suffocates.
            </p>
            <p>
              So should we escape city life? Abandon our work, our ambitions, our responsibilities? <strong>No.</strong>
            </p>
            <p>
              Because when breathing naturally becomes difficult, breathEN is here to help you. breathEN is not a
              replacement for nature — it is a companion, designed to assist the body with comfortable breaths.
            </p>
            <p>The danger today is invisible — and invisible enemies are the hardest to beat.</p>
            <p>
              At breathEN, we believe in a simple truth:{' '}
              <strong>You don&apos;t need to be superhuman. You just want to feel well enough to show up.</strong>
            </p>
          </div>
          <p className="about-tagline">&ldquo;Breathe better, live Smarter. #breathEN&rdquo;</p>
        </div>
        <div className="about-right">
          <div className="about-stats">
            <div className="about-stat">
              <span className="about-stat-upto">&nbsp;</span>
              <span className="about-stat-val" data-target="99" data-suffix="%">
                0%
              </span>
              <span className="about-stat-lbl">Pure Oxygen</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-upto">Upto</span>
              <span className="about-stat-val" data-target="200" data-suffix="">
                0
              </span>
              <span className="about-stat-lbl">Shots per Can</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-upto">&nbsp;</span>
              <span className="about-stat-val" data-target="0" data-suffix="">
                0
              </span>
              <span className="about-stat-lbl">Side Effects</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
