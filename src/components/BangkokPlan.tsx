import React, { useState } from 'react';

export const BangkokPlan: React.FC = () => {
  const [activeDay, setActiveDay] = useState('day1');

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    const headerOffset = 140;
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveDay(id);
    }
  };

  return (
    <div className="pb-20 text-slate-800 font-sans">
      {/* HEADER */}
      <header className="header-bg-bangkok text-white pt-12 pb-32 px-4 rounded-b-[3rem] shadow-xl relative mb-[-6rem]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-4 border border-white/20 shadow-sm">
            <i className="ph-fill ph-calendar-check text-orange-300"></i> 12/12 - 15/12/2025
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight drop-shadow-lg">
            Bangkok & Pattaya
          </h1>
          <p className="text-orange-100 text-lg font-medium max-w-lg mx-auto drop-shadow-md">
            Chuyến đi "bể bụng" của team Duy Bảo, Linh Trang, Đức Dân & Phương Anh 🇹🇭
          </p>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-3xl mx-auto px-4 relative z-10">

        {/* SUMMARY CARD */}
        <div className="glass-panel rounded-3xl p-6 mb-8 shadow-lg">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
            <i className="ph-fill ph-info text-orange-600"></i> Tổng Quan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex gap-3 items-start">
              <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><i className="ph-bold ph-users"></i></div>
              <div>
                <span className="block font-bold text-slate-700">Nhân sự</span>
                <span className="text-slate-600">4 người (2 cặp đôi)</span>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><i className="ph-bold ph-car"></i></div>
              <div>
                <span className="block font-bold text-slate-700">Di chuyển chính</span>
                <span className="text-slate-600">Grab/Bolt (Rẻ cho 4 người), BTS/MRT (Giờ cao điểm)</span>
              </div>
            </div>
          </div>
        </div>

        {/* DATE NAVIGATION */}
        <div className="sticky top-24 z-40 py-3 -mx-4 px-4 flex gap-2 overflow-x-auto no-scrollbar mb-8 shadow-sm bg-white/80 backdrop-blur-md border-b border-orange-100">
          <button
            onClick={() => scrollToId('day1')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition ${activeDay === 'day1' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-orange-50'}`}
          >
            Ngày 1 (12/12)
          </button>
          <button
            onClick={() => scrollToId('day2')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition ${activeDay === 'day2' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-orange-50'}`}
          >
            Ngày 2 (13/12)
          </button>
          <button
            onClick={() => scrollToId('day3')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition ${activeDay === 'day3' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-orange-50'}`}
          >
            Ngày 3 (14/12)
          </button>
          <button
            onClick={() => scrollToId('day4')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition ${activeDay === 'day4' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-orange-50'}`}
          >
            Ngày 4 (15/12)
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-16">

          {/* DAY 1 */}
          <section id="day1" className="scroll-mt-36">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/20">1</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Thứ 6, 12/12</h2>
                <p className="text-sm font-medium text-slate-500">Hạ cánh & "Quẩy" Pattaya</p>
              </div>
            </div>

            <div className="relative pl-4 md:pl-6 space-y-6">
              <div className="timeline-line"></div>

              {/* 10:00 Flight */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-airplane-landing text-blue-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-lg">10:00 - 12:00</span>
                    <span className="tag tag-move">Di chuyển</span>
                  </div>
                  <p className="text-slate-600">Đáp sân bay (BKK/DMK). Nhập cảnh, mua SIM.</p>
                </div>
              </div>

              {/* 13:00 Transfer */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-van text-blue-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <span className="font-bold text-slate-800 text-lg block mb-1">13:00</span>
                  <p className="text-slate-600">Bắt xe đi thẳng Pattaya (1.5 - 2 tiếng). <br /><span className="text-xs text-slate-500 italic">Tip: Xe 4 chỗ hoặc van riêng tiện nhất cho nhóm 4 người.</span></p>
                </div>
              </div>

              {/* 15:00 Check-in Kudos */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white border-4 border-white flex items-center justify-center shrink-0 shadow-md">
                  <i className="ph-bold ph-check"></i>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl w-full timeline-card">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-emerald-900 text-lg">15:00 • Check-in</span>
                    <span className="tag tag-hotel">Khách sạn</span>
                  </div>
                  <h3 className="font-bold text-emerald-800 text-xl">Kudos Boutique Hotel</h3>
                  <p className="text-sm text-emerald-700 mb-2"><i className="ph-fill ph-map-pin"></i> Soi Thappraya 1, Nam Pattaya</p>
                  <p className="text-sm text-slate-600 bg-white/50 p-2 rounded-lg">
                    <strong>Đánh giá:</strong> Khu đồi Pratamnak yên tĩnh, nối giữa Jomtien và Nam Pattaya. Cách Walking Street 5-10 phút đi xe.
                  </p>
                </div>
              </div>

              {/* 16:30 Cafe */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-coffee text-orange-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-lg">16:30</span>
                    <span className="tag tag-play">Sống ảo</span>
                  </div>
                  <h4 className="font-bold text-slate-700">The Sky Gallery / 3 Mermaids</h4>
                  <p className="text-slate-600">Gần khách sạn. Ngắm hoàng hôn view biển cực đẹp.</p>
                </div>
              </div>

              {/* 19:00 Seafood */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-fish text-orange-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card border-l-4 border-orange-500">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-lg">19:00 • Ăn tối</span>
                    <span className="tag tag-food">Hải sản</span>
                  </div>
                  <h4 className="font-bold text-orange-700 text-xl">Pupen Seafood / The Glass House</h4>
                  <p className="text-slate-600">Hải sản tươi, giá hợp lý hơn Bangkok. Khu vực Jomtien.</p>
                </div>
              </div>

              {/* 21:00 Walking Street */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-purple-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-music-notes text-purple-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-lg">21:00</span>
                    <span className="tag tag-play">Nightlife</span>
                  </div>
                  <h4 className="font-bold text-slate-700">Walking Street</h4>
                  <p className="text-slate-600">Bắt xe Songthaew (10 baht) hoặc Bolt. Trải nghiệm không khí sôi động.</p>
                </div>
              </div>
            </div>
          </section>

          {/* DAY 2 */}
          <section id="day2" className="scroll-mt-36">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-orange-600/20">2</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Thứ 7, 13/12</h2>
                <p className="text-sm font-medium text-slate-500">Về Bangkok & Oanh Tạc Pratunam</p>
              </div>
            </div>

            <div className="relative pl-4 md:pl-6 space-y-6">
              <div className="timeline-line"></div>

              {/* 11:00 Checkout */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 border-4 border-white flex items-center justify-center shrink-0 shadow-md">
                  <i className="ph-bold ph-sign-out"></i>
                </div>
                <div className="glass-panel p-3 rounded-2xl w-full opacity-80">
                  <span className="font-bold text-slate-800">11:00</span> Check-out Pattaya, lên xe về Bangkok.
                </div>
              </div>

              {/* 13:30 Check-in Ordinary */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white border-4 border-white flex items-center justify-center shrink-0 shadow-md">
                  <i className="ph-bold ph-check"></i>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl w-full timeline-card">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-emerald-900 text-lg">13:30 • Check-in</span>
                    <span className="tag tag-hotel">Khách sạn</span>
                  </div>
                  <h3 className="font-bold text-emerald-800 text-xl">Hotel Ordinary Bangkok</h3>
                  <p className="text-sm text-emerald-700 mb-2"><i className="ph-fill ph-map-pin"></i> Ratchathewi</p>
                  <p className="text-sm text-slate-600 bg-white/50 p-2 rounded-lg">
                    <strong>Lợi thế:</strong> Nằm trong ngõ Soi Ratchataphan, đi bộ được ra Pe Aor (600m) và khu Pratunam.
                  </p>
                </div>
              </div>

              {/* 14:00 Pe Aor */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-bowl-food text-orange-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card border-l-4 border-orange-500">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-lg">14:00 • Ăn trưa muộn</span>
                    <span className="tag tag-food">Must Try</span>
                  </div>
                  <h4 className="font-bold text-orange-700 text-xl">Pe Aor Tom Yum</h4>
                  <p className="text-slate-600"><strong>Món:</strong> Tom Yum Tôm Hùm/Hải sản (bát khổng lồ).</p>
                  <p className="text-xs text-slate-500 mt-1"><i className="ph-fill ph-person-simple-walk"></i> Đi bộ 7-10 phút từ khách sạn.</p>
                </div>
              </div>

              {/* 16:00 Shopping */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-purple-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-shopping-bag text-purple-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <span className="font-bold text-slate-800 text-lg block mb-1">16:00</span>
                  <h4 className="font-bold text-slate-700">Platinum Fashion Mall / December</h4>
                  <p className="text-slate-600">Đi bộ tiêu cơm, mua sắm quần áo.</p>
                </div>
              </div>

              {/* 18:00 Go Ang */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-red-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-trophy text-red-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-lg">18:00 • Ăn tối</span>
                    <span className="tag tag-michelin">Michelin</span>
                  </div>
                  <h4 className="font-bold text-slate-700 text-xl">Go Ang Pratunam (Cơm gà Hồng)</h4>
                  <p className="text-slate-600">Ngay gần Platinum. Xếp hàng hơi đông nhưng nhanh.</p>
                </div>
              </div>

              {/* 20:00 Jodd Fairs */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-purple-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-moon-stars text-purple-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-lg">20:00</span>
                    <span className="tag tag-play">Chợ đêm</span>
                  </div>
                  <h4 className="font-bold text-slate-700">Jodd Fairs (Rama 9)</h4>
                  <p className="text-slate-600 mb-1">Di chuyển bằng Grab hoặc MRT (Makkasan -{'>'} Rama 9).</p>
                  <ul className="text-sm list-disc list-inside text-slate-600 bg-slate-50 p-2 rounded">
                    <li><strong>Món chính:</strong> Sườn cay khổng lồ (Quán 2 trái ớt - Diaw Maekhlong).</li>
                    <li><strong>Món thêm:</strong> Nước lựu, kẹo dẻo thú, xiên nướng.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* DAY 3 */}
          <section id="day3" className="scroll-mt-36">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-600/20">3</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Chủ Nhật, 14/12</h2>
                <p className="text-sm font-medium text-slate-500">Tour Michelin: Phố Cổ & Sukhumvit</p>
              </div>
            </div>

            <div className="relative pl-4 md:pl-6 space-y-6">
              <div className="timeline-line"></div>

              {/* 08:00 On Lok Yun */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-yellow-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-coffee text-yellow-600"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-lg">08:00 • Ăn sáng</span>
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold">ĐI SỚM!</span>
                  </div>
                  <h4 className="font-bold text-slate-700">On Lok Yun (Phố Cổ)</h4>
                  <p className="text-slate-600">Bánh mì nướng sốt trứng sữa, trà thái, trứng ốp la.</p>
                </div>
              </div>

              {/* 10:00 Here Hai */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-red-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-crab text-red-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-lg">10:00 • Ăn trưa</span>
                    <span className="tag tag-michelin">Bib Gourmand</span>
                  </div>
                  <h4 className="font-bold text-red-700 text-xl">Here Hai (Ekkamai)</h4>
                  <p className="text-slate-600 mb-1"><strong>Quan trọng:</strong> Cần đặt chỗ hoặc xếp hàng sớm.</p>
                  <p className="text-slate-600">Cơm chiên cua (siêu nhiều thịt), Tôm chấy tỏi.</p>
                </div>
              </div>

              {/* 12:30 Wattana Panich */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-bowl-food text-orange-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <span className="font-bold text-slate-800 text-lg block mb-1">12:30</span>
                  <h4 className="font-bold text-slate-700">Wattana Panich (Cách Here Hai 1km)</h4>
                  <p className="text-slate-600">Mì bò hầm với nồi nước dùng 50 năm không tắt bếp.</p>
                </div>
              </div>

              {/* 13:30 Mae Varee */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-yellow-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-package text-yellow-600"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <span className="font-bold text-slate-800 text-lg block mb-1">13:30</span>
                  <h4 className="font-bold text-slate-700">Mae Varee (Thong Lo)</h4>
                  <p className="text-slate-600">Xôi xoài ngon nhất nhì Bangkok. <strong>Chỉ bán mang về</strong>.</p>
                </div>
              </div>

              {/* 15:00 Break */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-bed text-slate-400"></i>
                </div>
                <div className="glass-panel p-3 rounded-2xl w-full opacity-80">
                  <span className="font-bold text-slate-800">15:00</span> Về khách sạn nghỉ ngơi / Massage chân.
                </div>
              </div>

              {/* 18:30 Thipsamai */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-fire text-orange-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card border-l-4 border-orange-500">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-lg">18:30 • Ăn tối</span>
                    <span className="tag tag-food">Phố Cổ</span>
                  </div>
                  <h4 className="font-bold text-orange-700 text-xl">Thipsamai Pad Thai</h4>
                  <p className="text-slate-600">Pad Thai gói trứng & <strong>Nước cam vắt</strong> (đắt nhưng đáng tiền).</p>
                  <p className="text-xs text-slate-500 mt-1">Có thể ngó sang Raan Jay Fai bên cạnh.</p>
                </div>
              </div>

              {/* 21:00 Chinatown */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-red-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-lantern text-red-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <span className="font-bold text-slate-800 text-lg block mb-1">21:00</span>
                  <h4 className="font-bold text-slate-700">Chinatown (Yaowarat)</h4>
                  <p className="text-slate-600">Dạo đêm, ăn tráng miệng (chè yến, bánh bao nướng).</p>
                </div>
              </div>
            </div>
          </section>

          {/* DAY 4 */}
          <section id="day4" className="scroll-mt-36">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-slate-800 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">4</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Thứ 2, 15/12</h2>
                <p className="text-sm font-medium text-slate-500">Shopping Cuối & Về Hà Nội</p>
              </div>
            </div>

            <div className="relative pl-4 md:pl-6 space-y-6">
              <div className="timeline-line"></div>

              {/* 09:00 Checkout */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 border-4 border-white flex items-center justify-center shrink-0 shadow-md">
                  <i className="ph-bold ph-sign-out"></i>
                </div>
                <div className="glass-panel p-3 rounded-2xl w-full opacity-80">
                  <span className="font-bold text-slate-800">09:00</span> Check-out, gửi hành lý tại khách sạn.
                </div>
              </div>

              {/* 09:30 Boat Noodle */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-bowl-steam text-orange-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 text-lg">09:30 • Ăn sáng</span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Gần Hotel</span>
                  </div>
                  <h4 className="font-bold text-slate-700">Baan Kuay Tiew Ruathong</h4>
                  <p className="text-slate-600">Mỳ thuyền tại Victory Monument (Ngõ Boat Noodle Alley). Ăn chồng bát (15-18 baht/bát).</p>
                </div>
              </div>

              {/* 11:00 Shopping */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-purple-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-bag text-purple-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <span className="font-bold text-slate-800 text-lg block mb-1">11:00</span>
                  <h4 className="font-bold text-slate-700">Siam Paragon / Central World</h4>
                  <p className="text-slate-600">Mua sắm tự do.</p>
                </div>
              </div>

              {/* 13:00 Lunch Options */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                  <i className="ph-fill ph-fork-knife text-blue-500"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full timeline-card">
                  <span className="font-bold text-slate-800 text-lg block mb-1">13:00 • Ăn trưa</span>
                  <div className="space-y-2">
                    <div className="bg-slate-50 p-2 rounded">
                      <span className="font-bold text-slate-700 block">Option 1: Cơm gà Hải Nam</span>
                      <span className="text-sm text-slate-500">Kuang Heng (Màu xanh) cạnh Go Ang hoặc Food court Paragon.</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded">
                      <span className="font-bold text-slate-700 block">Option 2: Polo Fried Chicken</span>
                      <span className="text-sm text-slate-500">Gà chiên tỏi (Gần công viên Lumphini).</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 15:00 Baggage & Airport */}
              <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-slate-800 text-white border-4 border-white flex items-center justify-center shrink-0 shadow-md">
                  <i className="ph-fill ph-airplane-takeoff"></i>
                </div>
                <div className="glass-panel p-4 rounded-2xl w-full bg-slate-50">
                  <ul className="space-y-2 text-slate-700">
                    <li><strong>15:00:</strong> Lấy hành lý tại khách sạn.</li>
                    <li><strong>15:30:</strong> Ra sân bay (Nên đi sớm vì chiều Bangkok rất tắc đường).</li>
                    <li><strong>18:00/20:00:</strong> Bay về Hà Nội.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>

      </main>
    </div>
  );
};
