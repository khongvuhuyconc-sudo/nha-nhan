import { createFileRoute } from '@tanstack/react-router'
import { count, eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '../../db/index'
import { bookings } from '../../db/schema'
import { phoneKey, quote, staffBySlug, validateDraft, voucherFor } from '@/lib/khuy'

const input = z.object({
  id: z.uuid(),
  service: z.string(),
  city: z.string().trim(),
  address: z.string().trim(),
  date: z.string(),
  time: z.string(),
  hours: z.number().int(),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().max(20),
  note: z.string().trim().max(1000).default(''),
  preferredStaff: z.string().max(60).optional().default(''),
  website: z.string().optional().default(''),
})

function makeReference() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return 'KC-' + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
}

export const Route = createFileRoute('/api/bookings')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 })
        }
        const parsed = input.safeParse(body)
        if (!parsed.success)
          return Response.json(
            { error: 'Vui lòng kiểm tra lại họ tên và số điện thoại.' },
            { status: 400 },
          )
        const data = parsed.data
        // Honeypot field: bots fill it, people never see it.
        if (data.website) return Response.json({ error: 'Không gửi được yêu cầu.' }, { status: 400 })

        const draftError = validateDraft(data)
        if (draftError) return Response.json({ error: draftError }, { status: 400 })

        const key = phoneKey(data.phone)
        if (!key)
          return Response.json(
            { error: 'Số điện thoại chưa đúng. Ví dụ: 0912 345 678.' },
            { status: 400 },
          )

        const staff = data.preferredStaff ? staffBySlug(data.preferredStaff) : undefined

        // Retries reuse the same id, so a slow network never creates duplicates.
        const [existing] = await db.select().from(bookings).where(eq(bookings.id, data.id))
        if (existing) return Response.json(toResult(existing))

        const [{ value: previous }] = await db
          .select({ value: count() })
          .from(bookings)
          .where(eq(bookings.phoneKey, key))
        const voucher = voucherFor(previous)
        const price = quote(data, voucher?.percent ?? 0)

        const [row] = await db
          .insert(bookings)
          .values({
            id: data.id,
            reference: makeReference(),
            service: data.service,
            city: data.city,
            address: data.address,
            date: data.date,
            time: data.time,
            hours: data.hours,
            name: data.name,
            phone: data.phone,
            phoneKey: key,
            note: data.note,
            preferredStaff: staff?.slug ?? null,
            subtotal: price.subtotal,
            discountPercent: voucher?.percent ?? 0,
            voucherCode: voucher?.code ?? null,
            price: price.total,
          })
          .onConflictDoNothing()
          .returning()

        const saved =
          row ?? (await db.select().from(bookings).where(eq(bookings.id, data.id)))[0]
        return Response.json(toResult(saved), { status: 201 })
      },
    },
  },
})

function toResult(row: typeof bookings.$inferSelect) {
  return {
    reference: row.reference,
    subtotal: row.subtotal,
    price: row.price,
    discountPercent: row.discountPercent,
    voucherCode: row.voucherCode,
  }
}
