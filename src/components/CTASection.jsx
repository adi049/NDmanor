import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import HotelImage from './HotelImage';

export default function CTASection({ title = 'Your Next Stay Begins at ND Manor.', copy = 'Tell us your dates and preferences. Our team will respond with current room details and availability.' }) {
  return (
    <section className="closing-cta section-pad">
      <div className="container">
        <Reveal className="closing-cta__inner">
          <HotelImage image={{ src: '/images/exterior-twilight.webp', thumbnail: '/images/exterior-twilight-thumb.webp', alt: 'Hotel ND Manor exterior at twilight' }} thumbnail sizes="100vw" className="closing-cta__image" />
          <div className="closing-cta__content">
            <p className="eyebrow eyebrow--light">Reservations</p>
            <h2>{title}</h2>
            <p>{copy}</p>
            <div className="button-group">
              <Link to="/booking" className="button button--gold">Book Your Stay</Link>
              <Link to="/contact" className="button button--outline-light">Contact Us</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
