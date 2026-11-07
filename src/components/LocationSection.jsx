import { site } from '../data/site';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import Icon from './Icon';

export default function LocationSection({ heading = 'In Dehradun, close to where you need to be.' }) {
  return (
    <section className="location-section section-pad">
      <div className="container">
        <Reveal>
          <SectionHeading eyebrow="Location" title={heading} copy="Find ND Manor on Doon University Road in Mothrowala. Open the map for turn-by-turn directions from your location." />
        </Reveal>
        <div className="location-grid">
          <Reveal className="map-wrap">
            <iframe
              src={site.mapEmbedUrl}
              title="Map showing Hotel ND Manor in Mothrowala, Dehradun"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
          <Reveal className="location-card" delay={100}>
            <Icon name="map-pin" size={29} />
            <p className="eyebrow">Hotel ND Manor</p>
            <h3>{site.shortAddress}</h3>
            <p>Uttarakhand 248121, India</p>
            <div className="location-card__contact">
              <span>Reservations & inquiries</span>
              <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
            </div>
            <div className="button-group">
              <a className="button button--forest" href={site.directionsUrl} target="_blank" rel="noreferrer">Get Directions <Icon name="arrow-up-right" size={17} /></a>
              <a className="button button--text" href={`tel:${site.phone}`}>Call Hotel</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
