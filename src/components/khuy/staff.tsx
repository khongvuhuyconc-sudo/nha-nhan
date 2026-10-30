import { useEffect, useRef, useState } from 'react'
import { Check, MessageSquareHeart, Star, X } from 'lucide-react'

import { STAFF, initials, staffBySlug } from '@/lib/khuy'
import type { PublicReview, StaffSummary } from '@/routes/api.reviews'

function Stars({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <span className="stars" aria-label={`${value.toFixed(1)} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(value) ? 'on' : ''}
          fill="currentColor"
          strokeWidth={0}
        />
      ))}
    </span>
  )
}

export function StaffSection() {
  const [summaries, setSummaries] = useState<StaffSummary[]>([])
  const [reviews, setReviews] = useState<PublicReview[]>([])
  const [loaded, setLoaded] = useState(false)
  const [filter, setFilter] = useState<string>('')
  const [target, setTarget] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setSummaries(d.summaries)
        setReviews(d.reviews)
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  function added(review: PublicReview) {
    setReviews((list) => [review, ...list])
    setSummaries((list) =>
      list.map((s) =>
        s.slug === review.staffSlug
          ? {
              ...s,
              total: s.total + 1,
              average: (s.average * s.total + review.rating) / (s.total + 1),
            }
          : s,
      ),
    )
  }

  const shown = filter ? reviews.filter((r) => r.staffSlug === filter) : reviews

  return (
    <section className="staff-section container" id="nhan-vien">
      <div className="section-heading">
        <div>
          <span className="eyebrow">ĐỘI NGŨ KHUY CLEANER</span>
          <h2>Đánh giá nhân viên</h2>
        </div>
        <span className="heading-note">
          <MessageSquareHeart size={17} /> Mỗi đánh giá giúp chúng mình tốt hơn
        </span>
      </div>

      <div className="staff-grid">
        {STAFF.map((s, i) => {
          const sum = summaries.find((x) => x.slug === s.slug)
          return (
            <article className="staff-card" key={s.slug}>
              <span className={`staff-avatar tone-${i % 4}`} aria-hidden="true">
                {initials(s.name)}
              </span>
              <h3>{s.name}</h3>
              <span className="staff-role">
                {s.role} · {s.years} năm
              </span>
              <div className="staff-rating">
                {sum && sum.total > 0 ? (
                  <>
                    <Stars value={sum.average} />
                    <strong>{sum.average.toFixed(1)}</strong>
                    <span>({sum.total})</span>
                  </>
                ) : (
                  <span>{loaded ? 'Chưa có đánh giá' : 'Đang tải…'}</span>
                )}
              </div>
              <div className="staff-actions">
                <button type="button" className="button primary" onClick={() => setTarget(s.slug)}>
                  Đánh giá
                </button>
                {sum && sum.total > 0 && (
                  <button
                    type="button"
                    className="button ghost"
                    aria-pressed={filter === s.slug}
                    onClick={() => setFilter(filter === s.slug ? '' : s.slug)}
                  >
                    {filter === s.slug ? 'Bỏ lọc' : 'Xem'}
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>

      <div className="review-list">
        <div className="review-list-head">
          <h3>
            {filter ? `Nhận xét về ${staffBySlug(filter)?.name}` : 'Nhận xét gần đây'}
          </h3>
          {filter && (
            <button type="button" className="link-button" onClick={() => setFilter('')}>
              Xem tất cả
            </button>
          )}
        </div>
        {shown.length === 0 ? (
          <p className="review-empty">
            {loaded
              ? 'Chưa có nhận xét nào. Hãy là người đầu tiên đánh giá nhân viên đã dọn nhà cho bạn.'
              : 'Đang tải nhận xét…'}
          </p>
        ) : (
          <div className="review-items">
            {shown.slice(0, 9).map((r) => (
              <figure className="review-item" key={r.id}>
                <Stars value={r.rating} />
                <blockquote>{r.comment}</blockquote>
                <figcaption>
                  <strong>{r.reviewerName}</strong> về {staffBySlug(r.staffSlug)?.name} ·{' '}
                  {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      <ReviewDialog slug={target} onClose={() => setTarget(null)} onAdded={added} />
    </section>
  )
}

function ReviewDialog({
  slug,
  onClose,
  onAdded,
}: {
  slug: string | null
  onClose: () => void
  onAdded: (r: PublicReview) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [form, setForm] = useState({ reviewerName: '', comment: '', website: '' })
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const staff = slug ? staffBySlug(slug) : undefined

  useEffect(() => {
    if (slug) {
      setRating(0)
      setError('')
      setDone(false)
      ref.current?.showModal()
    } else ref.current?.close()
  }, [slug])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) return setError('Vui lòng chọn số sao.')
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating, staffSlug: slug }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Không gửi được đánh giá.')
      onAdded(data)
      setForm({ reviewerName: form.reviewerName, comment: '', website: '' })
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không gửi được đánh giá.')
    } finally {
      setSending(false)
    }
  }

  const labels = ['', 'Chưa hài lòng', 'Tạm được', 'Ổn', 'Tốt', 'Tuyệt vời']

  return (
    <dialog
      className="booking-dialog"
      ref={ref}
      onCancel={(e) => (sending ? e.preventDefault() : onClose())}
      onClick={(e) => e.target === e.currentTarget && !sending && onClose()}
      aria-labelledby="review-title"
    >
      <button className="dialog-close" type="button" aria-label="Đóng" onClick={onClose}>
        <X size={21} />
      </button>
      {done ? (
        <div className="success-state">
          <span className="success-icon">
            <Check size={32} />
          </span>
          <span className="eyebrow">CẢM ƠN BẠN</span>
          <h2 id="review-title">Đánh giá đã được ghi nhận.</h2>
          <p>Nhận xét của bạn về {staff?.name} giúp đội ngũ Khuy Cleaner làm tốt hơn mỗi ngày.</p>
          <button className="button primary" type="button" onClick={onClose}>
            Hoàn tất <Check size={17} />
          </button>
        </div>
      ) : (
        <form className="contact-form" onSubmit={submit}>
          <span className="eyebrow">ĐÁNH GIÁ NHÂN VIÊN</span>
          <h2 id="review-title">{staff?.name}</h2>
          <p>{staff?.role}. Bạn thấy buổi dọn dẹp thế nào?</p>
          <div className="star-picker" role="radiogroup" aria-label="Số sao">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} sao`}
                className={n <= (hover || rating) ? 'on' : ''}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
              >
                <Star size={30} fill="currentColor" strokeWidth={0} />
              </button>
            ))}
            <span>{labels[hover || rating]}</span>
          </div>
          <label className="field">
            <span>Tên của bạn</span>
            <input
              required
              minLength={2}
              maxLength={60}
              placeholder="Ví dụ: Chị Mai"
              value={form.reviewerName}
              onChange={(e) => setForm({ ...form, reviewerName: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Nhận xét</span>
            <textarea
              rows={4}
              required
              minLength={5}
              maxLength={600}
              placeholder="Điều bạn hài lòng, hoặc điều nhân viên có thể làm tốt hơn…"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
          </label>
          <label className="honeypot" aria-hidden="true">
            Website
            <input
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="button primary" type="submit" disabled={sending}>
            {sending ? 'Đang gửi…' : 'Gửi đánh giá'}
          </button>
        </form>
      )}
    </dialog>
  )
}
