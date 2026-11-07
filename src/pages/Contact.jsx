import { ContactForm } from '../components/Forms';
import Icon from '../components/Icon';
import LocationSection from '../components/LocationSection';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { site } from '../data/site';
import { createWhatsAppUrl } from '../utils/whatsapp';

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="A direct line to ND Manor."
        intro="Call, WhatsApp or send the details of your visit. The hotel team will take it from there."
        image={{ src: '/images/exterior-hero.webp', thumbnail: '/images/exterior-hero-thumb.webp', alt: 'Illuminated entrance of Hotel ND Manor' }}
      />
      <section className="section-pad contact-section">
        <div className="container">
          <Reveal><SectionHeading eyebrow="Get in touch" title="How can we help with your visit?" copy="Choose the easiest way to reach the hotel, or use the form to prepare a detailed WhatsApp message." /></Reveal>
          <div className="contact-methods">
            <Reveal className="contact-method"><Icon name="phone" size={25} /><span>Call the hotel</span><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a><p>For reservations, dining and event conversations.</p><a className="text-link" href={`tel:${site.phone}`}>Call Now <Icon name="arrow-up-right" size={16} /></a></Reveal>
            <Reveal className="contact-method" delay={80}><Icon name="whatsapp" size={25} /><span>WhatsApp</span><a href={createWhatsAppUrl('Hello Hotel ND Manor, I have an inquiry. Please assist me.')} target="_blank" rel="noreferrer">Message ND Manor</a><p>Prepare your details here, then send them in WhatsApp.</p><a className="text-link" href={createWhatsAppUrl('Hello Hotel ND Manor, I have an inquiry. Please assist me.')} target="_blank" rel="noreferrer">Start a chat <Icon name="arrow-up-right" size={16} /></a></Reveal>
            <Reveal className="contact-method" delay={160}><Icon name="map-pin" size={25} /><span>Visit the property</span><address>{site.shortAddress}<br />Uttarakhand 248121</address><p>Doon University Road, Mothrowala.</p><a className="text-link" href={site.directionsUrl} target="_blank" rel="noreferrer">Get Directions <Icon name="arrow-up-right" size={16} /></a></Reveal>
          </div>
          <div className="contact-form-layout">
            <Reveal className="contact-form-intro">
              <p className="eyebrow">Write to us</p>
              <h2>Share a few details.</h2>
              <p>Your form entries stay in your browser. When you submit, they open as a prefilled WhatsApp message for you to review and send.</p>
              <div className="contact-form-intro__note"><Icon name="check" size={18} /><span>No account needed<br />No website data storage<br />No instant booking claims</span></div>
            </Reveal>
            <Reveal className="contact-form-card" delay={100}><ContactForm /></Reveal>
          </div>
        </div>
      </section>
      <LocationSection heading="Find your way to the door." />
    </>
  );
}
