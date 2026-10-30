import { createFileRoute } from '@tanstack/react-router'
import { count, eq } from 'drizzle-orm'

import { db } from '../../db/index'
import { bookings } from '../../db/schema'
import { nextVoucher, phoneKey, voucherFor } from '@/lib/khuy'

export const Route = createFileRoute('/api/loyalty')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const phone = new URL(request.url).searchParams.get('phone') ?? ''
        const key = phoneKey(phone)
        if (!key)
          return Response.json(
            { error: 'Số điện thoại chưa đúng. Ví dụ: 0912 345 678.' },
            { status: 400 },
          )
        const [{ value: previous }] = await db
          .select({ value: count() })
          .from(bookings)
          .where(eq(bookings.phoneKey, key))
        const current = voucherFor(previous)
        const next = nextVoucher(previous)
        return Response.json({
          bookings: previous,
          current: current && { code: current.code, name: current.name, percent: current.percent },
          next: next && {
            name: next.name,
            percent: next.percent,
            remaining: next.minPrevious - previous,
          },
        })
      },
    },
  },
})
