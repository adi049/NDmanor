export function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayInputValue() {
  return toDateInputValue(new Date());
}

export function addDaysInputValue(value, days = 1) {
  const date = value ? new Date(`${value}T12:00:00`) : new Date();
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
}

export function validateStay({ checkIn, checkOut }) {
  const errors = {};
  const today = todayInputValue();
  if (!checkIn) errors.checkIn = 'Select your check-in date.';
  else if (checkIn < today) errors.checkIn = 'Check-in cannot be in the past.';
  if (!checkOut) errors.checkOut = 'Select your check-out date.';
  else if (checkIn && checkOut <= checkIn) errors.checkOut = 'Check-out must be after check-in.';
  return errors;
}

export function validatePhone(phone) {
  const value = String(phone || '').trim();
  if (!/^\+?[\d\s().-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

export function validateCount(value, minimum, maximum) {
  const number = Number(value);
  return Number.isInteger(number) && number >= minimum && number <= maximum;
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}
