const SERVICES = [
  { title: 'Postal and parcel services', text: 'Share feedback on delivery times, tracking, counters and parcel handling.' },
  { title: 'Savings and financial services', text: 'Tell us about your experience with accounts, payments and financial products.' },
  { title: 'Online and digital services', text: 'Report problems with websites, forms and online tools, including usability barriers.' },
  { title: 'Customer support', text: 'Comment on helplines, grievance handling and how quickly your query was resolved.' },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="container">
        <h2 id="services-title">Services</h2>
        <p className="section-intro">
          You can send feedback about any of the service areas below. Sample categories are shown for demonstration.
        </p>
        <ul className="card-grid">
          {SERVICES.map((service) => (
            <li key={service.title} className="card">
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
