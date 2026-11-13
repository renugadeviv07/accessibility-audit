import { useState } from 'react';
import Hero from '../components/Hero.jsx';
import AboutSection from '../components/AboutSection.jsx';
import ServicesSection from '../components/ServicesSection.jsx';
import FeedbackSection from '../components/FeedbackSection.jsx';
import ContactSection from '../components/ContactSection.jsx';

export default function HomePage() {
  const [submissions, setSubmissions] = useState([]);

  return (
    <>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <FeedbackSection
        submissions={submissions}
        onSubmitted={(item) => setSubmissions((current) => [item, ...current])}
      />
      <ContactSection />
    </>
  );
}
