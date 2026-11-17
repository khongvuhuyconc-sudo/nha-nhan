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
              <span className="cleanzy-price">
                <small>Giá dịch vụ từ</small>
                <strong>{formatVnd(150_000 + (p.hours - 2) * 50_000)}</strong>
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

      <section className="cleanzy-task-section" id="cong-viec-ve-sinh" aria-labelledby="cleanzy-task-title">
        <div className="cleanzy-task-heading">
          <div>
            <span className="eyebrow">CÔNG VIỆC CỦA CLEANZY</span>
            <h3 id="cleanzy-task-title">Chúng mình chăm chút những gì?</h3>
          </div>
          <p>Hình ảnh minh họa các công việc và trải nghiệm dịch vụ để bạn dễ hình dung trước khi đặt lịch.</p>
        </div>
        <div className="cleanzy-task-grid">
          <article className="cleanzy-task-card">
            <div className="cleanzy-task-photo">
              <img src="/img/hut-bui-lau-san.webp" alt="Ảnh minh họa công việc: hút bụi & lau sàn" loading="lazy" decoding="async" width="800" height="520" />
              <span className="cleanzy-task-number">01</span>
            </div>
            <div className="cleanzy-task-info">
              <h4>Hút bụi & lau sàn</h4>
              <p>Quét, hút bụi và lau sạch sàn nhà, đặc biệt ở khu vực sinh hoạt chung.</p>
            </div>
          </article>
          <article className="cleanzy-task-card">
            <div className="cleanzy-task-photo">
              <img src="/img/lau-ban-ghe.webp" alt="Ảnh minh họa công việc: lau bàn ghế & bề mặt" loading="lazy" decoding="async" width="800" height="520" />
              <span className="cleanzy-task-number">02</span>
            </div>
            <div className="cleanzy-task-info">
              <h4>Lau bàn ghế & bề mặt</h4>
              <p>Làm sạch bàn, kệ, tay nắm cửa và các bề mặt sử dụng thường xuyên.</p>
            </div>
          </article>
          <article className="cleanzy-task-card">
            <div className="cleanzy-task-photo">
              <img src="/img/ve-sinh-phong-tam.webp" alt="Ảnh minh họa công việc: vệ sinh phòng tắm" loading="lazy" decoding="async" width="800" height="520" />
              <span className="cleanzy-task-number">03</span>
            </div>
            <div className="cleanzy-task-info">
              <h4>Vệ sinh phòng tắm</h4>
              <p>Lau rửa lavabo, gương và các bề mặt phòng tắm theo phạm vi gói.</p>
            </div>
          </article>
          <article className="cleanzy-task-card">
            <div className="cleanzy-task-photo">
              <img src="/img/khach-hang-hai-long.webp" alt="Ảnh minh họa trải nghiệm khách hàng hài lòng với dịch vụ Cleanzy" loading="lazy" decoding="async" width="800" height="520" />
              <span className="cleanzy-task-number">04</span>
            </div>
            <div className="cleanzy-task-info">
              <h4>Khách hàng hài lòng</h4>
              <p>Cleanzy hướng đến trải nghiệm phục vụ tận tâm, nhà cửa gọn gàng và khách hàng an tâm.</p>
            </div>
          </article>
          <article className="cleanzy-task-card">
            <div className="cleanzy-task-photo">
              <img src="/img/sap-xep-phong-ngu.webp" alt="Ảnh minh họa công việc: sắp xếp đồ đạc" loading="lazy" decoding="async" width="800" height="520" />
              <span className="cleanzy-task-number">05</span>
            </div>
            <div className="cleanzy-task-info">
              <h4>Sắp xếp đồ đạc</h4>
              <p>Chỉnh trang phòng ngủ, gấp chăn gối và sắp xếp vật dụng gọn gàng.</p>
            </div>
          </article>
          <article className="cleanzy-task-card">
            <div className="cleanzy-task-photo">
              <img src="/img/lau-kinh.webp" alt="Ảnh minh họa công việc: lau kính & góc khuất" loading="lazy" decoding="async" width="800" height="520" />
              <span className="cleanzy-task-number">06</span>
            </div>
            <div className="cleanzy-task-info">
              <h4>Lau kính & góc khuất</h4>
              <p>Lau kính tầm thấp và chăm chút các góc khó tiếp cận theo gói phù hợp.</p>
            </div>
          </article>
        </div>
        <p className="cleanzy-task-caption">Hình ảnh minh họa công việc. Nội dung thực hiện phụ thuộc vào gói dịch vụ và thời lượng đã chọn.</p>
      </section>

      
      <p className="packages-note">
        <strong>Dịch vụ vệ sinh kỹ:</strong> Phù hợp với những
        không gian cần làm sạch chuyên sâu, xử lý bụi bẩn tích tụ,
        vệ sinh các góc khuất và bề mặt khó làm sạch.
        Phụ thu cố định 25.000đ/ca, áp dụng cho cả ba gói 2 giờ, 3 giờ và 4 giờ.
      </p>


    </section>
  )
}
