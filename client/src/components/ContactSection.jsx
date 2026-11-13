export default function ContactSection() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <h2 id="contact-title">Contact information</h2>
        <p className="section-intro">Demonstration contact details. Replace them with real details before deployment.</p>
        <address className="card contact-card">
          <dl>
            <div>
              <dt>Email</dt>
              <dd>
                <a href="mailto:support@example.org">support@example.org</a>
              </dd>
            </div>
            <div>
              <dt>Helpline</dt>
              <dd>1800-000-0000 (placeholder)</dd>
            </div>
            <div>
              <dt>Office hours</dt>
              <dd>Monday to Friday, 9:00 am to 5:00 pm</dd>
            </div>
            <div>
              <dt>Postal address</dt>
              <dd>Public Service Help Desk, 1 Example Street, Sample City</dd>
            </div>
          </dl>
        </address>
      </div>
    </section>
  );
}
