/**
 * Static + generated mock data for seeding the database.
 *
 * Images use picsum.photos with a stable seed per room so every
 * re-seed produces the same image for the same room (deterministic),
 * without needing any image hosting/API key of our own.
 */

const amenityPool = [
  "Free WiFi",
  "Free Breakfast",
  "Room Service",
  "Mountain View",
  "Pool Access",
];

const roomTypePricing = {
  "Single Bed": [99, 249],
  "Double Bed": [199, 399],
  "Luxury Suite": [399, 799],
  "Family Suite": [349, 649],
};

const pick = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const roomImages = (seedBase, count = 4) =>
  Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${seedBase}-${i}/800/600`);

// --- Demo hotel owners (one per couple of hotels) ---
export const ownerUsers = [
  {
    _id: "user_owner_demo_001",
    username: "Ava Thompson",
    email: "ava.owner@quickstay.demo",
    image: "https://i.pravatar.cc/150?img=47",
    role: "hotelOwner",
  },
  {
    _id: "user_owner_demo_002",
    username: "Marcus Chen",
    email: "marcus.owner@quickstay.demo",
    image: "https://i.pravatar.cc/150?img=12",
    role: "hotelOwner",
  },
  {
    _id: "user_owner_demo_003",
    username: "Priya Nair",
    email: "priya.owner@quickstay.demo",
    image: "https://i.pravatar.cc/150?img=32",
    role: "hotelOwner",
  },
];

// --- A demo regular traveler, so /api/bookings/user has something to show out of the box ---
export const demoTravelers = [
  {
    _id: "user_traveler_demo_001",
    username: "Great Stack",
    email: "user.greatstack@example.com",
    image: "https://i.pravatar.cc/150?img=5",
    role: "user",
    recentSearchedCities: ["New York", "Dubai"],
  },
];

// --- Hotels (name, city, address, contact, ownerIndex into ownerUsers) ---
export const hotelSeeds = [
  { name: "Urbanza Suites", city: "New York", address: "123 Main Street, Manhattan", contact: "+1 212 555 0148", ownerIdx: 0 },
  { name: "The Gramercy Loft", city: "New York", address: "45 Gramercy Park, Manhattan", contact: "+1 212 555 0199", ownerIdx: 1 },
  { name: "Palm Jumeirah Retreat", city: "Dubai", address: "Palm Jumeirah, Crescent Road", contact: "+971 4 555 0110", ownerIdx: 0 },
  { name: "Burj Al Arab View Hotel", city: "Dubai", address: "Sheikh Zayed Road 88", contact: "+971 4 555 0121", ownerIdx: 2 },
  { name: "Marina Bay Heights", city: "Singapore", address: "10 Bayfront Avenue", contact: "+65 6555 0177", ownerIdx: 1 },
  { name: "Sentosa Cove Villas", city: "Singapore", address: "88 Sentosa Gateway", contact: "+65 6555 0188", ownerIdx: 2 },
  { name: "The Kensington Townhouse", city: "London", address: "27 Kensington High Street", contact: "+44 20 7946 0958", ownerIdx: 0 },
  { name: "Shoreditch Loft Hotel", city: "London", address: "14 Redchurch Street", contact: "+44 20 7946 0972", ownerIdx: 1 },
  { name: "Le Marais Boutique Hotel", city: "Paris", address: "9 Rue des Archives", contact: "+33 1 42 55 01 23", ownerIdx: 2 },
  { name: "Montmartre Charm Hotel", city: "Paris", address: "22 Rue Lepic", contact: "+33 1 42 55 04 56", ownerIdx: 0 },
  { name: "Shibuya Sky Hotel", city: "Tokyo", address: "2-1 Shibuya, Shibuya City", contact: "+81 3 1234 5678", ownerIdx: 1 },
  { name: "Asakusa Traditional Inn", city: "Tokyo", address: "3-4 Asakusa, Taito City", contact: "+81 3 1234 5691", ownerIdx: 2 },
  { name: "Trastevere Garden Hotel", city: "Rome", address: "Via della Scala 12", contact: "+39 06 6789 0123", ownerIdx: 0 },
  { name: "Colosseum View Suites", city: "Rome", address: "Via Labicana 45", contact: "+39 06 6789 0456", ownerIdx: 1 },
  { name: "Gothic Quarter Hotel", city: "Barcelona", address: "Carrer del Bisbe 5", contact: "+34 93 123 4567", ownerIdx: 2 },
  { name: "Bondi Beach Resort", city: "Sydney", address: "88 Campbell Parade, Bondi", contact: "+61 2 9555 0134", ownerIdx: 0 },
  { name: "Ubud Rainforest Villas", city: "Bali", address: "Jalan Raya Ubud 21", contact: "+62 361 555 0145", ownerIdx: 1 },
  { name: "Sukhumvit Skyline Hotel", city: "Bangkok", address: "199 Sukhumvit Road", contact: "+66 2 555 0156", ownerIdx: 2 },
  { name: "Canal House Amsterdam", city: "Amsterdam", address: "Prinsengracht 263", contact: "+31 20 555 0167", ownerIdx: 0 },
  { name: "Distillery District Hotel", city: "Toronto", address: "55 Mill Street", contact: "+1 416 555 0178", ownerIdx: 1 },
];

/**
 * Builds 2-4 rooms per hotel with varied types, prices and amenities.
 * Called at seed time so prices/amenities get randomized each run.
 */
export const buildRoomsForHotel = (hotelSlug) => {
  const roomTypes = Object.keys(roomTypePricing);
  const numRooms = randomBetween(2, 4);
  const chosenTypes = pick(roomTypes, numRooms);

  return chosenTypes.map((roomType, i) => {
    const [min, max] = roomTypePricing[roomType];
    return {
      roomType,
      pricePerNight: randomBetween(min, max),
      amenities: pick(amenityPool, randomBetween(2, 4)),
      images: roomImages(`${hotelSlug}-${i}`),
      maxGuests: roomType === "Family Suite" ? 4 : roomType === "Luxury Suite" ? 3 : 2,
      description:
        `A comfortable ${roomType.toLowerCase()} featuring modern decor, ` +
        `plush bedding, and everything you need for a relaxing stay.`,
      isAvailable: true,
    };
  });
};
