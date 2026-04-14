import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const fixes = sqliteTable("fixes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  team: text("team").notNull(),
  component: text("component").notNull(),
  author: text("author").notNull(),
  pr: text("pr").notNull(),
  date: text("date").notNull(),
  beforeLabel: text("before_label").notNull(),
  beforeImage: text("before_image"),
  afterLabel: text("after_label").notNull(),
  afterImage: text("after_image"),
  prUrl: text("pr_url"),
  linearTicketId: text("linear_ticket_id"),
  slackThreadUrl: text("slack_thread_url"),
  mergedAt: text("merged_at"),
  createdAt: text("created_at").notNull().default(""),
});
