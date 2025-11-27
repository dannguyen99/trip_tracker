import type { Activity } from '../types';

export const getBangkokPlan = (tripId: string, startDate?: Date): Omit<Activity, 'id' | 'created_at'>[] => {
  // Use provided start date or default to a fixed date if needed (though we should always try to pass one)
  // If no date provided, default to today to ensure visibility
  const baseDate = startDate ? new Date(startDate) : new Date();

  // Reset time to start of day to avoid shifting
  baseDate.setHours(0, 0, 0, 0);

  const getDate = (dayOffset: number, hour: number, minute: number) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + dayOffset);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
  };

  return [
    // DAY 1 - 12/12
    {
      tripId,
      name: 'Đáp sân bay (BKK/DMK)',
      description: 'Nhập cảnh, mua SIM.',
      startTime: getDate(0, 10, 0),
      endTime: getDate(0, 12, 0),
      type: 'travel',
      status: 'planned',
      icon: 'ph-airplane-landing',
      tag: 'Di chuyển',
      tagColor: 'blue'
    },
    {
      tripId,
      name: 'Di chuyển đến Pattaya',
      description: 'Bắt xe đi thẳng Pattaya (1.5 - 2 tiếng). Tip: Xe 4 chỗ hoặc van riêng tiện nhất cho nhóm 4 người.',
      startTime: getDate(0, 13, 0),
      type: 'travel',
      status: 'planned',
      icon: 'ph-van',
    },
    {
      tripId,
      name: 'Kudos Boutique Hotel',
      description: 'Khu đồi Pratamnak yên tĩnh, nối giữa Jomtien và Nam Pattaya. Cách Walking Street 5-10 phút đi xe.',
      location: 'Soi Thappraya 1, Nam Pattaya',
      startTime: getDate(0, 15, 0),
      type: 'hotel',
      status: 'planned',
      icon: 'ph-check',
      tag: 'Khách sạn',
      tagColor: 'green'
    },
    {
      tripId,
      name: 'The Sky Gallery / 3 Mermaids',
      description: 'Gần khách sạn. Ngắm hoàng hôn view biển cực đẹp.',
      startTime: getDate(0, 16, 30),
      type: 'activity',
      status: 'planned',
      icon: 'ph-coffee',
      tag: 'Sống ảo',
      tagColor: 'purple'
    },
    {
      tripId,
      name: 'Pupen Seafood / The Glass House',
      description: 'Hải sản tươi, giá hợp lý hơn Bangkok. Khu vực Jomtien.',
      startTime: getDate(0, 19, 0),
      type: 'food',
      status: 'planned',
      icon: 'ph-fish',
      tag: 'Hải sản',
      tagColor: 'orange'
    },
    {
      tripId,
      name: 'Walking Street',
      description: 'Bắt xe Songthaew (10 baht) hoặc Bolt. Trải nghiệm không khí sôi động.',
      startTime: getDate(0, 21, 0),
      type: 'activity',
      status: 'planned',
      icon: 'ph-music-notes',
      tag: 'Nightlife',
      tagColor: 'purple'
    },

    // DAY 2 - 13/12
    {
      tripId,
      name: 'Check-out Pattaya',
      description: 'Lên xe về Bangkok.',
      startTime: getDate(1, 11, 0),
      type: 'travel',
      status: 'planned',
      icon: 'ph-sign-out',
    },
    {
      tripId,
      name: 'Hotel Ordinary Bangkok',
      description: 'Lợi thế: Nằm trong ngõ Soi Ratchataphan, đi bộ được ra Pe Aor (600m) và khu Pratunam.',
      location: 'Ratchathewi',
      startTime: getDate(1, 13, 30),
      type: 'hotel',
      status: 'planned',
      icon: 'ph-check',
      tag: 'Khách sạn',
      tagColor: 'green'
    },
    {
      tripId,
      name: 'Pe Aor Tom Yum',
      description: 'Món: Tom Yum Tôm Hùm/Hải sản (bát khổng lồ).',
      location: 'Đi bộ 7-10 phút từ khách sạn',
      startTime: getDate(1, 14, 0),
      type: 'food',
      status: 'planned',
      icon: 'ph-bowl-food',
      tag: 'Must Try',
      tagColor: 'orange'
    },
    {
      tripId,
      name: 'Platinum Fashion Mall / December',
      description: 'Đi bộ tiêu cơm, mua sắm quần áo.',
      startTime: getDate(1, 16, 0),
      type: 'shopping',
      status: 'planned',
      icon: 'ph-shopping-bag',
    },
    {
      tripId,
      name: 'Go Ang Pratunam (Cơm gà Hồng)',
      description: 'Ngay gần Platinum. Xếp hàng hơi đông nhưng nhanh.',
      startTime: getDate(1, 18, 0),
      type: 'food',
      status: 'planned',
      icon: 'ph-trophy',
      tag: 'Michelin',
      tagColor: 'red'
    },
    {
      tripId,
      name: 'Jodd Fairs (Rama 9)',
      description: 'Món chính: Sườn cay khổng lồ. Món thêm: Nước lựu, kẹo dẻo thú, xiên nướng.',
      location: 'Grab hoặc MRT (Makkasan -> Rama 9)',
      startTime: getDate(1, 20, 0),
      type: 'activity',
      status: 'planned',
      icon: 'ph-moon-stars',
      tag: 'Chợ đêm',
      tagColor: 'purple'
    },

    // DAY 3 - 14/12
    {
      tripId,
      name: 'On Lok Yun (Phố Cổ)',
      description: 'Bánh mì nướng sốt trứng sữa, trà thái, trứng ốp la.',
      startTime: getDate(2, 8, 0),
      type: 'food',
      status: 'planned',
      icon: 'ph-coffee',
      tag: 'ĐI SỚM!',
      tagColor: 'red'
    },
    {
      tripId,
      name: 'Here Hai (Ekkamai)',
      description: 'Cơm chiên cua (siêu nhiều thịt), Tôm chấy tỏi. Quan trọng: Cần đặt chỗ hoặc xếp hàng sớm.',
      startTime: getDate(2, 10, 0),
      type: 'food',
      status: 'planned',
      icon: 'ph-crab',
      tag: 'Bib Gourmand',
      tagColor: 'red'
    },
    {
      tripId,
      name: 'Wattana Panich',
      description: 'Mì bò hầm với nồi nước dùng 50 năm không tắt bếp.',
      location: 'Cách Here Hai 1km',
      startTime: getDate(2, 12, 30),
      type: 'food',
      status: 'planned',
      icon: 'ph-bowl-food',
    },
    {
      tripId,
      name: 'Mae Varee (Thong Lo)',
      description: 'Xôi xoài ngon nhất nhì Bangkok. Chỉ bán mang về.',
      startTime: getDate(2, 13, 30),
      type: 'food',
      status: 'planned',
      icon: 'ph-package',
    },
    {
      tripId,
      name: 'Nghỉ ngơi',
      description: 'Về khách sạn nghỉ ngơi / Massage chân.',
      startTime: getDate(2, 15, 0),
      type: 'activity',
      status: 'planned',
      icon: 'ph-bed',
    },
    {
      tripId,
      name: 'Thipsamai Pad Thai',
      description: 'Pad Thai gói trứng & Nước cam vắt (đắt nhưng đáng tiền).',
      startTime: getDate(2, 18, 30),
      type: 'food',
      status: 'planned',
      icon: 'ph-fire',
      tag: 'Phố Cổ',
      tagColor: 'orange'
    },
    {
      tripId,
      name: 'Chinatown (Yaowarat)',
      description: 'Dạo đêm, ăn tráng miệng (chè yến, bánh bao nướng).',
      startTime: getDate(2, 21, 0),
      type: 'activity',
      status: 'planned',
      icon: 'ph-lantern',
    },

    // DAY 4 - 15/12
    {
      tripId,
      name: 'Check-out',
      description: 'Check-out, gửi hành lý tại khách sạn.',
      startTime: getDate(3, 9, 0),
      type: 'travel',
      status: 'planned',
      icon: 'ph-sign-out',
    },
    {
      tripId,
      name: 'Baan Kuay Tiew Ruathong',
      description: 'Mỳ thuyền tại Victory Monument (Ngõ Boat Noodle Alley). Ăn chồng bát (15-18 baht/bát).',
      startTime: getDate(3, 9, 30),
      type: 'food',
      status: 'planned',
      icon: 'ph-bowl-steam',
      tag: 'Gần Hotel',
      tagColor: 'green'
    },
    {
      tripId,
      name: 'Siam Paragon / Central World',
      description: 'Mua sắm tự do.',
      startTime: getDate(3, 11, 0),
      type: 'shopping',
      status: 'planned',
      icon: 'ph-bag',
    },
    {
      tripId,
      name: 'Ăn trưa',
      description: 'Option 1: Cơm gà Hải Nam (Kuang Heng). Option 2: Polo Fried Chicken (Gà chiên tỏi).',
      startTime: getDate(3, 13, 0),
      type: 'food',
      status: 'planned',
      icon: 'ph-fork-knife',
    },
    {
      tripId,
      name: 'Ra sân bay',
      description: 'Lấy hành lý (15:00) -> Ra sân bay (15:30) -> Bay về Hà Nội (18:00/20:00).',
      startTime: getDate(3, 15, 0),
      type: 'travel',
      status: 'planned',
      icon: 'ph-airplane-takeoff',
    }
  ];
};
