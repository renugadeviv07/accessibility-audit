const PRINCIPLES = [
  {
    title: 'Open to everyone',
    text: 'Built with semantic HTML, clear headings and labelled form fields so assistive technology can describe every part of the page.',
  },
  {
    title: 'Works on any device',
    text: 'A responsive layout reflows from phones to wide monitors without horizontal scrolling or hidden content.',
  },
  {
    title: 'Private by design',
    text: 'Feedback is stored securely on the server and is never displayed publicly. Only authorised staff can read it.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section section--alt" aria-labelledby="about-title">
      <div className="container">
        <h2 id="about-title">About the portal</h2>
        <p className="section-intro">
          The Accessible Public Service Portal is a reference project that turns the findings of an accessibility audit
          into a maintainable full-stack foundation. It lets people report problems and suggest improvements to public
          services.
        </p>
        <ul className="card-grid">
          {PRINCIPLES.map((item) => (
            <li key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
