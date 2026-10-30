import { useState } from 'react'
import { Gift, Search, Ticket } from 'lucide-react'

import { VOUCHER_TIERS } from '@/lib/khuy'

export type LoyaltyStatus = {
  bookings: number
  current: { code: string; name: string; percent: number } | null
  next: { name: string; percent: number; remaining: number } | null
}

export async function fetchLoyalty(phone: string): Promise<LoyaltyStatus> {
  const res = await fetch(`/api/loyalty?phone=${encodeURIComponent(phone)}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Không kiểm tra được ưu đãi.')
  return data
}

export function VoucherSection() {
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<LoyaltyStatus | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function check(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      setStatus(await fetchLoyalty(phone))
    } catch (err) {
      setStatus(null)
      setError(err instanceof Error ? err.message : 'Không kiểm tra được ưu đãi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="voucher-section container" id="uu-dai">
      <div className="voucher-copy">
        <span className="eyebrow">ƯU ĐÃI KHÁCH QUEN</span>
        <h2>
          Thuê càng nhiều,
          <br />
          giảm càng sâu.
        </h2>
        <p>
          Voucher được áp dụng tự động theo số điện thoại bạn dùng khi đặt lịch. Không cần nhập
          mã, không cần nhớ — Cleanzy tự nhận ra khách quen.
        </p>
        <form className="voucher-check" onSubmit={check}>
          <label className="field">
            <span>Kiểm tra ưu đãi của bạn</span>
            <div className="input-wrap">
              <Search size={17} />
              <input
                type="tel"
                required
                maxLength={20}
                placeholder="Số điện thoại đã đặt lịch"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </label>
          <button className="button primary" type="submit" disabled={loading}>
            {loading ? 'Đang kiểm tra…' : 'Kiểm tra'}
          </button>
        </form>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {status && (
          <div className="voucher-result" role="status">
            <Gift size={20} />
            <div>
              <strong>
                Bạn đã đặt {status.bookings} lần.{' '}
                {status.current
                  ? `Lần tới được giảm ${status.current.percent}% (${status.current.code}).`
                  : 'Chưa có voucher.'}
              </strong>
              {status.next && (
                <span>
                  Đặt thêm {status.next.remaining} lần để lên hạng {status.next.name} — giảm{' '}
                  {status.next.percent}%.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="voucher-tiers">
        {VOUCHER_TIERS.map((t) => (
          <div className="voucher-ticket" key={t.code}>
            <div className="ticket-percent">
              <span>Giảm</span>
              <strong>{t.percent}%</strong>
            </div>
            <div className="ticket-body">
              <span className="ticket-tier">
                <Ticket size={13} /> {t.name}
              </span>
              <strong>{t.label}</strong>
              <span>
                Mã <code>{t.code}</code> · tự động áp dụng
              </span>
            </div>
          </div>
        ))}
        <p className="voucher-note">
          Giảm trên tổng tiền mỗi ca sau phụ phí. Số lần đặt được tính theo số điện thoại.
        </p>
      </div>
    </section>
  )
}
