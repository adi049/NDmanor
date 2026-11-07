import { Link } from 'react-router-dom';
import { navigation, rooms, site } from '../data/site';
import Logo from './Logo';
import Icon from './Icon';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p>Comfortable stays, inviting dining and thoughtfully hosted gatherings on Doon University Road in Dehradun.</p>
        </div>
        <div className="footer__column">
          <h2>Explore</h2>
          <ul>
            {navigation.slice(1).map((item) => <li key={item.to}><Link to={item.to}>{item.label}</Link></li>)}
          </ul>
        </div>
        <div className="footer__column">
          <h2>Stay & Celebrate</h2>
          <ul>
            {rooms.map((room) => <li key={room.slug}><Link to={`/rooms/${room.slug}`}>{room.name}</Link></li>)}
            <li><Link to="/booking">Reservation request</Link></li>
            <li><Link to="/events#event-inquiry">Plan an event</Link></li>
          </ul>
        </div>
        <div className="footer__column footer__contact">
          <h2>Find Us</h2>
          <a href={site.mapsUrl} target="_blank" rel="noreferrer">{site.address}</a>
          <a className="footer__phone" href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
          <a className="text-link text-link--light" href={site.directionsUrl} target="_blank" rel="noreferrer">Get directions <Icon name="arrow-up-right" size={16} /></a>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} Hotel ND Manor. All rights reserved.</p>
        <div>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
