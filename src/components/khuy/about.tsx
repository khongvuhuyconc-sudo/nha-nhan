import { Check, HeartHandshake, Ruler, ShieldCheck, Sparkles, Users } from 'lucide-react'

import { PACKAGES, STAFF, formatVnd } from '@/lib/khuy'

export function AboutSection() {
  return (
    <section className="about-section container" id="gioi-thieu">
      <div className="about-copy">
        <span className="eyebrow">VỀ CLEANZY</span>
        <h2>
          Không gian sạch đẹp,
          <br />
          cuộc sống thảnh thơi.
        </h2>
        <p>
          Cleanzy là dịch vụ dọn nhà theo giờ dành cho căn hộ và nhà phố. Bạn chọn thời
          lượng, chúng mình cử nhân viên đã được hướng dẫn kỹ đến tận nơi — đúng giờ, mang
          theo tinh thần chu đáo như chăm sóc chính ngôi nhà của mình.
        </p>
        <p>
          Mỗi ca làm việc có phạm vi rõ ràng theo diện tích, giá được báo trước và khách quen
          luôn được ưu đãi. Sau mỗi lần dọn, bạn có thể đánh giá nhân viên để chúng mình ngày
          một tốt hơn.
        </p>
      </div>
      <div className="about-values">
        {[
          {
            icon: Users,
            title: `Đội ngũ nhân viên tận tâm`,
            text: 'Đội ngũ cố định, được hướng dẫn quy trình dọn dẹp thống nhất.',
          },
          {
            icon: Ruler,
            title: 'Phạm vi theo diện tích',
            text: 'Biết trước mỗi ca phù hợp với bao nhiêu mét vuông nhà bạn.',
          },
          {
            icon: ShieldCheck,
            title: 'Giá minh bạch',
            text: 'Báo giá trước khi đặt, không phụ phí theo địa chỉ.',
          },
          {
            icon: HeartHandshake,
            title: 'Trân trọng khách quen',
            text: 'Đặt càng nhiều, voucher giảm giá càng lớn.',
          },
        ].map((v) => (
          <div className="about-value" key={v.title}>
            <span className="how-icon">
              <v.icon size={20} strokeWidth={1.6} />
            </span>
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PackagesSection({ onPick }: { onPick: (hours: number) => void }) {
  return (
    <section className="packages-section container" id="dich-vu">
      <div className="section-heading">
        <div>
          <span className="eyebrow">MÔ TẢ DỊCH VỤ</span>
          <h2>Chọn thời lượng theo diện tích nhà bạn</h2>
        </div>
        <span className="heading-note">
          <Ruler size={17} /> Mỗi ca dành cho 1 nhân viên
        </span>
      </div>
      <div className="package-grid">
        {PACKAGES.map((p) => (
          <article className={`package-card ${p.hours === 3 ? 'featured' : ''}`} key={p.hours}>
            {p.hours === 3 && (
              <span className="package-flag">
                <Sparkles size={12} /> Gói đề xuất
              </span>
            )}
            <span className="package-name">{p.name}</span>
            <div className="package-head">
              <strong>{p.hours} giờ</strong>
              <span className="package-area">≈ {p.area} m²</span>
            </div>
            <p className="package-fits">{p.fits}</p>
            <ul>
              {p.tasks.map((t) => (
                <li key={t}>
                  <Check size={14} /> {t}
                </li>
              ))}
            </ul>
            <div className="package-foot">
              <span>
                Từ <strong>{formatVnd(250_000 + (p.hours - 2) * 50_000)}</strong>
              </span>
              <a
                href="#dat-lich"
                className={`button ${p.hours === 3 ? 'primary' : 'ghost'}`}
                onClick={() => onPick(p.hours)}
              >
                Chọn gói {p.hours} giờ
              </a>
            </div>
          </article>
        ))}
      </div>
      <p className="packages-note">
      <strong>Dịch vụ vệ sinh kỹ:</strong> Phù hợp với những không gian cần làm sạch chuyên sâu, xử lý bụi bẩn tích tụ, vệ sinh các góc khuất và bề mặt khó làm sạch.
      Phụ thu theo thời lượng:(Khởi điểm 2 giờ là phụ thu thêm 25000, mỗi 1 tiếng cộng thêm 25000)
        2 giờ +25.000đ,
        3 giờ +50.000đ,
        4 giờ +75.000đ.
      </p>
        Diện tích là mức tham khảo cho nhà ở bình thường. Nhà nhiều đồ hoặc lâu chưa dọn có thể
        cần thêm thời gian — hãy ghi chú khi đặt lịch để chúng mình tư vấn.
      </p>
    </section>
  )
}
