const item = (name, category, caption, alt) => ({
  id: name,
  category,
  caption,
  alt,
  src: `/images/${name}.webp`,
  thumbnail: `/images/${name}-thumb.webp`,
});

export const galleryCategories = ['All Photos', 'Exterior', 'Rooms', 'Interiors', 'Dining', 'Banquets'];

export const galleryItems = [
  item('exterior-hero', 'Exterior', 'A warm welcome after dusk', 'Illuminated entrance of Hotel ND Manor in the evening'),
  item('exterior-twilight', 'Exterior', 'The hotel at twilight', 'Full exterior view of Hotel ND Manor at twilight'),
  item('exterior-day', 'Exterior', 'On Doon University Road', 'Daytime exterior view of Hotel ND Manor in Dehradun'),
  item('exterior-sign', 'Exterior', 'Arriving at ND Manor', 'Hotel ND Manor name sign at the property entrance'),
  item('room-deluxe', 'Rooms', 'Deluxe Room', 'Deluxe Room at Hotel ND Manor with a bed, armchair and warm lighting'),
  item('room-deluxe-seating', 'Rooms', 'Deluxe sleeping and seating area', 'Deluxe Room at Hotel ND Manor showing its sleeping and seating area'),
  item('room-deluxe-detail', 'Rooms', 'Deluxe Room detail', 'Deluxe Room at Hotel ND Manor with a bed, armchair and side table'),
  item('room-super-deluxe', 'Rooms', 'Super Deluxe Room', 'Super Deluxe Room at Hotel ND Manor with a bed, seating and tea station'),
  item('room-super-deluxe-detail', 'Rooms', 'Super Deluxe room features', 'Super Deluxe Room at Hotel ND Manor with a sleeping area, seating and bathtub'),
  item('room-super-deluxe-prepared', 'Rooms', 'Prepared for a stay', 'Super Deluxe Room at Hotel ND Manor prepared with towels and floral decoration'),
  item('room-bathtub', 'Rooms', 'Bathtub-equipped accommodation', 'Bathtub-equipped guest room at Hotel ND Manor with a bed and seating'),
  item('room-bathtub-feature', 'Rooms', 'Bathtub and shower feature', 'Bathtub and shower area in an ND Manor guest room'),
  item('room-bathtub-detail', 'Rooms', 'A closer look inside', 'Bed, seating and wall-mounted television in a bathtub-equipped ND Manor guest room'),
  item('room-family', 'Rooms', 'Family Room', 'Family Room at Hotel ND Manor with a bed, red sofa seating and a marble coffee table'),
  item('room-royal', 'Rooms', 'Royal Room', 'Royal Room at Hotel ND Manor with a carved wooden bed, painted wall panels and armchairs'),
  item('restaurant-main', 'Dining', 'Café California', 'Dining tables and chairs inside the restaurant at Hotel ND Manor'),
  item('restaurant-interior', 'Dining', 'The dining room', 'Restaurant interior at Hotel ND Manor with chandeliers and dining tables'),
  item('restaurant-detail', 'Dining', 'Restaurant seating', 'Dining tables, patterned chairs and red seating inside Café California at Hotel ND Manor'),
  item('culinary-team', 'Dining', 'The culinary team', 'Chefs at Hotel ND Manor presenting a selection of dishes'),
  item('corridor', 'Interiors', 'Considered details', 'Guest room corridor with framed artwork at Hotel ND Manor'),
  item('lobby', 'Interiors', 'A place to pause', 'Lobby seating and interior at Hotel ND Manor'),
  item('banquet-rounds', 'Banquets', 'Gather around the table', 'Banquet hall at Hotel ND Manor arranged with round tables and chairs'),
  item('banquet-setting', 'Banquets', 'Celebration settings', 'Table setting for a celebration at Hotel ND Manor'),
  item('banquet-event', 'Banquets', 'Ready for your occasion', 'Banquet hall at Hotel ND Manor arranged with rows of chairs for a function'),
  item('banquet-stage', 'Banquets', 'A setting for milestones', 'Decorated stage for a function at Hotel ND Manor'),
  item('celebration-entrance', 'Banquets', 'A celebratory arrival', 'Decorated entrance for a celebration at Hotel ND Manor'),
];
