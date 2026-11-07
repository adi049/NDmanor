import { Link } from 'react-router-dom';
import HotelImage from './HotelImage';
import Icon from './Icon';
import RoomPendingVisual from './RoomPendingVisual';

export default function RoomCard({ room, index = 0, layout = 'two' }) {
  const cardImage = room.image;
  const sizes = layout === 'three'
    ? '(max-width: 800px) 100vw, (min-width: 1500px) 430px, 33vw'
    : '(max-width: 680px) 100vw, (min-width: 1500px) 650px, 50vw';

  return (
    <article className="room-card">
      <Link to={`/rooms/${room.slug}`} className="room-card__image-link" aria-label={`View ${room.name} details`}>
        {cardImage ? (
          <HotelImage
            image={cardImage}
            thumbnail
            className="room-card__image"
            sizes={sizes}
          />
        ) : <RoomPendingVisual room={room} />}
        <span className="room-card__number" aria-hidden="true">{room.number || String(index + 1).padStart(2, '0')}</span>
      </Link>
      <div className="room-card__body">
        <h3><Link to={`/rooms/${room.slug}`}>{room.name}</Link></h3>
        <p>{room.description}</p>
        {room.amenities.length ? (
          <ul className="room-card__amenities" aria-label="Publicly listed hotel room amenities">
            {room.amenities.slice(0, 3).map((amenity) => <li key={amenity}>{amenity}</li>)}
          </ul>
        ) : (
          <ul className="room-card__amenities" aria-label="Room amenity verification status"><li>Amenities awaiting hotel confirmation</li></ul>
        )}
        <div className="room-card__actions">
          <Link className="text-link" to={`/rooms/${room.slug}`}>Room details <Icon name="arrow-right" size={17} /></Link>
          <Link className="text-link text-link--muted" to={`/booking?room=${room.slug}`}>Enquire now <Icon name="arrow-up-right" size={16} /></Link>
        </div>
      </div>
    </article>
  );
}
