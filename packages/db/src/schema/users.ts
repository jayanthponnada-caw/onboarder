import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	email: varchar("email", { length: 320 }).notNull().unique(),
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	name: varchar("name", { length: 255 }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
