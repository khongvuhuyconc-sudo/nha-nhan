import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const bookings = pgTable(
  'bookings',
  {
    id: uuid().primaryKey(),
    reference: text().notNull().unique(),
    service: text().notNull(),
    city: text().notNull(),
    address: text().notNull(),
    date: text().notNull(),
    time: text().notNull(),
    hours: integer().notNull(),
    name: text().notNull(),
    phone: text().notNull(),
    phoneKey: text('phone_key').notNull(),
    note: text().notNull().default(''),
    preferredStaff: text('preferred_staff'),
    subtotal: integer().notNull(),
    discountPercent: integer('discount_percent').notNull().default(0),
    voucherCode: text('voucher_code'),
    price: integer().notNull(),
    status: text().notNull().default('pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [index('bookings_phone_key_idx').on(t.phoneKey)],
)

export const staffReviews = pgTable(
  'staff_reviews',
  {
    id: serial().primaryKey(),
    staffSlug: text('staff_slug').notNull(),
    rating: integer().notNull(),
    comment: text().notNull(),
    reviewerName: text('reviewer_name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [index('staff_reviews_staff_slug_idx').on(t.staffSlug)],
)
