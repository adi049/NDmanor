import { Link } from 'react-router-dom';
import CTASection from '../components/CTASection';
import HotelImage from '../components/HotelImage';
import Icon from '../components/Icon';
import LocationSection from '../components/LocationSection';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Rooted in Dehradun. Ready to welcome you."
        intro="A comfortable address for university visits, family stays and occasions that bring people together."
        image={{ src: '/images/exterior-day.webp', thumbnail: '/images/exterior-day-thumb.webp', alt: 'Daytime view of Hotel ND Manor in Dehradun' }}
      />

      <section className="section-pad about-intro">
        <div className="container welcome-grid">
          <Reveal className="welcome-copy">
            <p className="eyebrow">The ND Manor approach</p>
            <h2>Hospitality that begins with listening.</h2>
            <p className="lead">A good stay is not one-size-fits-all. It might mean a quiet room after a journey, a convenient base for a campus visit, or a familiar place for the family to gather.</p>
            <p>At ND Manor, rooms, dining and event spaces sit within one property on Doon University Road. The direct inquiry experience is designed around the same idea: tell the team what you need, then receive the current details that matter for your visit.</p>
            <Link to="/contact" className="text-link">Talk to the team <Icon name="arrow-right" size={18} /></Link>
          </Reveal>
          <Reveal className="welcome-visual" delay={100}>
            <HotelImage image={{ src: '/images/lobby.webp', thumbnail: '/images/lobby-thumb.webp', alt: 'Lobby seating inside Hotel ND Manor' }} className="welcome-image welcome-image--landscape" sizes="(max-width: 960px) 100vw, 50vw" />
            <div className="image-caption"><span>Inside ND Manor</span><span>Make yourself comfortable</span></div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad section-white">
        <div className="container">
          <Reveal><SectionHeading eyebrow="Your stay, your purpose" title="Different reasons to visit. One welcoming address." /></Reveal>
          <div className="editorial-cards">
            <Reveal className="editorial-card">
              <span>01</span><h3>Campus and city visits</h3><p>The Mothrowala location places you on Doon University Road, with Dehradun’s wider city connections within reach.</p><Link to="/rooms" className="text-link">Explore rooms <Icon name="arrow-right" size={16} /></Link>
            </Reveal>
            <Reveal className="editorial-card" delay={80}>
              <span>02</span><h3>Time with family</h3><p>Share your group size and preferences directly so the hotel can suggest a suitable available room configuration.</p><Link to="/rooms/family-room" className="text-link">Family room inquiries <Icon name="arrow-right" size={16} /></Link>
            </Reveal>
            <Reveal className="editorial-card" delay={160}>
              <span>03</span><h3>Moments worth gathering for</h3><p>Plan social celebrations, wedding functions and corporate gatherings with the banquet and events team.</p><Link to="/events" className="text-link">Plan an event <Icon name="arrow-right" size={16} /></Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad property-story">
        <div className="container">
          <Reveal className="section-topline">
            <SectionHeading eyebrow="Around the property" title="Spaces for arrival, rest and connection." />
            <Link to="/gallery" className="text-link">Open the gallery <Icon name="arrow-right" size={18} /></Link>
          </Reveal>
          <div className="property-story__grid">
            <Reveal><HotelImage image={{ src: '/images/corridor.webp', thumbnail: '/images/corridor-thumb.webp', alt: 'Guest room corridor at Hotel ND Manor' }} thumbnail sizes="(max-width: 680px) 100vw, (min-width: 1500px) 360px, 27vw" /><p>Guest room corridors</p></Reveal>
            <Reveal delay={80}><HotelImage image={{ src: '/images/restaurant-detail.webp', thumbnail: '/images/restaurant-detail-thumb.webp', alt: 'Restaurant interior at Hotel ND Manor' }} thumbnail sizes="(max-width: 680px) 100vw, (min-width: 1500px) 600px, 45vw" /><p>Café California</p></Reveal>
            <Reveal delay={160}><HotelImage image={{ src: '/images/exterior-sign.webp', thumbnail: '/images/exterior-sign-thumb.webp', alt: 'Hotel ND Manor entrance sign' }} thumbnail sizes="(max-width: 680px) 100vw, (min-width: 1500px) 360px, 27vw" /><p>The ND Manor arrival</p></Reveal>
          </div>
        </div>
      </section>

      <section className="guest-experience section-pad">
        <div className="container guest-experience__grid">
          <Reveal>
            <p className="eyebrow eyebrow--light">The guest experience</p>
            <h2>Practical comforts, without the guesswork.</h2>
            <p>Public hotel listings consistently identify the following facilities. For anything specific to your stay, ask before you book.</p>
          </Reveal>
          <Reveal className="guest-experience__list" delay={100}>
            {['24-hour front desk', 'Free Wi-Fi', 'Free private parking', 'Restaurant and room service', 'Garden and terrace', 'Air-conditioned rooms'].map((item) => <span key={item}><Icon name="check" size={18} />{item}</span>)}
          </Reveal>
        </div>
      </section>

      <LocationSection heading="Your Dehradun plans start with an easy-to-find address." />
      <CTASection />
    </>
  );
}
