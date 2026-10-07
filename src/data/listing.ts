/**
 * All listing content, read off the reference page (docs/reference/page.html). Components pull from
 * here so copy, prices and photo paths live in one place.
 */
import type { IconName } from '../components/icons.generated';

export interface Photo { idx: number; src: string; room: string }
export interface Room { id: string; name: string; amenities: string[]; photos: Photo[] }
export interface Amenity { icon: IconName; label: string; unavailable?: boolean }
export interface Review {
  name: string; tenure: string; date: string; text: string; rating: number;
  avatar?: string; initial?: { letter: string; bg: string; color: string };
}

const img = (id: string) => `/assets/images/${id}.jpeg`;

/** Photo tour rooms, in order. `idx` is the global photo index used by the lightbox and the URL. */
const roomSpecs: Array<{ name: string; amenities: string[]; ids: string[] }> = [
  { name: 'Living room 1', amenities: ['Sofa', 'Air conditioning', 'Ceiling fan', 'TV'],
    ids: ['a9831aeb-f441-44f5-a38f-4cf54e3f0fcf', 'a45feaa2-b607-4092-83ac-5fd4b2894959', 'f1da1c3d-0d10-481e-9b63-c71f9073f30b'] },
  { name: 'Living room 2', amenities: ['Ceiling fan', 'Hot tub'],
    ids: ['090d8b0b-b539-42c0-84f8-e1fb0cdf9a93', '9be71047-fc52-438a-9270-75cb470f6752', 'f6de1663-4e9c-4414-b63b-29a154a92ee1',
      '2367476f-11c4-4a14-a7c6-267be62c1d59', '34529829-a971-44d3-ac2f-90ea3678a34d', '153aa732-4935-48b8-a6fe-b469b6af5efc',
      '3c6e6809-1bb1-47a6-8e24-aff593e1c28f'] },
  { name: 'Full kitchen', amenities: ['Freezer', 'Fridge', 'Blender', 'Cooker', 'Cooking basics', 'Kettle', 'Microwave', 'Toaster',
      'Wine glasses', 'Coffee', 'Crockery and cutlery'],
    ids: ['56c44812-52c0-4481-90d8-101ec1f34c7a', 'ddc853d7-e658-405c-bedc-8f31106c447e'] },
  { name: 'Bedroom', amenities: ['Double bed', 'Air conditioning', 'Bed linen', 'Ceiling fan', 'Clothes storage', 'Cot', 'Hangers', 'Iron',
      'Room-darkening blinds', 'Cleaning available during stay', 'Cleaning products', 'Long-term stays allowed', 'Private entrance', 'Wifi'],
    ids: ['67c61c6f-6260-4809-9510-0360e58a345d', '1c827136-4a85-4fe0-8e69-3fd8ea19bb17', '0622ab42-b851-4d55-9d9f-df3143bc5909',
      'a74e3c0b-3188-4442-9146-1cd4d6ea45df', '48a8ffbc-fbf7-4f84-bc29-ee400da3f08b', '3cf31697-f3f3-4c60-82c4-029acb119ae4'] },
  { name: 'Full bathroom', amenities: ['Hairdryer', 'Hot water', 'Shampoo', 'Shower gel'],
    ids: ['97c78f8a-5090-4663-aebc-ba4e13b47092'] },
  { name: 'Gym', amenities: ['Air conditioning', 'Gym', 'Exercise equipment', 'Ceiling fan'],
    ids: ['9aa8e65f-94ac-4ba0-9a10-9ec91e536d22', '246bd88d-4dd6-4117-a401-02a36ebfcf16', '4fede77d-7a71-446f-89e3-263af937f3fa',
      '79f59adb-5a5f-4d6c-8109-1f01f4ca0d03', 'f19d8c0a-1d88-42a4-9218-686d4f0db7e4'] },
  { name: 'Exterior', amenities: [],
    ids: ['23ea6621-6f74-4baa-acea-2fd03e312b41', '5adfdf3e-d497-4efc-ab8c-fc559dab311e', '608748cd-6ee7-4a71-88a2-ba79d3ddba5a',
      '5b856fde-a393-41bf-b373-c9d02e64221f', 'c904e1ab-a39d-4ef0-bdea-8c0bd16b9e3d', '42befad7-fb29-473d-91db-b03e7a544d1d'] },
  { name: 'Pool', amenities: ['Pool'],
    ids: ['fc02f48f-a937-42c5-895d-f9cc3113d6ca', '929545d3-e241-46c0-8a70-c24531ce7b54', '8eb65a8b-e795-4870-b141-6f63b1be24ae'] },
  { name: 'Additional photos', amenities: [],
    ids: ['70325367-cbae-4993-b560-18cd3f6edd53', 'cc7a56bd-242c-498a-9aef-0cffac619e54', '30ad93b2-293f-494d-b645-626303c6cb93',
      '9642a60d-e9de-4e1a-89c2-9ebd230f4a74', 'b6599f26-d65c-4df0-baf2-ef18c82a86a3', 'dc01fd46-b119-48d3-a43b-f6c093e26eca',
      'fe37b80e-da8a-4225-b27b-dfbb5d763c01', '3c90338e-86b4-423f-aae1-279e0ccc3a18', '862d936c-0f34-4e50-af87-b519e2781d19',
      '79addceb-8c2d-419b-80ff-e29af426a94c'] },
];

let counter = 0;
export const rooms: Room[] = roomSpecs.map((r, i) => ({
  id: `tour-room-${i}`,
  name: r.name,
  amenities: r.amenities,
  photos: r.ids.map((id) => ({ idx: counter++, src: img(id), room: r.name })),
}));

export const allPhotos: Photo[] = rooms.flatMap((r) => r.photos);
export const roomOfPhoto = (idx: number): Room => rooms.find((r) => r.photos.some((p) => p.idx === idx)) ?? rooms[0];

/**
 * Tour rows: photos alternate between a full-width row and a two-up row, except that a remainder of
 * exactly two photos always shares a row (matches the reference's layout for every room).
 */
export function tourRows(photos: Photo[]): Photo[][] {
  const rows: Photo[][] = [];
  let i = 0, wide = true;
  while (i < photos.length) {
    const take = photos.length - i === 2 ? 2 : wide ? 1 : 2;
    rows.push(photos.slice(i, i + take));
    i += take; wide = !wide;
  }
  return rows;
}

/** Five hero tiles, by global photo index (reference order). */
export const heroPhotos: Photo[] = [6, 3, 4, 12, 28].map((idx) => allPhotos[idx]);

export const listing = {
  title: 'Romantic Jacuzzi 1BHK Candolim | Mirashya UG10',
  pageTitle: 'Romantic Jacuzzi 1BHK Candolim | Mirashya UG10 - Serviced apartments for Rent in Candolim, Goa, India - Airbnb',
  subtitle: 'Entire serviced apartment in Candolim, India',
  capacity: '3 guests · 1 bedroom · 1 bed · 1 bathroom',
  rating: '4.95',
  reviewCount: 19,
  price: '₹28,499',
  priceQualifier: 'for 5 nights',
  nights: '5 nights in Candolim',
  dateRange: '18 Oct 2026 - 23 Oct 2026',
  checkIn: '10/18/2026',
  checkOut: '10/23/2026',
  guests: '2 guests',
  freeCancellationBefore: '17 October',
  host: { name: 'Mirashya Homes', avatar: '/assets/images/avatars/host.jpeg', tenure: '2 years hosting',
    reviews: '1,463', rating: '4.68★', years: '2', facts: [
      { icon: 'cake' as IconName, text: 'Born in the 80s' },
      { icon: 'school' as IconName, text: 'Where I went to school: NICMAR GOA' },
    ], responseRate: 'Response rate: 100%', responseTime: 'Responds within an hour' },
  guestFavourite: {
    label: ['Guest', 'favourite'],
    blurb: 'One of the most loved homes on Airbnb, according to guests',
  },
  highlights: [
    { icon: 'outdoor' as IconName, title: 'Outdoor entertainment', body: 'The pool and alfresco dining are great for summer trips.' },
    { icon: 'fan' as IconName, title: 'Designed for staying cool', body: 'Beat the heat with the A/C and ceiling fan.' },
    { icon: 'door' as IconName, title: 'Self check-in', body: 'You can check in with the building staff.' },
  ],
  translationNote: 'Some info has been automatically translated.',
  description: '🌴 Plan Your Relaxing Holiday at Amor De Goa by Mirashya Homes! ✨ Stay in this cozy 1BHK in the heart of Candolim, featuring a private jacuzzi 🛁 for the perfect unwind. Enjoy high-speed WiFi 💻, Smart TV 📺, pet-friendly comfort 🐾, and stylish interiors. Just minutes from Candolim Beach 🏖️, popular cafés, restaurants, and nightlife 🍹, it’s ideal for couples seeking romance, relaxation, and a touch of luxury in North Goa. ❤️🌴',
  sleep: [
    { photo: img('67c61c6f-6260-4809-9510-0360e58a345d'), title: 'Bedroom', sub: '1 double bed' },
    { photo: img('a9831aeb-f441-44f5-a38f-4cf54e3f0fcf'), title: 'Living room', sub: '1 sofa' },
  ],
  amenityCount: 50,
  location: {
    place: 'Candolim, Goa, India',
    note: 'Exact location will be provided after booking.',
    highlightsTitle: 'Neighbourhood highlights',
    highlights: 'Located in the heart of Candolim, Amor de Goa offers a peaceful stay with easy access to beaches, cafés, and popular attractions.',
  },
  cohosts: [
    { name: 'Sharath', avatar: '/assets/images/avatars/co1.jpg' },
    { name: 'Aman Dev Pahwa', avatar: '/assets/images/avatars/co2.jpg' },
    { name: 'Maria Karen Priyanka', avatar: '/assets/images/avatars/co3.jpg' },
    { name: 'Simran', avatar: '/assets/images/avatars/rev5.jpeg' },
    { name: 'Pallavi', avatar: '/assets/images/avatars/rev1.jpeg' },
    { name: 'Sanyukta', avatar: '/assets/images/avatars/rev2.jpeg' },
    { name: 'Shruti', initial: { letter: 'S', bg: 'rgb(253, 231, 239)', color: 'rgb(212, 53, 110)' } },
    { name: 'Amisha', initial: { letter: 'A', bg: 'rgb(231, 240, 253)', color: 'rgb(58, 110, 204)' } },
  ],
  paymentWarning: 'To help protect your payment, always use Airbnb to send money and communicate with hosts.',
  thingsToKnow: [
    { icon: 'calendar' as IconName, title: 'Cancellation policy', lines: [
      'Free cancellation before 17 October. Cancel before check-in on 18 October for a partial refund.',
      'Review this host’s full policy for details.'] },
    { icon: 'key' as IconName, title: 'House rules', lines: ['Check-in after 2:00 pm', 'Checkout before 11:00 am', '3 guests maximum'] },
    { icon: 'shield' as IconName, title: 'Safety & property', lines: [
      'Carbon monoxide alarm not reported', 'Smoke alarm not reported', 'Exterior security cameras on property'] },
  ],
};

/** Labels and static UI strings, kept out of the components for the same reason as the listing data. */
export const ui = {
  skipToContent: 'Skip to content',
  header: { logo: 'Airbnb homepage', where: 'Anywhere', when: 'Anytime', who: 'Add guests', search: 'Search',
    becomeHost: 'Become a host', language: 'Choose a language and currency', menu: 'Main navigation menu' },
  share: 'Share',
  save: 'Save',
  saved: 'Saved',
  showAllPhotos: 'Show all photos',
  showMore: 'Show more',
  showLess: 'Show less',
  showOriginal: 'Show original',
  hostedBy: (name: string) => `Hosted by ${name}`,
  sleepTitle: "Where you'll sleep",
  amenitiesTitle: 'What this place offers',
  showAllAmenities: (n: number) => `Show all ${n} amenities`,
  clearDates: 'Clear dates',
  booking: { promo: 'Get 10% off your next stay.', promoTerms: 'Terms apply', claim: 'Claim',
    checkIn: 'CHECK-IN', checkOut: 'CHECKOUT', guests: 'GUESTS', freeCancellation: 'Free cancellation before',
    reserve: 'Reserve', noCharge: "You won't be charged yet", report: 'Report this listing' },
  reviews: { favourite: 'Guest favourite',
    favouriteBlurb: 'This home is a guest favourite based on ratings, reviews and reliability',
    howItWorks: 'How reviews work', overall: 'Overall rating', reviewsLabel: 'Reviews',
    showAll: (n: number) => `Show all ${n} reviews` },
  location: { title: 'Where you’ll be' },
  host: { title: 'Meet your host', role: 'Host', reviewsLabel: 'Reviews', ratingLabel: 'Rating',
    yearsLabel: 'Years hosting', coHosts: 'Co-Hosts', details: 'Host details', message: 'Message host' },
  thingsToKnow: { title: 'Things to know', learnMore: 'Learn more' },
  similar: { title: 'More stays nearby', prev: 'Previous', next: 'Next' },
  tour: { title: 'Photo tour', back: 'Back', categories: 'Photo categories' },
  lightbox: { title: 'Photo viewer', close: 'Close', prev: 'Previous', next: 'Next', backToTour: 'Back to photo tour',
    counter: (n: number, total: number) => `${n} of ${total}` },
  imageLabel: (n: number) => `${listing.title} image ${n}`,
  sections: 'Listing sections',
  photosLabel: 'Photos of this place',
};

export const topAmenities: Amenity[] = [
  { icon: 'kitchen', label: 'Kitchen' }, { icon: 'wifi', label: 'Wifi' }, { icon: 'workspace', label: 'Dedicated workspace' },
  { icon: 'parking', label: 'Free parking on premises' }, { icon: 'pool', label: 'Pool' }, { icon: 'hotTub', label: 'Hot tub' },
  { icon: 'pets', label: 'Pets allowed' }, { icon: 'camera', label: 'Exterior security cameras on property' },
  { icon: 'coAlarm', label: 'Carbon monoxide alarm', unavailable: true }, { icon: 'smokeAlarm', label: 'Smoke alarm', unavailable: true },
];

export const amenityGroups: Array<{ title: string; items: Amenity[] }> = [
  { title: 'Bathroom', items: [
    { icon: 'hairdryer', label: 'Hairdryer' }, { icon: 'cleaningProducts', label: 'Cleaning products' }, { icon: 'shampoo', label: 'Shampoo' },
    { icon: 'hotWater', label: 'Hot water' }, { icon: 'showerGel', label: 'Shower gel' }] },
  { title: 'Bedroom and laundry', items: [
    { icon: 'washer', label: 'Washing machine' }, { icon: 'hangers', label: 'Hangers' }, { icon: 'bedLinen', label: 'Bed linen' },
    { icon: 'blinds', label: 'Room-darkening blinds' }, { icon: 'iron', label: 'Iron' }, { icon: 'wardrobe', label: 'Clothes storage' },
    { icon: 'cot', label: 'Cot' }] },
  { title: 'Entertainment', items: [{ icon: 'tv', label: 'TV' }] },
  { title: 'Family', items: [{ icon: 'cot', label: 'Cot' }] },
  { title: 'Heating and cooling', items: [{ icon: 'ac', label: 'Air conditioning' }, { icon: 'fan', label: 'Ceiling fan' }] },
  { title: 'Home safety', items: [
    { icon: 'camera', label: 'Exterior security cameras on property' },
    { icon: 'coAlarm', label: 'Carbon monoxide alarm', unavailable: true }, { icon: 'smokeAlarm', label: 'Smoke alarm', unavailable: true }] },
  { title: 'Internet and office', items: [{ icon: 'wifi', label: 'Wifi' }, { icon: 'workspace', label: 'Dedicated workspace' }] },
  { title: 'Kitchen and dining', items: [
    { icon: 'kitchen', label: 'Kitchen' }, { icon: 'fridge', label: 'Fridge' }, { icon: 'fridge', label: 'Freezer' },
    { icon: 'microwave', label: 'Microwave' }, { icon: 'kitchen', label: 'Cooking basics' }, { icon: 'cutlery', label: 'Crockery and cutlery' },
    { icon: 'kettle', label: 'Kettle' }, { icon: 'coffee', label: 'Coffee' }, { icon: 'wine', label: 'Wine glasses' },
    { icon: 'toaster', label: 'Toaster' }, { icon: 'blender', label: 'Blender' }, { icon: 'cooker', label: 'Cooker' }] },
  { title: 'Location features', items: [{ icon: 'entrance', label: 'Private entrance' }] },
  { title: 'Outdoor', items: [{ icon: 'patio', label: 'Patio or balcony' }, { icon: 'outdoorDining', label: 'Outdoor dining area' }] },
  { title: 'Parking and facilities', items: [
    { icon: 'parking', label: 'Free parking on premises' }, { icon: 'pool', label: 'Pool' }, { icon: 'hotTub', label: 'Hot tub' },
    { icon: 'gym', label: 'Gym' }] },
  { title: 'Services', items: [
    { icon: 'pets', label: 'Pets allowed' }, { icon: 'spray', label: 'Cleaning available during stay' },
    { icon: 'longTerm', label: 'Long-term stays allowed' }, { icon: 'door', label: 'Self check-in' }] },
];

/** Two static months, exactly as rendered by the reference (October/November 2026). */
export const calendar = {
  months: [
    { title: 'October 2026', leadingBlanks: 4, days: 31, checkIn: 18, checkOut: 23, disabled: [] as number[] },
    { title: 'November 2026', leadingBlanks: 0, days: 30, disabled: [18, 19, 20, 21, 22, 23, 24, 29, 30] },
  ],
  weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};

export const ratings = {
  overall: '4.95',
  distribution: [95, 5, 0, 0, 0], // 5 → 1 stars, percent
  categories: [
    { label: 'Cleanliness', value: '5.0', icon: 'spray' as IconName }, { label: 'Accuracy', value: '5.0', icon: 'checkCircle' as IconName },
    { label: 'Check-in', value: '5.0', icon: 'key' as IconName }, { label: 'Communication', value: '5.0', icon: 'chat' as IconName },
    { label: 'Location', value: '4.8', icon: 'map' as IconName }, { label: 'Value', value: '4.8', icon: 'tag' as IconName },
  ],
  chips: [
    { icon: 'comfort', label: 'Comfort', count: 6 }, { icon: 'accuracy', label: 'Accuracy', count: 5 }, { icon: 'hot-tub', label: 'Hot tub', count: 5 },
    { icon: 'condition', label: 'Condition', count: 4 }, { icon: 'hospitality', label: 'Hospitality', count: 8 },
    { icon: 'cleanliness', label: 'Cleanliness', count: 4 }, { icon: 'amenities', label: 'Amenities', count: 2 }, { icon: 'decor', label: 'Decor', count: 2 },
    { icon: 'indoor-spaces', label: 'Indoor spaces', count: 2 }, { icon: 'location', label: 'Location', count: 2 },
  ].map((c) => ({ ...c, icon: `/assets/images/chips/${c.icon}.png` })),
};

export const reviews: Review[] = [
  { name: 'Amit', tenure: '2 months on Airbnb', date: '1 week ago', rating: 5, initial: { letter: 'A', bg: 'rgb(247, 237, 226)', color: 'rgb(193, 133, 42)' },
    text: 'Very helpful and responsive team. Safe and peaceful stay. loved everything about the property.' },
  { name: 'Aheesh', tenure: '3 years on Airbnb', date: '2 weeks ago', rating: 5, avatar: '/assets/images/avatars/rev1.jpeg',
    text: 'We had a wonderful stay. The apartment was clean, comfortable, and exactly as shown in the photos. The host was very responsive and helpful throughout our stay. We would definitely recommend this place and would love to stay here again.' },
  { name: 'Samiksha', tenure: '8 months on Airbnb', date: 'May 2026', rating: 5, avatar: '/assets/images/avatars/rev2.jpeg',
    text: 'the host nitish was really great help' },
  { name: 'Vedant', tenure: '4 years on Airbnb', date: 'May 2026', rating: 5, initial: { letter: 'V', bg: 'rgb(239, 234, 247)', color: 'rgb(139, 111, 196)' },
    text: 'We had an amazing stay at this property in Goa! The entire home was spotless and exceptionally well-maintained, making us feel comfortable from the moment we arrived. The cleanliness standards were truly impressive, with every corner of the house looking fresh and pristine.\nThe highlight of our stay was definitely the jacuzzi. It was clean, well-kept, and the perfect place to relax after a day of exploring Goa. It added a luxurious touch to our vacation and made our experience even more memorable.\nThe property was exactly as described, well-equipped, and offered a peaceful atmosphere. We would highly recommend this place to anyone looking for a comfortable, clean, and relaxing stay in Goa. Looking forward to visiting again!' },
  { name: 'Vaibhav S', tenure: '3 years on Airbnb', date: 'May 2026', rating: 5, avatar: '/assets/images/avatars/rev3.jpeg',
    text: "Great great experience living out there , can't expect more , will always look for it in the future and will recommend my friends too." },
  { name: 'Mohd', tenure: '5 years on Airbnb', date: 'May 2026', rating: 5, avatar: '/assets/images/avatars/rev4.jpeg',
    text: 'Great place. Exactly as described in the listing.' },
];

/** Reviews long enough for the reference to clamp them to 4 lines behind a "Show more" button. */
export const CLAMP_THRESHOLD = 180;

export const similarStays = [
  { img: '/assets/images/similar/s1.jpeg', title: 'Beautiful Studio with a view to die for', price: '₹23,600', rating: '4.91' },
  { img: '/assets/images/similar/s2.jpeg', title: 'NAQAB - 1bhk with private pool', price: '₹42,218', rating: '4.95' },
  { img: '/assets/images/similar/s3.jpeg', title: 'Greentique Luxury Flat with plunge pool, Calangute', price: '₹44,506', rating: '4.94' },
  { img: '/assets/images/similar/s4.jpeg', title: 'The Tropical Studio | 5 mins to Beach', price: '₹22,824', rating: '4.96' },
  { img: '/assets/images/similar/s5.jpeg', title: 'Luxury Casa Bella 1BHK with plunge pool, Calangute', price: '₹39,942', rating: '4.95' },
  { img: '/assets/images/similar/s6.jpeg', title: 'Kanso by Earthen Window | Jacuzzi | Terrace | Pool', price: '₹45,648', rating: '5.0' },
  { img: '/assets/images/similar/s2.jpeg', title: 'Luxury Apt | Private Pool | 6 Mins from Beach', price: '₹48,786', rating: '4.93' },
  { img: '/assets/images/similar/s4.jpeg', title: 'Serendipity Cottage - Calm Stay in Calangute-Baga.', price: '₹22,824', rating: '4.92' },
];

export const sectionNav = [
  { id: 'photos', label: 'Photos' }, { id: 'amenities', label: 'Amenities' },
  { id: 'reviews', label: 'Reviews' }, { id: 'location', label: 'Location' },
];

export const toasts = {
  saved: 'Saved to wishlist',
  removed: 'Removed from wishlist',
  share: 'Share options',
  reserve: "You won't be charged yet",
};
