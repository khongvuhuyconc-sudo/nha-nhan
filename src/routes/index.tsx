import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  CircleCheck,
  Clock3,
  Gift,
  House,
  Leaf,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Utensils,
  Wallet,
  X,
} from 'lucide-react'

import { AboutSection, PackagesSection } from '@/components/khuy/about'
import { StaffSection } from '@/components/khuy/staff'
import { VoucherSection, fetchLoyalty } from '@/components/khuy/voucher'
import type { LoyaltyStatus } from '@/components/khuy/voucher'
import {
  HOURS,
  SERVICES,
  STAFF,
  formatVnd,
  packageFor,
  phoneKey,
  quote,
  validateDraft,
  vnDate,
} from '@/lib/khuy'
import type { BookingDraft } from '@/lib/khuy'

export const Route = createFileRoute('/')({
  component: Home,
})

type BookingResult = {
  reference: string
  subtotal: number
  price: number
  discountPercent: number
  voucherCode: string | null
}

const NAV = [
  { href: '#gioi-thieu', label: 'Giới thiệu' },
  { href: '#dich-vu', label: 'Dịch vụ' },
  { href: '#bang-gia', label: 'Bảng giá' },
  { href: '#uu-dai', label: 'Ưu đãi' },
  { href: '#nhan-vien', label: 'Nhân viên' },
]

function Brand({ size = 26 }: { size?: number }) {
  return (
    <>
      <span className="brand-icon">
        <House size={size} strokeWidth={1.6} />
        <Leaf size={size / 2} className="brand-leaf" />
      </span>
      <span>
        cleanzy<span className="brand-dot">.</span>
      </span>
    </>
  )
}

function Home() {
  const [draft, setDraft] = useState<BookingDraft>({
    address: '',
    city: 'TP. Hồ Chí Minh',
    date: '',
    time: '09:00',
    hours: 3,
    service: 'cleaning',
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [draftError, setDraftError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<BookingResult | null>(null)
  const [contact, setContact] = useState({
    name: '',
    phone: '',
    note: '',
    preferredStaff: '',
    website: '',
  })
  const [requestId, setRequestId] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [loyalty, setLoyalty] = useState<LoyaltyStatus | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const discount = loyalty?.current?.percent ?? 0
  const price = quote(draft, discount)
  const pkg = packageFor(draft.hours)
  const serviceName = SERVICES.find((s) => s.id === draft.service)?.name

  useEffect(() => {
    setDraft((d) => ({ ...d, date: vnDate(1) }))
  }, [])

  useEffect(() => {
    if (dialogOpen) {
      dialogRef.current?.showModal()
      const overflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = overflow
      }
    }
    dialogRef.current?.close()
  }, [dialogOpen])

  // Look up the loyalty voucher as soon as a valid phone number is typed.
  useEffect(() => {
    const key = phoneKey(contact.phone)
    if (!key) {
      setLoyalty(null)
      return
    }
    let active = true
    const t = setTimeout(() => {
      fetchLoyalty(key)
        .then((s) => active && setLoyalty(s))
        .catch(() => active && setLoyalty(null))
    }, 350)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [contact.phone])

  function update<K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
    setDraftError('')
  }

  function openDialog() {
    const err = validateDraft(draft)
    if (err) return setDraftError(err)
    setResult(null)
    setSubmitError('')
    setRequestId(crypto.randomUUID())
    setDialogOpen(true)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (sending) return
    setSending(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, ...contact, id: requestId }),
        signal: AbortSignal.timeout(20_000),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Không gửi được yêu cầu. Vui lòng thử lại.')
      setResult(data)
      setContact({ name: '', phone: '', note: '', preferredStaff: '', website: '' })
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.name !== 'TimeoutError'
          ? err.message
          : 'Kết nối đang chậm. Vui lòng thử lại; yêu cầu không bị lưu trùng.',
      )
    } finally {
      setSending(false)
    }
  }

  function pickHours(hours: number) {
    update('hours', hours)
  }

  const scheduleLabel = `${draft.date.split('-').reverse().join('/')} · ${draft.time} · ${draft.hours} giờ`

  return (
    <>
      <a className="skip-link" href="#dat-lich">
        Đến phần đặt lịch
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a href="#" className="brand" aria-label="Cleanzy — trang chủ">
            <Brand />
          </a>
          <nav
            className={menuOpen ? 'navigation is-open' : 'navigation'}
            aria-label="Điều hướng chính"
          >
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)}>
                {n.label}
              </a>
            ))}
          </nav>
          <a className="header-cta" href="#dat-lich">
            Đặt lịch dọn nhà <ArrowUpRight size={16} />
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero container">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="tiny-star">
                <Sparkles size={14} />
              </span>{' '}
              DỌN NHÀ THEO GIỜ, THEO CÁCH CỦA BẠN
            </span>
            <h1>
              Nhà sạch.
              <br />
              <span>Đời nhàn.</span>
              <span className="hero-sparkle" aria-hidden="true">
                ✳
              </span>
            </h1>
            <p>
              Việc nhà để Cleanzy lo.
              <br />
              Dành thời gian cho những điều bạn yêu.
            </p>
            <a href="#dat-lich" className="button primary hero-button">
              Đặt lịch dọn nhà <ArrowRight size={18} />
            </a>
            <div className="hero-benefits">
              <span>
                <CircleCheck size={16} /> Biết giá trước khi đặt
              </span>
              <span>
                <CircleCheck size={16} /> Từ 55 m² mỗi ca 2 giờ
              </span>
              <span>
                <CircleCheck size={16} /> Voucher cho khách quen
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image">
              <img
                src="/.netlify/images?url=/img/clean-home.png&w=1000&fm=webp"
                srcSet="/.netlify/images?url=/img/clean-home.png&w=600&fm=webp 600w, /.netlify/images?url=/img/clean-home.png&w=1000&fm=webp 1000w"
                sizes="(max-width: 760px) 92vw, 48vw"
                width="1000"
                height="850"
                alt="Nhân viên Cleanzy chăm sóc phòng khách sáng thoáng, gọn gàng"
                fetchPriority="high"
              />
            </div>
            <div className="image-label">
              <span className="status-dot" /> Nhà gọn gàng, lòng nhẹ tênh
            </div>
            <div className="floating-note">
              <span className="note-icon">
                <Leaf size={23} />
              </span>
              <div>
                <strong>Thêm một chút thảnh thơi.</strong>
                <span>Bớt một chút việc nhà.</span>
              </div>
              <Check size={17} />
            </div>
            <svg className="visual-flower" width="74" height="74" viewBox="0 0 74 74" aria-hidden="true">
              <path
                d="M37 4c6 0 9 17 9 17s15-10 19-5-7 19-7 19 18 2 16 9-20 7-20 7 8 17 1 21-19-10-19-10-11 14-17 10 1-22 1-22S2 52 0 44s18-9 18-9S7 20 12 16s17 6 17 6S30 4 37 4Z"
                fill="#d6e3ae"
              />
              <circle cx="37" cy="38" r="9" fill="#f8faf2" />
            </svg>
          </div>
        </section>

        <AboutSection />

        <PackagesSection onPick={pickHours} />

        <section className="booking-section container" id="dat-lich">
          <div className="section-heading">
            <div>
              <span className="eyebrow">MỘT CHÚT THÔNG TIN, MỘT NHÀ THẬT SẠCH</span>
              <h2>Nhà bạn cần gì hôm nay?</h2>
            </div>
            <span className="heading-note">
              <Wallet size={17} /> Giá rõ ràng. Không bất ngờ.
            </span>
          </div>
          <div className="booking-card">
            <form
              className="booking-form"
              onSubmit={(e) => {
                e.preventDefault()
                openDialog()
              }}
            >
              <fieldset>
                <legend>
                  <span className="step-number">01</span> Chọn dịch vụ
                </legend>
                <div className="service-options">
                  {SERVICES.map((s, i) => {
                    const Icon = [House, SprayCan, Utensils][i]
                    return (
                      <label
                        key={s.id}
                        className={`service-option ${draft.service === s.id ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="service"
                          value={s.id}
                          checked={draft.service === s.id}
                          onChange={() => update('service', s.id)}
                        />
                        <Icon size={23} strokeWidth={1.5} />
                        <span>{s.name}</span>
                        <span className="service-check">
                          <Check size={11} />
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
              <fieldset>
                <legend>
                  <span className="step-number">02</span> Bạn ở đâu?
                </legend>
                <div className="location-row">
                  <label className="field">
                    <span>Tỉnh / Thành phố</span>
                    <div className="input-wrap">
                      <MapPin size={17} />
                      <input
                        list="cities"
                        name="city"
                        required
                        maxLength={80}
                        value={draft.city}
                        onChange={(e) => update('city', e.target.value)}
                        aria-label="Tỉnh hoặc thành phố"
                      />
                      <ChevronDown size={14} className="field-end" />
                    </div>
                    <datalist id="cities">
                      <option value="TP. Hồ Chí Minh" />
                      <option value="Hà Nội" />
                      <option value="Đà Nẵng" />
                      <option value="Bình Dương" />
                    </datalist>
                  </label>
                  <label className="field">
                    <span>Địa chỉ cụ thể</span>
                    <div className="input-wrap">
                      <House size={17} />
                      <input
                        name="address"
                        placeholder="Số nhà, đường, phường / xã"
                        required
                        minLength={8}
                        maxLength={300}
                        autoComplete="street-address"
                        value={draft.address}
                        onChange={(e) => update('address', e.target.value)}
                      />
                    </div>
                  </label>
                </div>
              </fieldset>
              <fieldset>
                <legend>
                  <span className="step-number">03</span> Chọn lịch phù hợp với bạn
                </legend>
                <div className="schedule-row">
                  <label className="field">
                    <span>Ngày làm việc</span>
                    <div className="input-wrap">
                      <CalendarDays size={17} />
                      <input
                        type="date"
                        name="date"
                        required
                        min={vnDate()}
                        max={vnDate(89)}
                        value={draft.date}
                        onChange={(e) => update('date', e.target.value)}
                      />
                    </div>
                  </label>
                  <label className="field">
                    <span>Giờ bắt đầu</span>
                    <div className="input-wrap">
                      <Clock3 size={17} />
                      <select
                        name="time"
                        value={draft.time}
                        onChange={(e) => update('time', e.target.value)}
                      >
                        {Array.from({ length: 26 }, (_, i) => {
                          const t = `${String(7 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`
                          return (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </label>
                  <div className="field">
                    <span>Thời lượng</span>
                    <div className="duration-options" role="group" aria-label="Thời lượng làm việc">
                      {HOURS.map((h) => (
                        <button
                          key={h}
                          type="button"
                          aria-pressed={draft.hours === h}
                          className={draft.hours === h ? 'active' : ''}
                          onClick={() => update('hours', h)}
                        >
                          {h} giờ
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="field-hint">
                  <Clock3 size={13} /> {draft.hours} giờ phù hợp nhà khoảng {pkg.area} m² · Mỗi ca
                  dành cho 1 nhân viên · Giờ Việt Nam (GMT+7)
                </p>
              </fieldset>
              {draftError && (
                <p className="form-error" role="alert">
                  {draftError}
                </p>
              )}
              <button type="submit" className="mobile-submit button primary">
                Tiếp tục đặt lịch <ArrowRight size={17} />
              </button>
            </form>

            <aside className="quote-panel" aria-label="Chi tiết báo giá">
              <div className="quote-top">
                <span className="quote-icon">
                  <Sparkles size={21} />
                </span>
                <span>BÁO GIÁ CỦA BẠN</span>
                <span className="demo-tag">≈ {pkg.area} m²</span>
              </div>
              <div className="quote-total" aria-live="polite">
                <strong>{formatVnd(price.total)}</strong>
                <span>cho một ngôi nhà gọn gàng hơn</span>
              </div>
              <div className="quote-lines">
                <div>
                  <span>
                    {serviceName} · {draft.hours} giờ
                  </span>
                  <strong>{formatVnd(price.base)}</strong>
                </div>
                {price.serviceFee > 0 && (
                  <div>
                    <span>Vệ sinh kỹ</span>
                    <strong>+{formatVnd(price.serviceFee)}</strong>
                  </div>
                )}
                <div>
                  <span>Phụ phí cuối tuần</span>
                  <strong>{price.weekend ? `+${formatVnd(price.weekend)}` : '0đ'}</strong>
                </div>
                <div>
                  <span>Phụ phí từ 17:00</span>
                  <strong>{price.evening ? `+${formatVnd(price.evening)}` : '0đ'}</strong>
                </div>
                {price.cap > 0 && (
                  <div className="price-cap">
                    <span>Điều chỉnh trần giá</span>
                    <strong>−{formatVnd(price.cap)}</strong>
                  </div>
                )}
                {price.voucher > 0 && (
                  <div className="price-cap">
                    <span>
                      Voucher {loyalty?.current?.code} (−{discount}%)
                    </span>
                    <strong>−{formatVnd(price.voucher)}</strong>
                  </div>
                )}
                <div className="total-line">
                  <span>Tổng cộng</span>
                  <strong>{formatVnd(price.total)}</strong>
                </div>
              </div>
              <div className="quote-assurance">
                <CheckCheck size={16} />
                <span>Khách quen tự động được giảm đến 15%</span>
              </div>
              <button type="button" className="button primary quote-submit" onClick={openDialog}>
                Tiếp tục đặt lịch <ArrowRight size={17} />
              </button>
              <p className="quote-note">
                Bảng giá 250.000–400.000đ/ca trước ưu đãi. Lịch và giá được Cleanzy xác
                nhận trước khi thực hiện.
              </p>
            </aside>
          </div>
          <div className="under-booking">
            <span>
              <ShieldCheck size={17} /> Thông tin liên hệ chỉ dùng cho yêu cầu của bạn
            </span>
            <a href="#bang-gia">
              Xem cách tính giá <ArrowUpRight size={14} />
            </a>
          </div>
        </section>

        <section className="how-section container" id="cach-hoat-dong">
          <div className="how-intro">
            <span className="eyebrow">NHẸ NHÀNG TỪ BƯỚC ĐẦU</span>
            <h2>
              Sạch nhà chỉ với
              <br />3 bước nhỏ.
            </h2>
            <p>
              Không cần gọi hỏi giá.
              <br />
              Mọi thứ bắt đầu ngay tại đây.
            </p>
          </div>
          <div className="how-steps">
            {[
              {
                icon: MapPin,
                title: 'Cho chúng mình biết',
                text: 'Chọn dịch vụ, diện tích phù hợp, địa chỉ và lịch bạn muốn.',
              },
              {
                icon: Wallet,
                title: 'Xem giá rõ ràng',
                text: 'Tổng tiền thay đổi ngay theo lựa chọn, voucher khách quen tự trừ.',
              },
              {
                icon: Leaf,
                title: 'Gửi yêu cầu, thảnh thơi',
                text: 'Cleanzy gọi xác nhận lịch và nhân viên trước khi đến.',
              },
            ].map((s, i) => (
              <div className="how-step" key={s.title}>
                <span className="how-icon">
                  <s.icon size={22} strokeWidth={1.5} />
                </span>
                <span className="how-number">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pricing-section container" id="bang-gia">
          <div className="pricing-copy">
            <span className="eyebrow">MINH BẠCH ĐỂ BẠN AN TÂM</span>
            <h2>
              Việc nhà có giá.
              <br />
              Thời gian của bạn vô giá.
            </h2>
            <p>
              Một bảng giá đơn giản, không cần đoán.
              <br />
              Mỗi ca dành cho một nhân viên.
            </p>
            <span className="pricing-badge">
              <CircleCheck size={16} /> Tổng tiền không quá 400.000đ/ca
            </span>
          </div>
          <div className="price-table">
            <div className="price-table-header">
              <span>Thời lượng · Diện tích</span>
              <span>Giá cơ bản / ca</span>
            </div>
            {HOURS.map((h) => (
              <div className="price-row" key={h}>
                <span>
                  <Clock3 size={17} /> {h} giờ · ≈ {packageFor(h).area} m²
                  {h === 3 && <em>Vừa vặn</em>}
                </span>
                <strong>{formatVnd(250_000 + (h - 2) * 50_000)}</strong>
              </div>
            ))}
            <p>
              Thứ Bảy, Chủ nhật: +25.000đ · Từ 17:00: +25.000đ
              <br />
              Vệ sinh kỹ: +25.000đ · Không phụ phí theo địa chỉ.
              <br />
              Tổng phụ phí được điều chỉnh để giá không vượt 400.000đ.
            </p>
          </div>
        </section>

        <VoucherSection />

        <StaffSection />

        <section className="faq-section container">
          <div>
            <span className="eyebrow">MỘT VÀI ĐIỀU BẠN CÓ THỂ MUỐN BIẾT</span>
            <h2>Trước khi đặt lịch</h2>
          </div>
          <div className="faq-list">
            {[
              {
                q: 'Nên chọn bao nhiêu giờ cho nhà mình?',
                a: 'Dọn nhà 2 giờ phù hợp khoảng 55 m², 3 giờ khoảng 85 m² và 4 giờ khoảng 105 m². Nhà nhiều đồ, có trẻ nhỏ, thú cưng hoặc lâu chưa dọn có thể cần thêm thời gian.',
              },
              {
                q: 'Dịch vụ gồm những công việc gì?',
                a: 'Dọn dẹp nhà gồm quét, lau sàn, lau bề mặt, sắp xếp đồ và vệ sinh phòng tắm trong thời gian đã chọn. Dọn bếp tập trung vào chén bát, bề mặt bếp và sắp xếp khu vực nấu ăn. Vệ sinh kỹ dành thêm sự chú ý cho các góc khó làm sạch. Không gồm làm việc trên cao, xử lý hóa chất nguy hiểm hay vệ sinh công nghiệp.',
              },
              {
                q: 'Voucher khách quen hoạt động thế nào?',
                a: 'Mỗi yêu cầu đặt lịch được ghi nhận theo số điện thoại. Từ lần đặt thứ 3 bạn được giảm 5%, từ lần thứ 6 giảm 10% và từ lần thứ 10 giảm 15%. Voucher tự động trừ vào báo giá, không cần nhập mã.',
              },
              {
                q: 'Tôi có thể chọn nhân viên quen không?',
                a: 'Có. Ở bước gửi yêu cầu, bạn có thể chọn nhân viên mong muốn. Cleanzy sẽ ưu tiên sắp xếp nếu nhân viên đó còn lịch trống.',
              },
              {
                q: 'Gửi yêu cầu có nghĩa là đã đặt thành công?',
                a: 'Chưa. Sau khi gửi, yêu cầu được lưu ở trạng thái chờ xác nhận. Mã yêu cầu giúp bạn đối chiếu khi Cleanzy liên hệ. Bạn không cần thanh toán ở bước này.',
              },
            ].map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <ChevronDown size={18} />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <a className="brand" href="#">
            <Brand size={24} />
          </a>
          <span>Nhà sạch hơn. Bạn thảnh thơi hơn.</span>
          <span>© 2026 Cleanzy</span>
        </div>
      </footer>

      <dialog
        className="booking-dialog"
        ref={dialogRef}
        onCancel={(e) => (sending ? e.preventDefault() : setDialogOpen(false))}
        onClick={(e) => e.target === e.currentTarget && !sending && setDialogOpen(false)}
        aria-labelledby="dialog-title"
      >
        <button
          className="dialog-close"
          type="button"
          aria-label="Đóng"
          disabled={sending}
          onClick={() => setDialogOpen(false)}
        >
          <X size={21} />
        </button>
        {result ? (
          <div className="success-state">
            <span className="success-icon">
              <Check size={32} />
            </span>
            <span className="eyebrow">ĐÃ LƯU YÊU CẦU</span>
            <h2 id="dialog-title">
              Một bước gần hơn
              <br />
              đến nhà sạch.
            </h2>
            <p>
              Yêu cầu của bạn đang chờ xác nhận. Cleanzy sẽ liên hệ để xác nhận lịch và
              nhân viên thực hiện.
            </p>
            <div className="success-reference">
              <span>Mã yêu cầu</span>
              <strong>{result.reference}</strong>
            </div>
            <div className="success-details">
              <span>{scheduleLabel}</span>
              <strong>{formatVnd(result.price)}</strong>
              {result.discountPercent > 0 && (
                <span className="success-voucher">
                  <Gift size={14} /> Đã áp dụng {result.voucherCode} — giảm{' '}
                  {result.discountPercent}%
                </span>
              )}
              <span>
                {draft.address}, {draft.city}
              </span>
            </div>
            <p className="small-note">Chưa thanh toán · Chưa xác nhận nhân viên</p>
            <button className="button primary" type="button" onClick={() => setDialogOpen(false)}>
              Hoàn tất <Check size={17} />
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={submit}>
            <span className="eyebrow">CHỈ CÒN MỘT BƯỚC NỮA</span>
            <h2 id="dialog-title">Để Cleanzy liên hệ bạn.</h2>
            <p>Thông tin này được lưu cùng yêu cầu để chúng mình xác nhận lịch.</p>
            <div className="modal-summary">
              <CalendarDays size={18} />
              <span>
                {scheduleLabel} · ≈ {pkg.area} m²
              </span>
              <strong>{formatVnd(price.total)}</strong>
            </div>
            <label className="field">
              <span>Họ và tên</span>
              <input
                autoFocus
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                placeholder="Tên của bạn"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Số điện thoại</span>
              <input
                type="tel"
                required
                autoComplete="tel"
                maxLength={20}
                placeholder="Ví dụ: 0912 345 678"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              />
            </label>
            {loyalty && (
              <div className={`loyalty-hint ${loyalty.current ? 'has-voucher' : ''}`} role="status">
                <Gift size={16} />
                <span>
                  {loyalty.current
                    ? `Chào khách quen! Voucher ${loyalty.current.code} giảm ${loyalty.current.percent}% đã được áp dụng.`
                    : loyalty.next
                      ? `Đặt thêm ${loyalty.next.remaining} lần nữa (tính cả lần này) để nhận voucher giảm ${loyalty.next.percent}%.`
                      : 'Cảm ơn bạn đã tin chọn Cleanzy.'}
                </span>
              </div>
            )}
            <label className="field">
              <span>
                Nhân viên mong muốn <span className="optional">(không bắt buộc)</span>
              </span>
              <select
                value={contact.preferredStaff}
                onChange={(e) => setContact({ ...contact, preferredStaff: e.target.value })}
              >
                <option value="">Để Cleanzy sắp xếp</option>
                {STAFF.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>
                Ghi chú <span className="optional">(không bắt buộc)</span>
              </span>
              <textarea
                rows={3}
                maxLength={1000}
                placeholder="Công việc ưu tiên, hướng dẫn vào nhà..."
                value={contact.note}
                onChange={(e) => setContact({ ...contact, note: e.target.value })}
              />
            </label>
            <label className="honeypot" aria-hidden="true">
              Website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={contact.website}
                onChange={(e) => setContact({ ...contact, website: e.target.value })}
              />
            </label>
            <label className="consent">
              <input type="checkbox" required />
              <span>
                Tôi đồng ý để Cleanzy sử dụng thông tin liên hệ và địa chỉ cho yêu cầu này.
                Tôi hiểu lịch và giá cần được xác nhận.
              </span>
            </label>
            {submitError && (
              <p className="form-error" role="alert">
                {submitError}
              </p>
            )}
            <button className="button primary" type="submit" disabled={sending}>
              {sending ? 'Đang gửi…' : 'Gửi yêu cầu thuê'}
            </button>
            <p className="small-note">Không thanh toán trực tuyến. Không tự động xác nhận lịch.</p>
          </form>
        )}
      </dialog>
    </>
  )
}
