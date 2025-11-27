import type { Restaurant } from '../types';

export const CURATED_RESTAURANTS: Omit<Restaurant, 'id' | 'tripId' | 'created_at'>[] = [
  {
    name: "Pe Aor Tom Yom",
    description: "Mì Tom Yum ngon hơn Je oh chula (Je oh chula quá mặn). Bát mì tom yum có tôm hùm, vẹm, tôm càng xanh, mực,... 3 người ăn chưa hết.",
    location: "68, 51 Phetchaburi Rd, Thung Phaya Thai, Ratchathewi, Bangkok 10400",
    notes: "Quán bình dân. Giá ~1tr.",
    cuisine: "Thai",
    priceRange: "$$",
    rating: 4.5,
    isTried: false,
    url: "https://www.google.com/maps/search/?api=1&query=Pe+Aor+Tom+Yom+Bangkok",
    tiktokUrl: "https://www.tiktok.com/search?q=Pe%20Aor%20Tom%20Yom%20Bangkok"
  },
  {
    name: "On Lok Yun",
    description: "Trà, bánh Toast rất ngon, hợp với người thích ăn đồ ngọt. Quán ăn sáng có tuổi đời hơn 90 năm.",
    location: "Khu China Town",
    cuisine: "Breakfast/Cafe",
    priceRange: "$",
    rating: 4.8,
    isTried: false,
    url: "https://www.google.com/maps/search/?api=1&query=On+Lok+Yun+Bangkok",
    tiktokUrl: "https://www.tiktok.com/search?q=On%20Lok%20Yun%20Bangkok"
  },
  {
    name: "Baan Kuay Tiew Ruathong",
    description: "Mỳ thuyền: bát nhỏ khoảng 12k, ăn chơi chơi mỗi người 3-4 bát :v",
    location: "Trạm BTS Victory Monument",
    cuisine: "Thai Noodle",
    priceRange: "$",
    rating: 4.5,
    isTried: false,
    url: "https://www.google.com/maps/search/?api=1&query=Baan+Kuay+Tiew+Ruathong+Bangkok",
    tiktokUrl: "https://www.tiktok.com/search?q=Baan%20Kuay%20Tiew%20Ruathong"
  },
  {
    name: "Mae Varee Mango Sticky Rice",
    description: "Xôi xoài rv bảo ngon hơn ở sân bay.",
    location: "Thong Lo Rd, Khlong Tan Nuea, Watthana, Bangkok",
    notes: "Quán chỉ bán mang về",
    cuisine: "Dessert",
    priceRange: "$$",
    rating: 4.7,
    isTried: false,
    url: "https://www.google.com/maps/search/?api=1&query=Mae+Varee+Mango+Sticky+Rice+Bangkok",
    tiktokUrl: "https://www.tiktok.com/search?q=Mae%20Varee%20Mango%20Sticky%20Rice"
  },
  {
    name: "Wattana Panich",
    description: "Quán mì bò có nồi nước dùng 50 năm không tắt bếp.",
    location: "336 Ekkamai Soi 18, đường Sukhumvit (gần trạm BTS)",
    cuisine: "Beef Noodle",
    priceRange: "$$",
    rating: 4.6,
    isTried: false,
    url: "https://www.google.com/maps/search/?api=1&query=Wattana+Panich+Bangkok",
    tiktokUrl: "https://www.tiktok.com/search?q=Wattana%20Panich%20Bangkok"
  },
  {
    name: "Go-Ang Kaomunkai Pratunam",
    description: "Cơm gà Hải Nam. Trông không có gì đặc biệt nhưng rất nổi tiếng.",
    location: "Soi 30, Pratunam",
    cuisine: "Hainanese Chicken Rice",
    priceRange: "$",
    rating: 4.3,
    isTried: false,
    url: "https://www.google.com/maps/search/?api=1&query=Go+Ang+Pratunam+Chicken+Rice",
    tiktokUrl: "https://www.tiktok.com/search?q=Go%20Ang%20Pratunam"
  },
  {
    name: "Polo Fried Chicken",
    description: "Gà chiên tỏi, gỏi đu đủ khai vị cũng ngon. Chả cá ngon nhưng hơi dầu mỡ. Có Michelin 6 năm liên tục.",
    location: "Trung tâm TP Bangkok",
    cuisine: "Thai/Isan",
    priceRange: "$$",
    rating: 4.4,
    isTried: false,
    url: "https://www.google.com/maps/search/?api=1&query=Polo+Fried+Chicken+Bangkok",
    tiktokUrl: "https://www.tiktok.com/search?q=Polo%20Fried%20Chicken%20Bangkok"
  },
  {
    name: "Laeng Saeb (Sườn Cay)",
    description: "Sườn cay khổng lồ (Quán 2 trái ớt màu đỏ).",
    location: "Chợ đêm Jodd Fairs",
    cuisine: "Thai Street Food",
    priceRange: "$$",
    rating: 4.5,
    isTried: false,
    url: "https://www.google.com/maps/search/?api=1&query=Jodd+Fairs+Spicy+Pork+Ribs",
    tiktokUrl: "https://www.tiktok.com/search?q=Jodd%20Fairs%20Spicy%20Ribs"
  },
  {
    name: "Thipsamai",
    description: "Pad Thai và nước quýt rất ngon.",
    location: "Maha Chai Rd",
    cuisine: "Pad Thai",
    priceRange: "$$$",
    rating: 4.2,
    isTried: false,
    url: "https://www.google.com/maps/search/?api=1&query=Thipsamai+Pad+Thai",
    tiktokUrl: "https://www.tiktok.com/search?q=Thipsamai%20Pad%20Thai"
  },
  {
    name: "Go-Ang (Siam Paragon)",
    description: "Mì gà / Cơm gà. Quán local, người dân ăn nhiều.",
    location: "Đối diện Siam Paragon",
    cuisine: "Thai",
    priceRange: "$",
    rating: 4.0,
    isTried: false,
    url: "https://www.google.com/maps/search/?api=1&query=Go+Ang+Siam+Paragon",
    tiktokUrl: "https://www.tiktok.com/search?q=Go%20Ang%20Siam%20Paragon"
  },
  {
    name: "Here Hai",
    description: "Cơm chiên cua siêu chất lượng.",
    location: "Ekkamai",
    cuisine: "Seafood",
    priceRange: "$$$",
    rating: 4.8,
    isTried: false,
    url: "https://www.google.com/maps/search/?api=1&query=Here+Hai+Bangkok",
    tiktokUrl: "https://www.tiktok.com/search?q=Here%20Hai%20Bangkok"
  },
  {
    name: "Rung Reung Pork Noodle",
    description: "Tom yum: bát có size. Ăn sáng, nhưng hơi xa trung tâm.",
    location: "23 Sukhumvit Road, Khlong Tan, Khlong Toei, Bangkok",
    cuisine: "Pork Noodle",
    priceRange: "$",
    rating: 4.6,
    isTried: false,
    url: "https://www.google.com/maps/search/?api=1&query=Rung+Reung+Pork+Noodle",
    tiktokUrl: "https://www.tiktok.com/search?q=Rung%20Reung%20Pork%20Noodle"
  },
  {
    name: "Sawang Noodle",
    description: "Mì cua: bát cũng nhỏ nhỏ, kiểu mì trộn, có bát nước dùng riêng. Có sao Michelin, nhưng đắt (~210k/bát).",
    location: "264 Si Phraya Rd, Maha Phruttharam, Bang Rak, Bangkok",
    cuisine: "Crab Noodle",
    priceRange: "$$$",
    rating: 4.3,
    isTried: false,
    url: "https://www.google.com/maps/search/?api=1&query=Sawang+Noodle+Bangkok",
    tiktokUrl: "https://www.tiktok.com/search?q=Sawang%20Noodle%20Bangkok"
  }
];
