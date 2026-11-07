import { Link } from 'react-router-dom';
import CTASection from '../components/CTASection';
import HotelImage from '../components/HotelImage';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import RoomCard from '../components/RoomCard';
import SectionHeading from '../components/SectionHeading';
import { roomImageNote, rooms } from '../data/site';

export default function Rooms() {
  return (
    <>
      <PageHero
        eyebrow="Rooms & Suites"
        title="A comfortable room for every kind of stay."
        intro="Explore four room preferences, then ask the hotel for the exact layout, features and rate available for your dates."
        image={{ src: '/images/room-super-deluxe.webp', thumbnail: '/images/room-super-deluxe-thumb.webp', alt: 'Guest accommodation at Hotel ND Manor' }}
      />
      <section className="section-pad rooms-page">
        <div className="container">
          <Reveal className="section-topline">
            <SectionHeading eyebrow="Accommodation" title="Find your place to pause." copy="Every inquiry goes directly to ND Manor, so you can confirm the details before making a decision." />
            <Link to="/booking" className="button button--forest">Request a Stay</Link>
          </Reveal>
          <div className="room-grid">
            {rooms.map((room, index) => <Reveal key={room.slug} delay={(index % 2) * 90}><RoomCard room={room} index={index} /></Reveal>)}
          </div>
          <Reveal className="room-disclosure"><Icon name="check" size={19} /><p>{roomImageNote}</p></Reveal>
        </div>
      </section>
      <section className="room-amenities-section section-pad section-white">
        <div className="container room-amenities__grid">
          <Reveal className="room-amenities__visual">
            <HotelImage image={{ src: '/images/room-deluxe-seating.webp', thumbnail: '/images/room-deluxe-seating-thumb.webp', alt: 'Deluxe Room sleeping and seating area at Hotel ND Manor' }} thumbnail sizes="(max-width: 960px) 100vw, 45vw" />
          </Reveal>
          <Reveal className="room-amenities__content" delay={100}>
            <p className="eyebrow">Commonly listed room essentials</p>
            <h2>The things that make settling in simple.</h2>
            <p>These amenities appear in public ND Manor accommodation listings. They are not a guaranteed inventory for every category or individual room, so confirm inclusion when you enquire.</p>
            <ul className="amenity-checklist">
              {['Air conditioning', 'Free Wi-Fi', 'Flat-screen TV', 'Private bathroom', 'Tea and coffee maker', 'Complimentary toiletries'].map((item) => <li key={item}><Icon name="check" size={17} />{item}</li>)}
            </ul>
            <Link to="/booking" className="text-link">Ask about your dates <Icon name="arrow-right" size={18} /></Link>
          </Reveal>
        </div>
      </section>
      <CTASection title="Found a room preference? Let’s check your dates." copy="Send your stay details directly to ND Manor. The hotel will respond with current options, exact room information and rates." />
    </>
  );
}
