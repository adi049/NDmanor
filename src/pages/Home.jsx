import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BookingBar from '../components/BookingBar';
import CTASection from '../components/CTASection';
import { EventInquiryForm } from '../components/Forms';
import Gallery from '../components/Gallery';
import HotelImage from '../components/HotelImage';
import Icon from '../components/Icon';
import LocationSection from '../components/LocationSection';
import Reveal from '../components/Reveal';
import RoomCard from '../components/RoomCard';
import SectionHeading from '../components/SectionHeading';
import { galleryItems } from '../data/gallery';
import { rooms } from '../data/site';
import { createWhatsAppUrl, diningMessage } from '../utils/whatsapp';

const heroImage = { src: '/images/exterior-hero.webp', thumbnail: '/images/exterior-hero-thumb.webp', alt: 'The illuminated entrance of Hotel ND Manor in Dehradun' };
const previewIds = ['exterior-twilight', 'room-deluxe', 'restaurant-main', 'banquet-rounds', 'lobby', 'celebration-entrance'];
const previewItems = previewIds.map((id) => galleryItems.find((item) => item.id === id));

export default function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame = null;
    const update = () => {
      if (heroRef.current && window.scrollY < window.innerHeight * 1.2) {
        heroRef.current.style.setProperty('--hero-offset', `${Math.min(window.scrollY * 0.12, 80)}px`);
      }
      frame = null;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <section className="home-hero" ref={heroRef} aria-labelledby="home-hero-title">
        <HotelImage image={heroImage} eager sizes="100vw" className="home-hero__image" />
        <div className="home-hero__overlay" />
        <div className="container home-hero__content">
          <p className="hero-kicker">Hotel ND Manor <span /> Dehradun</p>
          <h1 id="home-hero-title"><span>Discover Comfort.</span><span><em>Experience ND Manor.</em></span></h1>
          <p className="home-hero__intro">Thoughtful hospitality, elegant spaces and memorable stays in Dehradun.</p>
          <div className="button-group">
            <Link to="/rooms" className="button button--gold">Explore Our Rooms <Icon name="arrow-right" size={17} /></Link>
            <Link to="/booking" className="button button--outline-light">Book Your Stay</Link>
          </div>
        </div>
        <div className="home-hero__location"><Icon name="map-pin" size={17} /><span>Doon University Road<br />Mothrowala, Dehradun</span></div>
        <a href="#welcome" className="scroll-cue"><span>Scroll to discover</span><i aria-hidden="true" /></a>
      </section>

      <div className="container home-booking"><BookingBar /></div>

      <section className="welcome-section section-pad" id="welcome">
        <div className="container welcome-grid">
          <Reveal className="welcome-visual">
            <HotelImage image={{ src: '/images/exterior-twilight.webp', thumbnail: '/images/exterior-twilight-thumb.webp', alt: 'Full exterior view of Hotel ND Manor at twilight' }} className="welcome-image" sizes="(max-width: 960px) 100vw, 50vw" />
            <div className="image-caption"><span>ND Manor</span><span>Mothrowala, Dehradun</span></div>
          </Reveal>
          <Reveal className="welcome-copy" delay={120}>
            <p className="eyebrow">Welcome to ND Manor</p>
            <h2>A Dehradun stay with a warmer sense of welcome.</h2>
            <p className="lead">Set on Doon University Road in Mothrowala, ND Manor brings together comfortable rooms, an in-house restaurant and spaces for gatherings.</p>
            <p>Whether you are visiting the university, travelling with family or planning a celebration, the essentials are close at hand and the team is only a message away.</p>
            <ul className="inline-features">
              <li><Icon name="clock" size={18} />24-hour front desk</li>
              <li><Icon name="car" size={19} />Free private parking</li>
              <li><Icon name="wifi" size={18} />Free Wi-Fi</li>
            </ul>
            <Link to="/about" className="text-link">Discover More <Icon name="arrow-right" size={18} /></Link>
          </Reveal>
        </div>
      </section>

      <section className="rooms-section section-pad section-white">
        <div className="container">
          <Reveal className="section-topline">
            <SectionHeading eyebrow="Rooms & Accommodation" title="Choose how you want to feel at home." copy="Four room preferences for different kinds of stays. Ask the team for the exact layout, features and current availability for your dates." />
            <Link to="/rooms" className="text-link">View all rooms <Icon name="arrow-right" size={18} /></Link>
          </Reveal>
          <div className="room-grid">
            {rooms.map((room, index) => <Reveal key={room.slug} delay={(index % 2) * 90}><RoomCard room={room} index={index} /></Reveal>)}
          </div>
          <p className="section-footnote">No rates are shown because availability and pricing are confirmed directly by the hotel for your dates.</p>
        </div>
      </section>

      <section className="dining-feature section-pad">
        <div className="container dining-feature__grid">
          <Reveal className="dining-feature__copy">
            <p className="eyebrow eyebrow--light">Dining · Café California</p>
            <h2>Indian flavours.<br /><em>An inviting table.</em></h2>
            <p>Dine at Café California, the hotel’s restaurant, where Indian cuisine and vegetarian options are part of the experience. Ask the team about the current menu, dining timings and room service.</p>
            <div className="dining-feature__details"><span>Indian cuisine</span><span>Vegetarian options</span><span>Room service</span></div>
            <div className="button-group">
              <Link to="/dining" className="button button--gold">Discover Dining</Link>
              <a className="button button--outline-light" href={createWhatsAppUrl(diningMessage())} target="_blank" rel="noreferrer">Dining Inquiry</a>
            </div>
          </Reveal>
          <Reveal className="dining-feature__visual" delay={120}>
            <HotelImage image={{ src: '/images/restaurant-main.webp', thumbnail: '/images/restaurant-main-thumb.webp', alt: 'Dining room at Café California in Hotel ND Manor' }} className="dining-feature__main-image" sizes="(max-width: 960px) 100vw, 50vw" />
            <HotelImage image={{ src: '/images/culinary-team.webp', thumbnail: '/images/culinary-team-thumb.webp', alt: 'Chefs at Hotel ND Manor presenting dishes' }} thumbnail className="dining-feature__small-image" sizes="(max-width: 960px) 55vw, 30vw" />
            <p className="vertical-caption">Café California · ND Manor</p>
          </Reveal>
        </div>
      </section>

      <section className="home-events section-pad">
        <div className="container">
          <Reveal className="section-topline">
            <SectionHeading eyebrow="Banquets & Celebrations" title="Bring your people together." copy="From family milestones to professional gatherings, the banquet and event spaces at ND Manor can be discussed around your plans." />
            <Link to="/events" className="text-link">Explore events <Icon name="arrow-right" size={18} /></Link>
          </Reveal>
          <div className="home-events__feature">
            <Reveal className="home-events__visual">
              <HotelImage image={{ src: '/images/banquet-rounds.webp', thumbnail: '/images/banquet-rounds-thumb.webp', alt: 'Banquet hall at Hotel ND Manor arranged for a celebration' }} className="home-events__image" sizes="(max-width: 960px) 100vw, 55vw" />
              <div className="image-caption image-caption--overlay"><span>Banquets at ND Manor</span><span>Dehradun</span></div>
            </Reveal>
            <Reveal className="home-events__content" delay={100}>
              <p className="eyebrow">Made for your occasion</p>
              <h3>A setting that starts with your plans, not a preset package.</h3>
              <ul className="event-type-list">
                <li><span>01</span>Family celebrations</li>
                <li><span>02</span>Wedding functions</li>
                <li><span>03</span>Birthday celebrations</li>
                <li><span>04</span>Corporate gatherings</li>
              </ul>
              <p>Share your preferred date, gathering size and requirements. The hotel will confirm suitable spaces, arrangements and pricing directly.</p>
            </Reveal>
          </div>
          <Reveal className="home-event-inquiry">
            <div className="home-event-inquiry__intro"><p className="eyebrow">Event inquiry</p><h3>Tell us what you are planning.</h3><p>A few details are enough to start the conversation.</p></div>
            <EventInquiryForm compact />
          </Reveal>
        </div>
      </section>

      <section className="experience-section section-pad section-white">
        <div className="container">
          <Reveal><SectionHeading eyebrow="Experience ND Manor" title="The essentials, thoughtfully close at hand." copy="Stay, dine and celebrate within one property on Doon University Road." /></Reveal>
          <div className="experience-grid">
            <Reveal delay={0}>
              <Link to="/dining" className="experience-card">
                <HotelImage image={{ src: '/images/restaurant-interior.webp', thumbnail: '/images/restaurant-interior-thumb.webp', alt: 'Restaurant interior at Hotel ND Manor' }} thumbnail />
                <div><span>01</span><h3>Dine at your own pace</h3><p>Café California and listed room service.</p><Icon name="arrow-up-right" /></div>
              </Link>
            </Reveal>
            <Reveal delay={80}>
              <Link to="/events" className="experience-card">
                <HotelImage image={{ src: '/images/banquet-setting.webp', thumbnail: '/images/banquet-setting-thumb.webp', alt: 'Celebration table setting at Hotel ND Manor' }} thumbnail />
                <div><span>02</span><h3>Gather for something special</h3><p>Banquet spaces for social and professional occasions.</p><Icon name="arrow-up-right" /></div>
              </Link>
            </Reveal>
            <Reveal delay={160}>
              <a href="https://www.google.com/maps/dir/?api=1&destination=30.2596878%2C78.0360893" target="_blank" rel="noreferrer" className="experience-card">
                <HotelImage image={{ src: '/images/exterior-day.webp', thumbnail: '/images/exterior-day-thumb.webp', alt: 'Daytime exterior of Hotel ND Manor' }} thumbnail />
                <div><span>03</span><h3>Arrive with ease</h3><p>Doon University Road address and free private parking.</p><Icon name="arrow-up-right" /></div>
              </a>
            </Reveal>
          </div>
          <Reveal className="amenity-ribbon">
            <span><Icon name="check" size={17} />24-hour front desk</span>
            <span><Icon name="check" size={17} />Free Wi-Fi</span>
            <span><Icon name="check" size={17} />Room service</span>
            <span><Icon name="check" size={17} />Garden and terrace</span>
          </Reveal>
        </div>
      </section>

      <section className="gallery-preview section-pad">
        <div className="container">
          <Reveal className="section-topline">
            <SectionHeading eyebrow="Gallery" title="A closer look at ND Manor." copy="Explore genuine photographs of the property, accommodation, restaurant and celebration spaces." />
            <Link to="/gallery" className="text-link">View full gallery <Icon name="arrow-right" size={18} /></Link>
          </Reveal>
          <Reveal><Gallery items={previewItems} /></Reveal>
        </div>
      </section>

      <LocationSection />
      <CTASection />
    </>
  );
}
