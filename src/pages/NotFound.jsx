import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/Logo';
import Icon from '../components/Icon';

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container not-found__inner">
        <BrandLogo className="not-found__mark" sizes="75px" />
        <p className="eyebrow">Error 404</p>
        <h1>The page you’re looking for isn’t here.</h1>
        <p>It may have moved, or the address may be incomplete. Return to the hotel homepage or continue exploring rooms.</p>
        <div className="button-group"><Link to="/" className="button button--gold">Return Home</Link><Link to="/rooms" className="button button--outline-light">Explore Rooms <Icon name="arrow-right" size={17} /></Link></div>
      </div>
    </section>
  );
}
