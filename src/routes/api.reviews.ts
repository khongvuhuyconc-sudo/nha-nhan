import { createFileRoute } from '@tanstack/react-router'
import { avg, count, desc } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '../../db/index'
import { staffReviews } from '../../db/schema'
import { STAFF, staffBySlug } from '@/lib/khuy'

const input = z.object({
  staffSlug: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(5).max(600),
  reviewerName: z.string().trim().min(2).max(60),
  website: z.string().optional().default(''),
})

export type StaffSummary = {
  slug: string
  average: number
  total: number
}

export type PublicReview = {
  id: number
  staffSlug: string
  rating: number
  comment: string
  reviewerName: string
  createdAt: string
}

export const Route = createFileRoute('/api/reviews')({
  server: {
    handlers: {
      GET: async () => {
        const stats = await db
          .select({
            slug: staffReviews.staffSlug,
            average: avg(staffReviews.rating),
            total: count(),
          })
          .from(staffReviews)
          .groupBy(staffReviews.staffSlug)
        const recent = await db
          .select()
          .from(staffReviews)
          .orderBy(desc(staffReviews.createdAt))
          .limit(30)

        const summaries: StaffSummary[] = STAFF.map((s) => {
          const row = stats.find((r) => r.slug === s.slug)
          return {
            slug: s.slug,
            average: row?.average ? Number(row.average) : 0,
            total: row?.total ?? 0,
          }
        })
        const reviews: PublicReview[] = recent.map((r) => ({
          id: r.id,
          staffSlug: r.staffSlug,
          rating: r.rating,
          comment: r.comment,
          reviewerName: r.reviewerName,
          createdAt: r.createdAt.toISOString(),
        }))
        return Response.json({ summaries, reviews })
      },
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
            { error: 'Vui lòng chọn số sao, nhập tên và nhận xét (ít nhất 5 ký tự).' },
            { status: 400 },
          )
        const data = parsed.data
        if (data.website) return Response.json({ error: 'Không gửi được đánh giá.' }, { status: 400 })
        if (!staffBySlug(data.staffSlug))
          return Response.json({ error: 'Không tìm thấy nhân viên.' }, { status: 400 })

        const [row] = await db
          .insert(staffReviews)
          .values({
            staffSlug: data.staffSlug,
            rating: data.rating,
            comment: data.comment,
            reviewerName: data.reviewerName,
          })
          .returning()
        const review: PublicReview = { ...row, createdAt: row.createdAt.toISOString() }
        return Response.json(review, { status: 201 })
      },
    },
  },
})
