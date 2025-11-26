import type { Activity } from '../types';

export const SAMPLE_ITINERARY: Partial<Activity>[] = [
  // Day 1: Dec 12 - Arrival & Pattaya
  {
    name: "Check-in Kudos Boutique Hotel",
    description: "Located in Pratamnak Hill, quiet but close to Jomtien and South Pattaya.",
    location: "Kudos Boutique Hotel, Pattaya",
    startTime: "2024-12-12T15:00:00",
    type: "hotel",
    status: "planned"
  },
  {
    name: "Sunset at The Sky Gallery",
    description: "Enjoy sunset with a sea view. Alternative: 3 Mermaids.",
    location: "The Sky Gallery, Pattaya",
    startTime: "2024-12-12T16:30:00",
    type: "food",
    status: "planned"
  },
  {
    name: "Dinner at Pupen Seafood",
    description: "Fresh seafood at reasonable prices. Alternative: The Glass House.",
    location: "Pupen Seafood, Jomtien",
    startTime: "2024-12-12T19:00:00",
    type: "food",
    status: "planned"
  },
  {
    name: "Walking Street",
    description: "Experience the nightlife. Take a Songthaew (10 baht).",
    location: "Walking Street, Pattaya",
    startTime: "2024-12-12T21:00:00",
    type: "activity",
    status: "planned"
  },

  // Day 2: Dec 13 - Bangkok & Pratunam
  {
    name: "Check-in Hotel Ordinary Bangkok",
    description: "Located in Soi Ratchataphan, near Pe Aor and Pratunam.",
    location: "Hotel Ordinary Bangkok",
    startTime: "2024-12-13T13:30:00",
    type: "hotel",
    status: "planned"
  },
  {
    name: "Lunch at Pe Aor Tom Yum",
    description: "Famous Lobster Tom Yum. 7-10 mins walk from hotel.",
    location: "Pe Aor Tom Yum Kung Noodle",
    startTime: "2024-12-13T14:00:00",
    type: "food",
    status: "planned"
  },
  {
    name: "Shopping at Platinum Fashion Mall",
    description: "Walk around and digest lunch.",
    location: "Platinum Fashion Mall",
    startTime: "2024-12-13T16:00:00",
    type: "activity",
    status: "planned"
  },
  {
    name: "Dinner at Go Ang Pratunam",
    description: "Michelin Guide Chicken Rice (Pink Shirt).",
    location: "Go-Ang Pratunam Chicken Rice",
    startTime: "2024-12-13T18:00:00",
    type: "food",
    status: "planned"
  },
  {
    name: "Jodd Fairs Night Market",
    description: "Try the Giant Spicy Ribs (Diaw Maekhlong).",
    location: "Jodd Fairs Rama 9",
    startTime: "2024-12-13T20:00:00",
    type: "food",
    status: "planned"
  },

  // Day 3: Dec 14 - Michelin Tour
  {
    name: "Breakfast at On Lok Yun",
    description: "Traditional breakfast. Go early! Toast with egg custard.",
    location: "On Lok Yun",
    startTime: "2024-12-14T08:00:00",
    type: "food",
    status: "planned"
  },
  {
    name: "Lunch at Here Hai",
    description: "Michelin Bib Gourmand Crab Fried Rice. Must book or queue early.",
    location: "Here Hai",
    startTime: "2024-12-14T10:00:00",
    type: "food",
    status: "planned"
  },
  {
    name: "Wattana Panich",
    description: "Beef noodle soup with 50-year-old broth.",
    location: "Wattana Panich",
    startTime: "2024-12-14T12:30:00",
    type: "food",
    status: "planned"
  },
  {
    name: "Mae Varee Mango Sticky Rice",
    description: "Best mango sticky rice. Takeaway only.",
    location: "Mae Varee",
    startTime: "2024-12-14T13:30:00",
    type: "food",
    status: "planned"
  },
  {
    name: "Dinner at Thipsamai",
    description: "Pad Thai Ghost Gate. Must try the Orange Juice.",
    location: "Thipsamai",
    startTime: "2024-12-14T18:30:00",
    type: "food",
    status: "planned"
  },
  {
    name: "China Town (Yaowarat)",
    description: "Night walk and desserts.",
    location: "Yaowarat Road",
    startTime: "2024-12-14T21:00:00",
    type: "activity",
    status: "planned"
  },

  // Day 4: Dec 15 - Last Day
  {
    name: "Breakfast at Baan Kuay Tiew Ruathong",
    description: "Boat Noodles at Victory Monument.",
    location: "Boat Noodle Alley",
    startTime: "2024-12-15T09:30:00",
    type: "food",
    status: "planned"
  },
  {
    name: "Shopping at Siam Paragon / Central World",
    description: "Last minute shopping.",
    location: "Siam Paragon",
    startTime: "2024-12-15T11:00:00",
    type: "activity",
    status: "planned"
  },
  {
    name: "Lunch at Polo Fried Chicken",
    description: "Garlic Fried Chicken. Near Lumphini Park.",
    location: "Polo Fried Chicken",
    startTime: "2024-12-15T13:00:00",
    type: "food",
    status: "planned"
  },
  {
    name: "Head to Airport",
    description: "Leave early to avoid traffic.",
    location: "Suvarnabhumi Airport",
    startTime: "2024-12-15T15:30:00",
    type: "travel",
    status: "planned"
  }
];
