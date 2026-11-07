import { Link, useParams } from 'react-router-dom';
import HotelImage from '../components/HotelImage';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import RoomCard from '../components/RoomCard';
import RoomPendingVisual from '../components/RoomPendingVisual';
import { rooms, site } from '../data/site';
import NotFound from './NotFound';

export default function RoomDetail() {
  const { slug } = useParams();
  const room = rooms.find((item) => item.slug === slug);
  if (!room) return <NotFound />;
  const otherRooms = rooms.filter((item) => item.slug !== slug).slice(0, 3);
  const detailImage = room.images[0];

  return (
    <>
      <PageHero
        eyebrow="Rooms & Suites"
        title={room.name}
        intro={room.description}
        image={room.heroImage || room.image}
        imageNote={room.photoPending ? 'Category photography is pending. No exterior, lobby or other room photograph is shown.' : room.heroImageNote}
      >
        <nav className="room-hero-link" aria-label="Room navigation"><Link to="/rooms">View all rooms <Icon name="arrow-right" size={17} /></Link></nav>
      </PageHero>
      <section className="section-pad room-detail">
        <div className="container room-detail__grid">
          <Reveal className="room-detail__visual">
            {detailImage ? (
              <HotelImage
                image={detailImage}
                className="room-detail__main-image"
                sizes="(max-width: 960px) 100vw, 55vw"
              />
            ) : <RoomPendingVisual room={room} detail />}
            <p className="image-caption">
              <span>{room.images.length ? 'Accommodation at ND Manor' : 'Category photography pending'}</span>
              <span>{room.number}</span>
            </p>
          </Reveal>
          <Reveal className="room-detail__content" delay={100}>
            <p className="eyebrow">Room {room.number}</p>
            <h2>Make yourself at home in Dehradun.</h2>
            <p className="lead">{room.detail}</p>
            {room.amenities.length ? (
              <>
                <h3>Publicly listed hotel room amenities</h3>
                <ul className="amenity-checklist amenity-checklist--two">
                  {room.amenities.map((amenity) => <li key={amenity}><Icon name="check" size={17} />{amenity}</li>)}
                </ul>
                <p className="amenity-verification">These amenities are corroborated by public property listings, but category-specific inclusion still requires hotel confirmation.</p>
              </>
            ) : (
              <div className="amenity-pending">
                <h3>Room amenities</h3>
                <p>Amenities for this category await direct hotel confirmation.</p>
              </div>
            )}
            <div className="button-group">
              <Link to={`/booking?room=${room.slug}`} className="button button--forest">Enquire About This Room</Link>
              <a href={`tel:${site.phone}`} className="button button--text"><Icon name="phone" size={17} />Call Hotel</a>
            </div>
          </Reveal>
        </div>
        <div className="container">
          <Reveal className="room-disclosure"><Icon name="check" size={19} /><p>{room.note}</p></Reveal>
          {room.images.length > 1 && (
            <div className="room-detail__secondary-images">
              {room.images.slice(1).map((image, index) => (
                <Reveal key={image.src} delay={index * 80}>
                  <HotelImage image={image} thumbnail sizes="(max-width: 680px) 100vw, 50vw" />
                </Reveal>
              ))}
            </div>
          )}
          <Reveal className="booking-notes">
            <div><span>01</span><h3>Ask for your dates</h3><p>Availability changes. Your request goes directly to the hotel for a current response.</p></div>
            <div><span>02</span><h3>Confirm the exact room</h3><p>Discuss layout, outlook and any feature that is important to your stay.</p></div>
            <div><span>03</span><h3>Receive the applicable rate</h3><p>No indicative prices are shown. The hotel will quote for your room and dates.</p></div>
          </Reveal>
        </div>
      </section>
      <section className="section-pad section-white">
        <div className="container">
          <div className="section-topline"><div className="section-heading"><p className="eyebrow">Continue exploring</p><h2>Other room preferences</h2></div><Link to="/rooms" className="text-link">All rooms <Icon name="arrow-right" size={17} /></Link></div>
          <div className="room-grid room-grid--three">{otherRooms.map((item) => <RoomCard key={item.slug} room={item} layout="three" />)}</div>
        </div>
      </section>
    </>
  );
}
