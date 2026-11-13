export default function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow">Citizen feedback service</p>
          <h1 id="hero-title">Your feedback helps improve public services</h1>
          <p className="lead">
            Tell us about your experience with a public service. Our feedback form works with a keyboard, a screen
            reader and on any screen size.
          </p>
          <div className="button-row">
            <a className="btn btn--gold" href="#feedback">
              Give feedback
            </a>
            <a className="btn btn--outline" href="#services">
              Explore services
            </a>
          </div>
        </div>
        <svg className="hero-art" viewBox="0 0 320 220" role="img" aria-labelledby="hero-art-title">
          <title id="hero-art-title">
            Illustration of a sealed envelope with a gold check mark, representing a feedback message that was received
          </title>
          <rect x="20" y="30" width="280" height="160" rx="16" fill="#ffffff" />
          <path d="m20 46 140 82 140-82" fill="none" stroke="#13315c" strokeWidth="8" strokeLinejoin="round" />
          <circle cx="244" cy="166" r="34" fill="#d4a937" />
          <path d="m228 166 12 12 22-26" fill="none" stroke="#0b2545" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
