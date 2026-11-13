import { NAV_ITEMS } from './Header.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-title">Accessible Public Service Portal</p>
          <p>
            A demonstration project showing accessible, maintainable foundations for public service websites. It is
            not an official government service.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="footer-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container footer-legal">
        <p>&copy; {new Date().getFullYear()} Accessible Public Service Portal. Demonstration content.</p>
      </div>
    </footer>
  );
}
