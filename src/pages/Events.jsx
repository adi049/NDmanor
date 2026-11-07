import { EventInquiryForm } from '../components/Forms';
import Gallery from '../components/Gallery';
import HotelImage from '../components/HotelImage';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { galleryItems } from '../data/gallery';
import { site } from '../data/site';
import { createWhatsAppUrl } from '../utils/whatsapp';

const eventImages = galleryItems.filter((item) => item.category === 'Banquets');

export default function Events() {
  return (
    <>
      <PageHero
        eyebrow="Banquets & Events"
        title="Your occasion, brought together beautifully."
        intro="Explore banquet and celebration spaces at ND Manor, then plan the details directly with the hotel."
        image={{ src: '/images/banquet-rounds.webp', thumbnail: '/images/banquet-rounds-thumb.webp', alt: 'Banquet hall at Hotel ND Manor arranged with round tables' }}
      >
        <a className="button button--gold page-hero__button" href="#event-inquiry">Plan Your Event <Icon name="arrow-right" size={17} /></a>
      </PageHero>
      <section className="section-pad events-intro">
        <div className="container welcome-grid">
          <Reveal className="welcome-visual">
            <HotelImage image={{ src: '/images/celebration-entrance.webp', thumbnail: '/images/celebration-entrance-thumb.webp', alt: 'Decorated celebration entrance at Hotel ND Manor' }} className="welcome-image welcome-image--landscape" sizes="(max-width: 960px) 100vw, 50vw" />
            <div className="image-caption"><span>Celebrations at ND Manor</span><span>Dehradun</span></div>
          </Reveal>
          <Reveal className="welcome-copy" delay={100}>
            <p className="eyebrow">Gather at ND Manor</p>
            <h2>A celebration should feel like yours.</h2>
            <p className="lead">The hotel’s banquet facilities provide a setting for social and professional gatherings, with rooms and dining within the same property.</p>
            <p>Start with the occasion, your preferred date and an estimated guest count. The events team can then explain the spaces and arrangements currently available, without asking you to fit into an assumed package.</p>
            <a href="#event-inquiry" className="text-link">Start your inquiry <Icon name="arrow-right" size={18} /></a>
          </Reveal>
        </div>
      </section>
      <section className="section-pad section-white event-possibilities">
        <div className="container">
          <Reveal><SectionHeading eyebrow="Event possibilities" title="From heartfelt milestones to focused meetings." copy="Every event begins with a conversation about your plans and requirements." /></Reveal>
          <div className="event-possibility-grid">
            <Reveal className="event-possibility"><span>01</span><h3>Family celebrations</h3><p>Bring relatives together for anniversaries, ceremonies and meaningful family occasions.</p></Reveal>
            <Reveal className="event-possibility" delay={70}><span>02</span><h3>Wedding functions</h3><p>Discuss your function, décor preferences, dining plans and accommodation needs with the team.</p></Reveal>
            <Reveal className="event-possibility" delay={140}><span>03</span><h3>Birthday celebrations</h3><p>Plan a gathering around your guest list and the style of celebration you have in mind.</p></Reveal>
            <Reveal className="event-possibility" delay={210}><span>04</span><h3>Corporate gatherings</h3><p>Enquire about meeting and banquet arrangements for team sessions and professional events.</p></Reveal>
          </div>
          <p className="section-footnote">Capacities, packages, menus and venue policies are confirmed by the hotel for each event. No unverified limits or prices are published here.</p>
        </div>
      </section>
      <section className="section-pad events-gallery">
        <div className="container">
          <Reveal><SectionHeading eyebrow="Venue gallery" title="Picture your gathering here." copy="Actual banquet and celebration photography from Hotel ND Manor." /></Reveal>
          <Reveal><Gallery items={eventImages} layout="events" /></Reveal>
        </div>
      </section>
      <section className="event-inquiry-section section-pad" id="event-inquiry">
        <div className="container event-inquiry__grid">
          <Reveal className="event-inquiry__intro">
            <p className="eyebrow eyebrow--light">Plan your event</p>
            <h2>Let’s start with what you have in mind.</h2>
            <p>Complete the form to prepare a detailed WhatsApp inquiry. You can review the message before sending it to the hotel.</p>
            <div className="event-inquiry__contact"><span>Prefer to speak directly?</span><a href={`tel:${site.phone}`}><Icon name="phone" size={18} />{site.phoneDisplay}</a><a href={createWhatsAppUrl('Hello Hotel ND Manor, I would like to discuss an event. Please assist me.')} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} />WhatsApp the events team</a></div>
          </Reveal>
          <Reveal className="event-inquiry__form" delay={100}><EventInquiryForm /></Reveal>
        </div>
      </section>
    </>
  );
}
