import { useState } from 'react';
import { addDaysInputValue, todayInputValue, validateCount, validateStay } from '../utils/dates';
import { availabilityMessage, openWhatsApp } from '../utils/whatsapp';
import Icon from './Icon';

const initial = {
  checkIn: todayInputValue(),
  checkOut: addDaysInputValue('', 1),
  adults: '2',
  children: '0',
  rooms: '1',
};

export default function BookingBar() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [preparedUrl, setPreparedUrl] = useState('');

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === 'checkIn' && next.checkOut <= value) next.checkOut = addDaysInputValue(value, 1);
      return next;
    });
    setErrors((current) => ({ ...current, [name]: '' }));
    setPreparedUrl('');
  };

  const submit = (event) => {
    event.preventDefault();
    const stayErrors = validateStay(form);
    if (!validateCount(form.adults, 1, 20)) stayErrors.adults = 'Enter 1 to 20 adults.';
    if (!validateCount(form.rooms, 1, 10)) stayErrors.rooms = 'Enter 1 to 10 rooms.';
    if (!validateCount(form.children, 0, 10)) stayErrors.children = 'Enter 0 to 10 children.';
    setErrors(stayErrors);
    if (Object.keys(stayErrors).length) return;
    try {
      const url = openWhatsApp(availabilityMessage(form));
      setPreparedUrl(url);
    } catch {
      setErrors({ form: 'WhatsApp could not be opened. Please call the hotel or try again.' });
    }
  };

  return (
    <div className="booking-bar-wrap">
      <form className="booking-bar" onSubmit={submit} noValidate aria-label="Check room availability">
        <div className="booking-bar__heading">
          <span>Plan your stay</span>
          <small>Direct inquiry</small>
        </div>
        <label className="booking-field">
          <span>Check-in</span>
          <input type="date" name="checkIn" value={form.checkIn} min={todayInputValue()} onChange={update} aria-invalid={Boolean(errors.checkIn)} aria-describedby={errors.checkIn ? 'bar-checkin-error' : undefined} required />
          {errors.checkIn && <small className="field-error" id="bar-checkin-error">{errors.checkIn}</small>}
        </label>
        <label className="booking-field">
          <span>Check-out</span>
          <input type="date" name="checkOut" value={form.checkOut} min={addDaysInputValue(form.checkIn, 1)} onChange={update} aria-invalid={Boolean(errors.checkOut)} aria-describedby={errors.checkOut ? 'bar-checkout-error' : undefined} required />
          {errors.checkOut && <small className="field-error" id="bar-checkout-error">{errors.checkOut}</small>}
        </label>
        <label className="booking-field booking-field--number">
          <span>Adults</span>
          <input type="number" name="adults" value={form.adults} min="1" max="20" inputMode="numeric" onChange={update} aria-invalid={Boolean(errors.adults)} required />
          {errors.adults && <small className="field-error">{errors.adults}</small>}
        </label>
        <label className="booking-field booking-field--number">
          <span>Children</span>
          <input type="number" name="children" value={form.children} min="0" max="10" inputMode="numeric" onChange={update} aria-invalid={Boolean(errors.children)} required />
          {errors.children && <small className="field-error">{errors.children}</small>}
        </label>
        <label className="booking-field booking-field--number">
          <span>Rooms</span>
          <input type="number" name="rooms" value={form.rooms} min="1" max="10" inputMode="numeric" onChange={update} aria-invalid={Boolean(errors.rooms)} required />
          {errors.rooms && <small className="field-error">{errors.rooms}</small>}
        </label>
        <button className="button button--gold booking-bar__submit" type="submit">Check Availability <Icon name="arrow-up-right" size={17} /></button>
        {errors.form && <p className="form-message form-message--error booking-bar__message" role="alert">{errors.form}</p>}
        {preparedUrl && (
          <p className="form-message form-message--success booking-bar__message" role="status">
            Your availability inquiry is ready in WhatsApp. Send it to complete your request. <a href={preparedUrl} target="_blank" rel="noreferrer">Open again</a>
          </p>
        )}
      </form>
      <p className="booking-bar__note">No payment is taken here. The hotel will confirm availability and rates directly.</p>
    </div>
  );
}
