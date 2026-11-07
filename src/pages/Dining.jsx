import Gallery from '../components/Gallery';
import HotelImage from '../components/HotelImage';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { galleryItems } from '../data/gallery';
import { site } from '../data/site';
import { createWhatsAppUrl, diningMessage } from '../utils/whatsapp';

const diningImages = galleryItems.filter((item) => item.category === 'Dining');

export default function Dining() {
  return (
    <>
      <PageHero
        eyebrow="Dining"
        title="A welcoming table at Café California."
        intro="The restaurant at ND Manor brings Indian cuisine, a comfortable dining room and the ease of eating where you stay."
        image={{ src: '/images/restaurant-main.webp', thumbnail: '/images/restaurant-main-thumb.webp', alt: 'Café California restaurant at Hotel ND Manor' }}
      />
      <section className="section-pad dining-intro">
        <div className="container dining-intro__grid">
          <Reveal className="dining-intro__visual">
            <HotelImage image={{ src: '/images/restaurant-interior.webp', thumbnail: '/images/restaurant-interior-thumb.webp', alt: 'Chandeliers and tables in the restaurant at Hotel ND Manor' }} sizes="(max-width: 960px) 100vw, 50vw" />
            <div className="image-caption"><span>Café California</span><span>Hotel ND Manor</span></div>
          </Reveal>
          <Reveal className="dining-intro__copy" delay={100}>
            <p className="eyebrow">The restaurant</p>
            <h2>Come for a meal. Settle in for the moment.</h2>
            <p className="lead">Café California is ND Manor’s in-house restaurant, listed as serving Indian cuisine in a family-friendly setting.</p>
            <p>Vegetarian and vegan dietary options appear in public dining listings, alongside room service for guests who prefer to dine privately. Menus, meal timings and the dishes available on the day can be confirmed directly with the team.</p>
            <div className="button-group">
              <a href={createWhatsAppUrl(diningMessage())} target="_blank" rel="noreferrer" className="button button--forest">Ask About Dining <Icon name="whatsapp" size={18} /></a>
              <a href={`tel:${site.phone}`} className="button button--text"><Icon name="phone" size={17} />Call Restaurant</a>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section-pad culinary-section section-white">
        <div className="container culinary-grid">
          <Reveal className="culinary-copy">
            <p className="eyebrow">From the kitchen</p>
            <h2>A dining experience with a human touch.</h2>
            <p>Meet the culinary team behind the ND Manor dining experience. For current specialties, dietary requests or a group meal, start a direct conversation before your visit.</p>
            <dl className="dining-facts">
              <div><dt>Cuisine</dt><dd>Indian</dd></div>
              <div><dt>Dietary options</dt><dd>Vegetarian and vegan options listed</dd></div>
              <div><dt>In-room dining</dt><dd>Room service listed</dd></div>
              <div><dt>Menu and timings</dt><dd>Available on direct inquiry</dd></div>
            </dl>
          </Reveal>
          <Reveal className="culinary-visual" delay={100}>
            <HotelImage image={{ src: '/images/culinary-team.webp', thumbnail: '/images/culinary-team-thumb.webp', alt: 'Culinary team at Hotel ND Manor presenting dishes' }} sizes="(max-width: 960px) 100vw, 50vw" />
          </Reveal>
        </div>
      </section>
      <section className="section-pad dining-gallery">
        <div className="container">
          <Reveal><SectionHeading eyebrow="Inside the restaurant" title="Take a look around." copy="Genuine photographs of the dining room and culinary team at Hotel ND Manor." /></Reveal>
          <Reveal><Gallery items={diningImages} layout="wide" /></Reveal>
        </div>
      </section>
      <section className="simple-cta section-pad">
        <Reveal className="container simple-cta__inner">
          <p className="eyebrow eyebrow--light">Dining inquiries</p>
          <h2>Planning a meal at ND Manor?</h2>
          <p>Ask about the current menu, dietary requirements, timings or dining for your group.</p>
          <div className="button-group"><a href={createWhatsAppUrl(diningMessage())} target="_blank" rel="noreferrer" className="button button--gold">WhatsApp the Hotel</a><a href={`tel:${site.phone}`} className="button button--outline-light">Call Now</a></div>
        </Reveal>
      </section>
    </>
  );
}
