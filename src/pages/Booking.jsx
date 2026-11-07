import { ReservationForm } from '../components/Forms';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { site } from '../data/site';

export default function Booking() {
  return (
    <>
      <PageHero
        eyebrow="Reservations"
        title="Let’s plan your stay."
        intro="Send your preferred dates and room choice directly to Hotel ND Manor. You will receive current availability and rates from the hotel."
        image={{ src: '/images/room-deluxe.webp', thumbnail: '/images/room-deluxe-thumb.webp', alt: 'Guest room at Hotel ND Manor' }}
      />
      <section className="section-pad booking-page">
        <div className="container booking-page__grid">
          <Reveal className="booking-page__form"><ReservationForm /></Reveal>
          <aside className="booking-aside">
            <Reveal>
              <p className="eyebrow">How it works</p>
              <h2>A request first. A confirmation from the hotel next.</h2>
              <ol className="booking-steps">
                <li><span>01</span><div><h3>Review your message</h3><p>Submitting the form opens WhatsApp with all your stay details prefilled.</p></div></li>
                <li><span>02</span><div><h3>Send it to ND Manor</h3><p>You choose when to send. The website does not claim that the hotel has received anything before then.</p></div></li>
                <li><span>03</span><div><h3>Receive hotel confirmation</h3><p>The team responds with current availability, room details, rates and the next steps.</p></div></li>
              </ol>
            </Reveal>
            <Reveal className="booking-aside__contact" delay={100}>
              <p>Prefer to speak with someone?</p>
              <a href={`tel:${site.phone}`}><Icon name="phone" size={19} />{site.phoneDisplay}</a>
              <span>{site.shortAddress}</span>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
