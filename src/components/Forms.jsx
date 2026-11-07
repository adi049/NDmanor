import { useId, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { rooms } from '../data/site';
import { addDaysInputValue, todayInputValue, validateCount, validateEmail, validatePhone, validateStay } from '../utils/dates';
import { bookingMessage, contactMessage, eventMessage, openWhatsApp } from '../utils/whatsapp';
import Icon from './Icon';

function Error({ id, children }) {
  return children ? <span className="field-error" id={id}>{children}</span> : null;
}

function PreparedMessage({ url, children }) {
  if (!url) return null;
  return (
    <div className="prepared-message" role="status" aria-live="polite">
      <Icon name="check" size={22} />
      <div>
        <strong>Your inquiry is ready.</strong>
        <p>{children}</p>
        <a href={url} target="_blank" rel="noreferrer" className="text-link">Open WhatsApp again <Icon name="arrow-up-right" size={15} /></a>
      </div>
    </div>
  );
}

function FormError({ children }) {
  return children ? <p className="form-message form-message--error" role="alert">{children}</p> : null;
}

export function ReservationForm() {
  const [searchParams] = useSearchParams();
  const uid = useId().replace(/:/g, '');
  const requestedRoom = searchParams.get('room');
  const validRoom = rooms.some((room) => room.slug === requestedRoom) ? requestedRoom : '';
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    checkIn: searchParams.get('checkIn') || todayInputValue(),
    checkOut: searchParams.get('checkOut') || addDaysInputValue(searchParams.get('checkIn') || '', 1),
    adults: searchParams.get('adults') || '2',
    children: searchParams.get('children') || '0',
    rooms: searchParams.get('rooms') || '1',
    roomPreference: validRoom,
    requests: '',
  });
  const [errors, setErrors] = useState({});
  const [preparedUrl, setPreparedUrl] = useState('');

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === 'checkIn' && next.checkOut <= value) next.checkOut = addDaysInputValue(value, 1);
      return next;
    });
    setErrors((current) => ({ ...current, [name]: '', form: '' }));
    setPreparedUrl('');
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateStay(form);
    if (form.name.trim().length < 2) nextErrors.name = 'Enter the guest name.';
    if (!validatePhone(form.phone)) nextErrors.phone = 'Enter a valid phone number with area code.';
    if (!validateEmail(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (!validateCount(form.adults, 1, 20)) nextErrors.adults = 'Enter 1 to 20 adults.';
    if (!validateCount(form.children, 0, 10)) nextErrors.children = 'Enter 0 to 10 children.';
    if (!validateCount(form.rooms, 1, 10)) nextErrors.rooms = 'Enter 1 to 10 rooms.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document.getElementById(`${uid}-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }
    try {
      setPreparedUrl(openWhatsApp(bookingMessage(form)));
    } catch {
      setErrors({ form: 'WhatsApp could not be opened. Your details are still here, so you can try again or call the hotel.' });
    }
  };

  const field = (name, label, content, error = errors[name], className = '') => (
    <label className={`form-field ${className}`} htmlFor={`${uid}-${name}`}>
      <span>{label}</span>
      {content}
      <Error id={`${uid}-${name}-error`}>{error}</Error>
    </label>
  );

  const described = (name) => ({
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${uid}-${name}-error` : undefined,
  });

  return (
    <form className="premium-form" onSubmit={submit} noValidate>
      <div className="form-section-title"><span>01</span><h2>Guest details</h2></div>
      <div className="form-grid">
        {field('name', 'Guest name *', <input id={`${uid}-name`} name="name" value={form.name} onChange={update} autoComplete="name" maxLength="100" required {...described('name')} />)}
        {field('phone', 'Phone number *', <input id={`${uid}-phone`} name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" placeholder="Include your area code" maxLength="20" required {...described('phone')} />)}
        {field('email', 'Email address *', <input id={`${uid}-email`} name="email" type="email" value={form.email} onChange={update} autoComplete="email" maxLength="160" required {...described('email')} />, errors.email, 'form-field--wide')}
      </div>
      <div className="form-section-title"><span>02</span><h2>Stay details</h2></div>
      <div className="form-grid form-grid--three">
        {field('checkIn', 'Check-in *', <input id={`${uid}-checkIn`} name="checkIn" type="date" min={todayInputValue()} value={form.checkIn} onChange={update} required {...described('checkIn')} />)}
        {field('checkOut', 'Check-out *', <input id={`${uid}-checkOut`} name="checkOut" type="date" min={addDaysInputValue(form.checkIn, 1)} value={form.checkOut} onChange={update} required {...described('checkOut')} />)}
        {field('roomPreference', 'Room preference', <select id={`${uid}-roomPreference`} name="roomPreference" value={form.roomPreference} onChange={update}><option value="">No preference</option>{rooms.map((room) => <option key={room.slug} value={room.slug}>{room.name}</option>)}</select>)}
        {field('adults', 'Adults *', <input id={`${uid}-adults`} name="adults" type="number" min="1" max="20" inputMode="numeric" value={form.adults} onChange={update} required {...described('adults')} />)}
        {field('children', 'Children *', <input id={`${uid}-children`} name="children" type="number" min="0" max="10" inputMode="numeric" value={form.children} onChange={update} required {...described('children')} />)}
        {field('rooms', 'Rooms *', <input id={`${uid}-rooms`} name="rooms" type="number" min="1" max="10" inputMode="numeric" value={form.rooms} onChange={update} required {...described('rooms')} />)}
        {field('requests', 'Special requests', <textarea id={`${uid}-requests`} name="requests" value={form.requests} onChange={update} maxLength="1000" rows="4" placeholder="Tell us about arrival timing, accessibility needs or anything else that would help." {...described('requests')} />, errors.requests, 'form-field--wide')}
      </div>
      <FormError>{errors.form}</FormError>
      <div className="form-submit-row">
        <button className="button button--forest" type="submit">Submit Reservation Request <Icon name="whatsapp" size={18} /></button>
        <p>Your details open in a prefilled WhatsApp message. Nothing is stored by this website.</p>
      </div>
      <PreparedMessage url={preparedUrl}>Send the prepared WhatsApp message to complete your inquiry. Your stay is confirmed only when the hotel responds with a confirmation.</PreparedMessage>
    </form>
  );
}

export function EventInquiryForm({ compact = false }) {
  const uid = useId().replace(/:/g, '');
  const [form, setForm] = useState({ name: '', phone: '', email: '', eventType: '', eventDate: '', guests: '', message: '' });
  const [errors, setErrors] = useState({});
  const [preparedUrl, setPreparedUrl] = useState('');
  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '', form: '' }));
    setPreparedUrl('');
  };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = 'Enter your name.';
    if (!validatePhone(form.phone)) nextErrors.phone = 'Enter a valid phone number.';
    if (!validateEmail(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (!form.eventType) nextErrors.eventType = 'Select an event type.';
    if (form.eventDate && form.eventDate < todayInputValue()) nextErrors.eventDate = 'Choose a future date.';
    if (form.guests && !validateCount(form.guests, 1, 10000)) nextErrors.guests = 'Enter a valid guest estimate.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      setPreparedUrl(openWhatsApp(eventMessage(form)));
    } catch {
      setErrors({ form: 'WhatsApp could not be opened. Please try again or call the hotel.' });
    }
  };
  const inputProps = (name) => ({ id: `${uid}-${name}`, name, value: form[name], onChange: update, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `${uid}-${name}-error` : undefined });
  return (
    <form className={`premium-form event-form ${compact ? 'event-form--compact' : ''}`} onSubmit={submit} noValidate>
      <div className="form-grid">
        <label className="form-field" htmlFor={`${uid}-name`}><span>Your name *</span><input {...inputProps('name')} autoComplete="name" maxLength="100" required /><Error id={`${uid}-name-error`}>{errors.name}</Error></label>
        <label className="form-field" htmlFor={`${uid}-phone`}><span>Phone number *</span><input {...inputProps('phone')} type="tel" autoComplete="tel" maxLength="20" required /><Error id={`${uid}-phone-error`}>{errors.phone}</Error></label>
        <label className="form-field form-field--wide" htmlFor={`${uid}-email`}><span>Email address *</span><input {...inputProps('email')} type="email" autoComplete="email" maxLength="160" required /><Error id={`${uid}-email-error`}>{errors.email}</Error></label>
        <label className="form-field" htmlFor={`${uid}-eventType`}><span>Event type *</span><select {...inputProps('eventType')} required><option value="">Select an occasion</option><option>Family celebration</option><option>Wedding function</option><option>Birthday celebration</option><option>Corporate gathering</option><option>Other occasion</option></select><Error id={`${uid}-eventType-error`}>{errors.eventType}</Error></label>
        <label className="form-field" htmlFor={`${uid}-eventDate`}><span>Preferred date</span><input {...inputProps('eventDate')} type="date" min={todayInputValue()} /><Error id={`${uid}-eventDate-error`}>{errors.eventDate}</Error></label>
        <label className="form-field" htmlFor={`${uid}-guests`}><span>Estimated guests</span><input {...inputProps('guests')} type="number" min="1" max="10000" inputMode="numeric" placeholder="To be discussed" /><Error id={`${uid}-guests-error`}>{errors.guests}</Error></label>
        <label className="form-field form-field--wide" htmlFor={`${uid}-message`}><span>Tell us about your event</span><textarea {...inputProps('message')} rows={compact ? '3' : '4'} maxLength="1000" placeholder="Share your plans, timings or setup requirements." /><Error id={`${uid}-message-error`}>{errors.message}</Error></label>
      </div>
      <FormError>{errors.form}</FormError>
      <div className="form-submit-row">
        <button className="button button--forest" type="submit">Plan Your Event <Icon name="whatsapp" size={18} /></button>
        <p>No package or availability is assumed. The hotel will discuss your requirements directly.</p>
      </div>
      <PreparedMessage url={preparedUrl}>Send the prepared message in WhatsApp so the events team can respond to your request.</PreparedMessage>
    </form>
  );
}

export function ContactForm({ initialSubject = 'General inquiry' }) {
  const uid = useId().replace(/:/g, '');
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: initialSubject, message: '' });
  const [errors, setErrors] = useState({});
  const [preparedUrl, setPreparedUrl] = useState('');
  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '', form: '' }));
    setPreparedUrl('');
  };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = 'Enter your name.';
    if (!validatePhone(form.phone)) nextErrors.phone = 'Enter a valid phone number.';
    if (form.email && !validateEmail(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (form.message.trim().length < 5) nextErrors.message = 'Tell us how we can help.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      setPreparedUrl(openWhatsApp(contactMessage(form)));
    } catch {
      setErrors({ form: 'WhatsApp could not be opened. Please try again or call the hotel.' });
    }
  };
  const inputProps = (name) => ({ id: `${uid}-${name}`, name, value: form[name], onChange: update, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `${uid}-${name}-error` : undefined });
  return (
    <form className="premium-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label className="form-field" htmlFor={`${uid}-name`}><span>Your name *</span><input {...inputProps('name')} autoComplete="name" maxLength="100" required /><Error id={`${uid}-name-error`}>{errors.name}</Error></label>
        <label className="form-field" htmlFor={`${uid}-phone`}><span>Phone number *</span><input {...inputProps('phone')} type="tel" autoComplete="tel" maxLength="20" required /><Error id={`${uid}-phone-error`}>{errors.phone}</Error></label>
        <label className="form-field" htmlFor={`${uid}-email`}><span>Email address</span><input {...inputProps('email')} type="email" autoComplete="email" maxLength="160" /><Error id={`${uid}-email-error`}>{errors.email}</Error></label>
        <label className="form-field" htmlFor={`${uid}-subject`}><span>Inquiry type</span><select {...inputProps('subject')}><option>General inquiry</option><option>Room inquiry</option><option>Restaurant inquiry</option><option>Event inquiry</option></select></label>
        <label className="form-field form-field--wide" htmlFor={`${uid}-message`}><span>Your message *</span><textarea {...inputProps('message')} rows="5" maxLength="1000" required placeholder="How can the ND Manor team help?" /><Error id={`${uid}-message-error`}>{errors.message}</Error></label>
      </div>
      <FormError>{errors.form}</FormError>
      <div className="form-submit-row">
        <button className="button button--forest" type="submit">Send via WhatsApp <Icon name="whatsapp" size={18} /></button>
        <p>Your information is used only to prepare your message and is not stored on this website.</p>
      </div>
      <PreparedMessage url={preparedUrl}>Send the prepared message in WhatsApp to complete your inquiry.</PreparedMessage>
    </form>
  );
}
