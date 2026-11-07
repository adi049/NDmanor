export const site = {
  name: 'Hotel ND Manor',
  shortName: 'ND Manor',
  // Official production origin. DNS and hosting are configured externally: see DEPLOYMENT.md.
  domain: 'https://ndmanor.com',
  phoneDisplay: '+91 70789 44451',
  phone: '+917078944451',
  whatsapp: '917078944451',
  address: 'Doon University Road, Mothrowala, Dehradun, Uttarakhand 248121, India',
  shortAddress: 'Doon University Road, Mothrowala, Dehradun',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Nd%20Manor%20Hotel%20Dehradun%20Doon%20University%20Rd%2C%20Mothrowala%2C%20Dehradun%2C%20Uttarakhand%20248121',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=30.2596878%2C78.0360893',
  mapEmbedUrl: 'https://www.google.com/maps?q=30.2596878,78.0360893&z=16&output=embed',
};

export const navigation = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Rooms & Suites', to: '/rooms' },
  { label: 'Dining', to: '/dining' },
  { label: 'Banquets & Events', to: '/events' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

// These amenities are listed publicly for ND Manor accommodation generally.
// They are not presented as a guaranteed inventory for every individual room.
const roomAmenities = [
  'Air conditioning',
  'Free Wi-Fi',
  'Flat-screen TV',
  'Private bathroom',
  'Tea and coffee maker',
  'Complimentary toiletries',
];

const photo = (name, alt) => ({
  src: `/images/${name}.webp`,
  thumbnail: `/images/${name}-thumb.webp`,
  alt,
});

export const roomImageNote = 'Room galleries use category-labelled public listing photographs where a match is available. Layout, outlook and features can vary by room. The hotel will confirm the exact room offered before you book.';

export const rooms = [
  {
    slug: 'deluxe-room',
    name: 'Deluxe Room',
    shortName: 'Deluxe',
    number: '01',
    image: photo('room-deluxe', 'Deluxe Room at Hotel ND Manor with a bed, armchair and warm lighting'),
    images: [
      photo('room-deluxe', 'Deluxe Room at Hotel ND Manor with a bed, armchair and warm lighting'),
      photo('room-deluxe-seating', 'Deluxe Room at Hotel ND Manor showing its sleeping and seating area'),
      photo('room-deluxe-detail', 'Deluxe Room at Hotel ND Manor with a bed, armchair and side table'),
    ],
    description: 'A clearly listed ND Manor room category with essential in-room comforts. Ask the hotel to confirm the exact layout and features for your dates.',
    detail: 'Public Deluxe Room photographs show sleeping and seating areas. Share your requirements with the team so they can confirm the current room configuration and the amenities included for your stay.',
    amenities: roomAmenities,
    note: roomImageNote,
  },
  {
    slug: 'super-deluxe-room',
    name: 'Super Deluxe Room',
    shortName: 'Super Deluxe',
    number: '02',
    image: photo('room-super-deluxe', 'Super Deluxe Room at Hotel ND Manor with a bed, seating and tea station'),
    images: [
      photo('room-super-deluxe', 'Super Deluxe Room at Hotel ND Manor with a bed, seating and tea station'),
      photo('room-super-deluxe-detail', 'Super Deluxe Room at Hotel ND Manor with a sleeping area, seating and bathtub'),
      photo('room-super-deluxe-prepared', 'Super Deluxe Room at Hotel ND Manor prepared with towels and floral decoration'),
    ],
    description: 'A separately listed room preference with category photographs showing seating and, in selected rooms, a bathtub. Confirm the exact configuration directly.',
    detail: 'This gallery follows the category-labelled Superior and Super Deluxe series in public property listings. Selected photographs show a bathtub. Mention the features that matter to you when you enquire so the hotel can confirm the exact room available.',
    amenities: roomAmenities,
    note: roomImageNote,
  },
  {
    slug: 'family-room',
    name: 'Family Room',
    shortName: 'Family',
    number: '03',
    image: photo('room-family', 'Family Room at Hotel ND Manor with a bed, red sofa seating and a marble coffee table'),
    images: [
      photo('room-family', 'Family Room at Hotel ND Manor with a bed, red sofa seating and a marble coffee table'),
    ],
    description: 'A room preference for families travelling together. Share your group size so the hotel can confirm a suitable room layout and occupancy.',
    detail: 'The Family Room photograph shows the sleeping area together with sofa seating, a coffee table and an in-room tea station. Share your group size when you enquire so the hotel can confirm the exact room configuration and maximum occupancy for your dates.',
    amenities: roomAmenities,
    note: 'Bed configuration and maximum occupancy can vary by room. The photograph shows a representative Family Room, and the hotel will confirm the exact room offered for your group before you book.',
  },
  {
    slug: 'royal-room',
    name: 'Royal Room',
    shortName: 'Royal',
    number: '04',
    image: photo('room-royal', 'Royal Room at Hotel ND Manor with a carved wooden bed, painted wall panels and armchairs'),
    images: [
      photo('room-royal', 'Royal Room at Hotel ND Manor with a carved wooden bed, painted wall panels and armchairs'),
    ],
    description: 'A room preference with a carved wooden bed, painted wall panels and a seating corner. Confirm the exact room offered for your dates.',
    detail: 'The Royal Room photograph shows a carved wooden bed, painted wall panels, a dressing table and a seating corner with two armchairs. Configuration and layout can vary, so the hotel will confirm the exact room offered for your stay.',
    amenities: roomAmenities,
    note: 'The Royal category name follows public travel listings. The hotel will confirm the current category name and the exact room offered before you book.',
  },
];

export const seoRoutes = [
  { path: '/', title: 'Hotel ND Manor | Hotel near Doon University, Dehradun', description: 'Discover Hotel ND Manor on Doon University Road in Mothrowala, Dehradun. Explore rooms, dining and event spaces, then send a direct reservation inquiry.' },
  { path: '/about', title: 'About Hotel ND Manor | Mothrowala, Dehradun', description: 'Learn about Hotel ND Manor, its hospitality, location on Doon University Road and the spaces that make it a convenient Dehradun stay.' },
  { path: '/rooms', title: 'Rooms & Suites | Hotel ND Manor, Dehradun', description: 'Explore Deluxe, Super Deluxe, Family and Royal room preferences at Hotel ND Manor in Mothrowala, Dehradun. Enquire directly for details and availability.' },
  { path: '/dining', title: 'Dining at Café California | Hotel ND Manor', description: 'Discover dining at Hotel ND Manor in Dehradun, including Café California, Indian cuisine and direct restaurant inquiries.' },
  { path: '/events', title: 'Banquets & Events in Dehradun | Hotel ND Manor', description: 'Plan family celebrations, wedding functions, birthdays and corporate gatherings at Hotel ND Manor on Doon University Road, Dehradun.' },
  { path: '/gallery', title: 'Photo Gallery | Hotel ND Manor, Dehradun', description: 'View genuine photographs of Hotel ND Manor, including its exterior, rooms, interiors, restaurant and banquet spaces.' },
  { path: '/contact', title: 'Contact & Location | Hotel ND Manor, Dehradun', description: 'Call, WhatsApp or get directions to Hotel ND Manor on Doon University Road, Mothrowala, Dehradun, Uttarakhand 248121.' },
  { path: '/booking', title: 'Request a Reservation | Hotel ND Manor, Dehradun', description: 'Send a direct reservation request to Hotel ND Manor with your dates, guest details and room preference through WhatsApp.' },
  { path: '/privacy', title: 'Privacy Policy | Hotel ND Manor', description: 'Read how the Hotel ND Manor website handles inquiry information, external services and your privacy choices.' },
  { path: '/terms', title: 'Terms & Conditions | Hotel ND Manor', description: 'Read the website and reservation inquiry terms for Hotel ND Manor, Dehradun.' },
  ...rooms.map((room) => ({
    path: `/rooms/${room.slug}`,
    title: `${room.name} | Hotel ND Manor, Dehradun`,
    description: `Explore the ${room.name} preference at Hotel ND Manor in Dehradun. View available information, verification notes and send a direct room inquiry.`,
  })),
];

export const getSeo = (path) => seoRoutes.find((route) => route.path === path);
