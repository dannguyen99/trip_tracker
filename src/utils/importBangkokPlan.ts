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
      name: 'HẠ CÁNH & DI CHUYỂN',
      description: 'Nhập cảnh: Sân bay Suvarnabhumi (BKK) hoặc Don Mueang (DMK).\nSIM/Internet: Mua SIM truimph ở sân bay (~299 baht/8 ngày).\nĂn trưa nhanh: Magic Food Point (tầng 1 BKK) hoặc Food court (T2 DMK). Cơm gà/hủ tiếu (60-80 baht) hoặc Cơm nắm 7-Eleven.',
      location: 'Suvarnabhumi / Don Mueang -> Pattaya',
      startTime: getDate(0, 10, 0),
      endTime: getDate(0, 13, 0),
      type: 'travel',
      status: 'planned',
      icon: 'ph-airplane-landing',
      tag: 'Di chuyển',
      tagColor: 'blue',
      tips: 'Book trước xe 7 chỗ (1300-1500 baht) đón sân bay. Đừng đợi xuống mới bắt taxi.'
    },
    {
      tripId,
      name: 'CHECK-IN KUDOS BOUTIQUE HOTEL',
      description: 'Khu đồi Pratamnak (Soi Thappraya 1). Yên tĩnh, đường dốc.\nLưu ý: Chuẩn bị 1000-2000 THB tiền cọc. Kiểm tra kỹ minibar/khăn.\nNghỉ ngơi, thay đồ đẹp style biển để đi cafe.',
      location: 'Kudos Boutique Hotel',
      startTime: getDate(0, 15, 0),
      endTime: getDate(0, 16, 0),
      type: 'hotel',
      status: 'planned',
      icon: 'ph-bed',
      tag: 'Check-in',
      tagColor: 'green'
    },
    {
      tripId,
      name: 'SỐNG ẢO HOÀNG HÔN (Sky Gallery / 3 Mermaids)',
      description: 'Sky Gallery: Vibe chill, ngồi bệt bãi cỏ.\n3 Mermaids: Vibe sang chảnh, tổ chim, tượng nàng tiên cá.\nGọi món: Chỉ nên gọi nước/đồ ăn nhẹ (Kem dừa Sky Gallery ngon).',
      location: 'Pratamnak Hill (Near Hotel)',
      startTime: getDate(0, 16, 30),
      endTime: getDate(0, 18, 0),
      type: 'activity',
      status: 'planned',
      icon: 'ph-sun-horizon',
      tag: 'Sống ảo',
      tagColor: 'orange',
      tips: 'Mặt trời lặn lúc 17:45. Đến lúc 16:30 để xí chỗ sát biển.'
    },
    {
      tripId,
      name: 'ALCAZAR CABARET SHOW',
      description: 'Show kéo dài 70 phút. Nhạc Việt, K-pop, múa truyền thống.\nĐổi vé: Mang voucher điện thoại đổi vé giấy trước 15p.',
      location: 'Alcazar Cabaret (Bắc Pattaya)',
      startTime: getDate(0, 18, 30),
      endTime: getDate(0, 19, 40),
      type: 'activity',
      status: 'planned',
      icon: 'ph-sparkle',
      tag: 'Show',
      tagColor: 'pink',
      tips: 'Chụp ảnh với vũ công: Tip bắt buộc 100 Baht/người. Cẩn thận bị ké ảnh đòi tiền.'
    },
    {
      tripId,
      name: 'ĂN TỐI TẠI PUPEN SEAFOOD',
      description: 'Quán hải sản quốc dân. Tươi, nhanh, giá niêm yết.\nMust-Order: Cua thịt xào cà ri (đỉnh chóp), Tôm càng xanh nướng (1kg), Cá chẽm chiên nước mắm, Mực trứng hấp chanh.',
      location: 'Jomtien Beach (Cuối bãi)',
      startTime: getDate(0, 20, 0),
      endTime: getDate(0, 21, 30),
      type: 'food',
      status: 'planned',
      icon: 'ph-fork-knife',
      tag: 'Must Try',
      tagColor: 'red',
      rating: 5
    },
    {
      tripId,
      name: 'WALKING STREET & VỀ NGỦ',
      description: 'Đi dạo phố, cảm nhận sự điên rồ.\nBar: Candy Shop / Lucifer (Live Band).\nSCAM ALERT: Tuyệt đối không đi theo cò mồi "Ping Pong Show" (bị ép uống bia giá cắt cổ).',
      location: 'Walking Street',
      startTime: getDate(0, 22, 0),
      endTime: getDate(0, 23, 30),
      type: 'activity',
      status: 'planned',
      icon: 'ph-beer-bottle',
      tag: 'Nightlife',
      tagColor: 'indigo'
    },

    // DAY 2 - 13/12
    {
      tripId,
      name: 'CHUẨN BỊ CHO NGÀY 2',
      description: 'Trang phục: Mặc đồ đẹp, trendy (style Hàn Quốc/Y2K) để chụp ảnh Siam Square. Mang giày êm chân.\nPin dự phòng: Cực kỳ quan trọng.\nKhăn giấy ướt: Để lau tay sau khi ăn sườn cay.',
      startTime: getDate(1, 10, 0),
      endTime: getDate(1, 11, 0),
      type: 'activity',
      status: 'planned',
      icon: 'ph-backpack',
      tag: 'Chuẩn bị',
      tagColor: 'gray'
    },
    {
      tripId,
      name: 'TẠM BIỆT PATTAYA & VỀ BANGKOK',
      description: '11:00: Check-out Kudos Hotel (nhận lại deposit).\nDi chuyển: Xe riêng đón về Bangkok (~2 tiếng). Ghé 7-Eleven mua đồ ăn vặt.\n13:30: Check-in Hotel Ordinary Bangkok (Soi Ratchataphan). Lưu ý: Khách sạn có mì gói/snack miễn phí ở sảnh.',
      location: 'Pattaya -> Bangkok',
      startTime: getDate(1, 11, 0),
      endTime: getDate(1, 13, 30),
      type: 'travel',
      status: 'planned',
      icon: 'ph-van',
      tag: 'Di chuyển',
      tagColor: 'blue',
      tips: 'Bảo tài xế ghé 7-Eleven. Tranh thủ ngủ lấy sức.'
    },
    {
      tripId,
      name: 'ĂN TRƯA: PE AOR TOM YUM KUNG',
      description: 'Quán "Must-try" (đi bộ 600m từ khách sạn).\nOrder: "Tom Yum Lobster" (1200-1500 THB) - Ngôi sao sống ảo. Bát khổng lồ gồm tôm hùm, cua, cá hồi..\nHoặc: Cơm trứng tráng thịt cua.\nLưu ý: Quán nghỉ trưa lúc 15:00, phải đến trước 14:30.',
      location: 'Pe Aor Tom Yum Kung',
      startTime: getDate(1, 14, 0),
      endTime: getDate(1, 15, 0),
      type: 'food',
      status: 'planned',
      icon: 'ph-bowl-food',
      tag: 'Must Try',
      tagColor: 'red',
      rating: 5
    },
    {
      tripId,
      name: 'TOUR SỐNG ẢO (SIAM SQUARE & CENTRAL WORLD)',
      description: 'Lộ trình Check-in "Chanh Sả" (thay vì Platinum):\n1. Gentlewoman (Siam Square): Mua túi Tote, cafe.\n2. Daddy & The Muscle Academy: Chụp Photo Booth (180-200 baht) - Must Do!\n3. Skywalk & Apple Central World: Kiến trúc "cây nấm".',
      location: 'Siam Square',
      startTime: getDate(1, 15, 30),
      endTime: getDate(1, 18, 0),
      type: 'activity',
      status: 'planned',
      icon: 'ph-camera',
      tag: 'Sống ảo',
      tagColor: 'pink',
      tips: 'Mặc đồ trendy (Style Hàn Quốc/Y2K).'
    },
    {
      tripId,
      name: 'ĂN TỐI: GO ANG PRATUNAM (MICHELIN)',
      description: 'Cơm gà Hải Nam áo hồng. Xếp hàng 20-30p (Cử 1 bạn nam lấy số).\nMón: Cơm gà luộc (mềm mọng), Canh khổ qua sườn (Xuất sắc!), Lòng gà, Tiết gà.\nNước sốt Nam Jim là linh hồn.',
      location: 'Go Ang Pratunam',
      startTime: getDate(1, 18, 30),
      endTime: getDate(1, 20, 0),
      type: 'food',
      status: 'planned',
      icon: 'ph-trophy',
      tag: 'Michelin',
      tagColor: 'green'
    },
    {
      tripId,
      name: 'NIGHTLIFE: JODD FAIRS & SOI COWBOY',
      description: 'Tăng 1: Jodd Fairs (MRT Phra Ram 9). Ăn Sườn cay khổng lồ (Diaw Maekhlong), Kem dừa.\nTăng 2: Soi Cowboy (MRT Sukhumvit). Vào Crazy House hoặc Country Road. An toàn.\nQuy tắc: KHÔNG CHỤP ẢNH trong bar. Chỉ uống bia chai. Không đi theo "Ping Pong Show".',
      location: 'Jodd Fairs -> Soi Cowboy',
      startTime: getDate(1, 20, 30),
      endTime: getDate(1, 23, 30),
      type: 'activity',
      status: 'planned',
      icon: 'ph-beer-bottle',
      tag: 'Nightlife',
      tagColor: 'purple',
      tips: 'Sườn cay: Nhớ đeo găng tay nilon + khăn giấy ướt.'
    },
    {
      tripId,
      name: 'VỀ KHÁCH SẠN',
      description: 'Bắt Grab/Bolt từ Asok về Hotel Ordinary (100-150 baht).\nKết thúc ngày thứ 2 rực rỡ.',
      location: 'Soi Cowboy -> Hotel Ordinary',
      startTime: getDate(1, 23, 30),
      endTime: getDate(2, 0, 0),
      type: 'travel',
      status: 'planned',
      icon: 'ph-moon-stars',
    },

    // DAY 3 - 14/12
    {
      tripId,
      name: 'CHUẨN BỊ CHO NGÀY 3',
      description: 'Tiền mặt: Quan trọng (TukTuk, vé phà, thuê đồ Thái).\nNước uống: Mang theo chai nước.\nGiày: Giày thể thao/sandal êm chân để đi bộ.',
      startTime: getDate(2, 7, 0),
      endTime: getDate(2, 7, 30),
      type: 'activity',
      status: 'planned',
      icon: 'ph-backpack',
      tag: 'Chuẩn bị',
      tagColor: 'gray'
    },
    {
      tripId,
      name: 'ĂN SÁNG: ON LOK YUN',
      description: 'Quán ăn sáng kiểu Thái-Hoa cổ điển 90 năm.\nCombo: Kaya Toast, French Toast, Trà sữa Thái.\nMục tiêu: Ăn nhanh, xong lúc 8:30.',
      location: 'Phố Cổ (Old Town)',
      startTime: getDate(2, 7, 30),
      endTime: getDate(2, 8, 30),
      type: 'food',
      status: 'planned',
      icon: 'ph-coffee',
      tag: 'Cổ điển',
      tagColor: 'orange',
    },
    {
      tripId,
      name: 'LEO CHÙA NÚI VÀNG (WAT SAKET)',
      description: 'Vận động tiêu cơm, leo 344 bậc thang (dễ đi).\nNgắm toàn cảnh Bangkok 360 độ, rung chuông cầu may.\nCách On Lok Yun 5-10 phút đi bộ/TukTuk.',
      location: 'Wat Saket',
      startTime: getDate(2, 8, 30),
      endTime: getDate(2, 9, 30),
      type: 'activity',
      status: 'planned',
      icon: 'ph-mountains',
      tag: 'Vận động',
      tagColor: 'green',
      tips: 'Vé tham quan: 100 Baht/người.'
    },
    {
      tripId,
      name: 'DI CHUYỂN SANG EKKAMAI',
      description: 'Bắt Grab/Bolt từ Wat Saket đi Here Hai (30-40 phút).\nNghỉ ngơi trên xe.',
      location: 'Wat Saket -> Here Hai',
      startTime: getDate(2, 9, 30),
      endTime: getDate(2, 10, 30),
      type: 'travel',
      status: 'planned',
      icon: 'ph-car',
    },
    {
      tripId,
      name: 'ĂN TRƯA: HERE HAI (MICHELIN)',
      description: 'Cơm chiên cua Michelin (Ekkamai).\nĐến lúc 10:30 (vừa mở cửa, đói bụng sau khi leo núi là vừa đẹp).\nMust-Order: Insane Crab Fried Rice, Tôm tích cháy tỏi.',
      location: 'Here Hai (Ekkamai)',
      startTime: getDate(2, 10, 30),
      endTime: getDate(2, 12, 0),
      type: 'food',
      status: 'planned',
      icon: 'ph-crab',
      tag: 'Michelin',
      tagColor: 'red',
      rating: 5
    },
    {
      tripId,
      name: 'WATTANA PANICH (MÌ BÒ HẦM)',
      description: 'Mì bò hầm với nồi nước dùng 50 năm không tắt bếp.\nOrder: 2 bát Mì bò hầm (Sharing) để nếm thử.\nDi chuyển: Cách Here Hai 800m.',
      location: 'Ekkamai',
      startTime: getDate(2, 12, 0),
      endTime: getDate(2, 13, 0),
      type: 'food',
      status: 'planned',
      icon: 'ph-bowl-food',
      tag: 'Lâu đời',
      tagColor: 'brown'
    },
    {
      tripId,
      name: 'MAE VAREE (XÔI XOÀI MANG VỀ)',
      description: 'Xôi xoài ngon nhất nhì Bangkok (đầu ngõ Thong Lo).\nMua mang về (Take away). Giá ~150 THB/hộp.\nHoạt động: Mua về khách sạn ăn tráng miệng.',
      location: 'Thong Lo (Soi 55)',
      startTime: getDate(2, 13, 30),
      endTime: getDate(2, 14, 0),
      type: 'food',
      status: 'planned',
      icon: 'ph-package',
      tag: 'Tráng miệng',
      tagColor: 'yellow'
    },
    {
      tripId,
      name: 'NGHỈ NGƠI / MASSAGE',
      description: 'Về khách sạn ngủ trưa hoặc Massage chân (khu Pratunam).\nChuẩn bị sức cho buổi chiều.',
      location: 'Hotel Ordinary',
      startTime: getDate(2, 14, 0),
      endTime: getDate(2, 16, 0),
      type: 'activity',
      status: 'planned',
      icon: 'ph-bed',
      tag: 'Relax',
      tagColor: 'blue'
    },
    {
      tripId,
      name: 'HOÀNG HÔN TẠI WAT ARUN',
      description: 'Chùa Bình Minh - Địa điểm ngắm hoàng hôn đẹp nhất.\nDi chuyển: Phà từ bến Tha Tien (5 baht).\nCheck-in: Thuê đồ Thái (200 baht/bộ), Kem Wat Arun (hoa văn chùa).',
      location: 'Wat Arun',
      startTime: getDate(2, 16, 30),
      endTime: getDate(2, 18, 0),
      type: 'activity',
      status: 'planned',
      icon: 'ph-sun-horizon',
      tag: 'Sống ảo',
      tagColor: 'orange',
      tips: 'Mặc đồ lịch sự nếu không thuê đồ Thái.'
    },
    {
      tripId,
      name: 'THIPSAMAI PAD THAI & RAAN JAY FAI',
      description: 'Thipsamai: Pad Thai gói trứng & Nước cam vắt (Must-try, ngon hơn Pad Thai).\nRaan Jay Fai: Ngắm bà chủ đeo kính bơi nấu ăn (1 sao Michelin).',
      location: 'Phố Cổ (Gần Wat Arun)',
      startTime: getDate(2, 18, 30),
      endTime: getDate(2, 20, 0),
      type: 'food',
      status: 'planned',
      icon: 'ph-fire',
      tag: 'Phố Cổ',
      tagColor: 'red'
    },
    {
      tripId,
      name: 'CHINATOWN (YAOWARAT)',
      description: 'Dạo phố, ăn vặt đêm.\nMón: Bánh bao nướng (Gu Long Bao), Chè Yến/Bạch quả (Sweettime), Hạt dẻ nướng.',
      location: 'Chinatown',
      startTime: getDate(2, 20, 30),
      endTime: getDate(2, 22, 30),
      type: 'activity',
      status: 'planned',
      icon: 'ph-lantern',
      tag: 'Nightlife',
      tagColor: 'red'
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
