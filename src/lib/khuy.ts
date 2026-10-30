// Shared business rules for Cleanzy: services, packages, pricing,
// loyalty vouchers and the staff roster. Used by both the page and the API.

export const BRAND = 'Cleanzy'

export const SERVICES = [
  {
    id: 'cleaning',
    name: 'Dọn dẹp nhà',
    description: 'Sạch từ phòng khách đến phòng ngủ',
    extra: 0,
  },
  {
    id: 'deep',
    name: 'Vệ sinh kỹ',
    description: 'Chăm chút những góc cần làm sạch sâu',
    extra: 25_000,
  },
  {
    id: 'kitchen',
    name: 'Dọn bếp',
    description: 'Gọn bếp, sạch bề mặt và rửa chén',
    extra: 0,
  },
] as const

export type ServiceId = (typeof SERVICES)[number]['id']

/** Duration packages and the floor area each one comfortably covers. */
export const PACKAGES = [
  {
    hours: 2,
    area: 55,
    name: 'Gói Gọn',
    fits: 'Căn hộ studio, 1 phòng ngủ',
    tasks: [
      'Quét, hút bụi và lau toàn bộ sàn',
      'Lau bàn ghế, kệ tủ, tay nắm cửa',
      'Vệ sinh 1 phòng tắm',
      'Gom và đổ rác',
    ],
  },
  {
    hours: 3,
    area: 85,
    name: 'Gói Vừa Vặn',
    fits: 'Căn hộ 2 phòng ngủ, nhà nhỏ',
    tasks: [
      'Toàn bộ công việc của gói 2 giờ',
      'Vệ sinh tối đa 2 phòng tắm',
      'Lau bếp, mặt đá, bồn rửa',
      'Sắp xếp lại đồ đạc, gấp chăn gối',
    ],
  },
  {
    hours: 4,
    area: 105,
    name: 'Gói Thảnh Thơi',
    fits: 'Căn hộ 3 phòng ngủ, nhà phố',
    tasks: [
      'Toàn bộ công việc của gói 3 giờ',
      'Lau cửa kính tầm thấp, ban công',
      'Vệ sinh bên ngoài tủ lạnh, lò vi sóng',
      'Chăm chút góc khuất, gầm giường',
    ],
  },
] as const

export const HOURS = PACKAGES.map((p) => p.hours)

export function packageFor(hours: number) {
  return PACKAGES.find((p) => p.hours === hours) ?? PACKAGES[1]
}

export const PRICE_CAP = 400_000

/** Loyalty tiers — based on how many earlier requests share a phone number. */
export const VOUCHER_TIERS = [
  {
    code: 'KHUYQUEN',
    name: 'Khách quen',
    minPrevious: 2,
    percent: 5,
    label: 'Từ lần đặt thứ 3',
  },
  {
    code: 'KHUYTHAN',
    name: 'Thân thiết',
    minPrevious: 5,
    percent: 10,
    label: 'Từ lần đặt thứ 6',
  },
  {
    code: 'KHUYVIP',
    name: 'Cleanzy VIP',
    minPrevious: 9,
    percent: 15,
    label: 'Từ lần đặt thứ 10',
  },
] as const

export type VoucherTier = (typeof VOUCHER_TIERS)[number]

export function voucherFor(previousBookings: number): VoucherTier | null {
  let tier: VoucherTier | null = null
  for (const t of VOUCHER_TIERS) if (previousBookings >= t.minPrevious) tier = t
  return tier
}

export function nextVoucher(previousBookings: number): VoucherTier | null {
  return VOUCHER_TIERS.find((t) => previousBookings < t.minPrevious) ?? null
}

export const STAFF = [
  { slug: 'khong-vu-huy', name: 'Khổng Vũ Huy', role: 'Trưởng nhóm vệ sinh kỹ', years: 4 },
  { slug: 'le-dinh-anh-huy', name: 'Lê Đình Anh Huy', role: 'Chuyên dọn nhà phố', years: 3 },
  { slug: 'do-thi-thanh-huyen', name: 'Đỗ Thị Thanh Huyền', role: 'Chuyên dọn bếp', years: 5 },
  { slug: 'le-thi-thu-huyen', name: 'Lê Thị Thu Huyền', role: 'Dọn dẹp căn hộ', years: 2 },
  { slug: 'ninh-thi-huyen', name: 'Ninh Thị Huyền', role: 'Sắp xếp & gấp đồ', years: 3 },
  { slug: 'bui-thuy-linh', name: 'Bùi Thùy Linh', role: 'Vệ sinh phòng tắm', years: 2 },
  { slug: 'duong-thi-khanh-linh', name: 'Dương Thị Khánh Linh', role: 'Dọn dẹp căn hộ', years: 1 },
] as const

export function staffBySlug(slug: string) {
  return STAFF.find((s) => s.slug === slug)
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (parts.at(-2)?.[0] ?? '') + (parts.at(-1)?.[0] ?? '')
}

export function formatVnd(value: number) {
  return `${new Intl.NumberFormat('vi-VN').format(value)}đ`
}

/** YYYY-MM-DD in Vietnam time, offset by a number of days. */
export function vnDate(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 864e5)
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

export type BookingDraft = {
  address: string
  city: string
  date: string
  time: string
  hours: number
  service: string
}

export function quote(b: BookingDraft, discountPercent = 0) {
  const base = 250_000 + (b.hours - 2) * 50_000
  const day = new Date(`${b.date}T12:00:00+07:00`).getUTCDay()
  const weekend = day === 0 || day === 6 ? 25_000 : 0
  const evening = Number(b.time.split(':')[0]) >= 17 ? 25_000 : 0
  const serviceFee = SERVICES.find((s) => s.id === b.service)?.extra ?? 0
  const raw = base + weekend + evening + serviceFee
  const cap = Math.max(0, raw - PRICE_CAP)
  const subtotal = raw - cap
  const voucher = Math.round((subtotal * discountPercent) / 100 / 1000) * 1000
  return {
    base,
    weekend,
    evening,
    serviceFee,
    cap,
    subtotal,
    voucher,
    total: subtotal - voucher,
  }
}

export function validateDraft(b: BookingDraft, now = Date.now()): string | null {
  if (typeof b.address !== 'string' || b.address.trim().length < 8 || b.address.length > 300)
    return 'Vui lòng nhập địa chỉ cụ thể (ít nhất 8 ký tự).'
  if (typeof b.city !== 'string' || !b.city.trim() || b.city.length > 80)
    return 'Vui lòng nhập tỉnh hoặc thành phố.'
  if (!HOURS.includes(b.hours as 2 | 3 | 4)) return 'Vui lòng chọn thời lượng từ 2 đến 4 giờ.'
  if (!SERVICES.some((s) => s.id === b.service)) return 'Dịch vụ không hợp lệ.'
  if (typeof b.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(b.date))
    return 'Vui lòng chọn ngày làm việc.'
  if (typeof b.time !== 'string' || !/^(0[7-9]|1[0-9]):(00|30)$/.test(b.time))
    return 'Vui lòng chọn giờ bắt đầu từ 07:00 đến 19:30.'
  const start = new Date(`${b.date}T${b.time}:00+07:00`)
  if (!Number.isFinite(start.getTime())) return 'Ngày làm việc không hợp lệ.'
  if (start.getTime() <= now) return 'Ngày giờ đã qua. Vui lòng chọn một thời điểm trong tương lai.'
  if (start.getTime() > now + 90 * 864e5) return 'Vui lòng đặt lịch trong vòng 90 ngày tới.'
  return null
}

/** Normalises Vietnamese phone numbers so "+84 912…" and "0912…" match. */
export function phoneKey(phone: string): string | null {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('84')) digits = '0' + digits.slice(2)
  return /^0\d{9,10}$/.test(digits) ? digits : null
}
