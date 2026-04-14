/**
 * Seed script — migrates hardcoded fix data into the SQLite database.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Safe to run multiple times — clears existing data before inserting.
 */

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sql } from "drizzle-orm";
import * as schema from "../lib/schema";
import { FIXES, TEAMS } from "../data/fixes";
import path from "path";

const DB_PATH = process.env.DATABASE_URL || path.join(process.cwd(), "polish-cash.db");
const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");

const db = drizzle(sqlite, { schema });

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS fixes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    team TEXT NOT NULL,
    component TEXT NOT NULL,
    author TEXT NOT NULL,
    pr TEXT NOT NULL,
    date TEXT NOT NULL,
    before_label TEXT NOT NULL,
    before_image TEXT,
    after_label TEXT NOT NULL,
    after_image TEXT,
    pr_url TEXT,
    linear_ticket_id TEXT,
    slack_thread_url TEXT,
    merged_at TEXT,
    created_at TEXT NOT NULL DEFAULT ''
  );
`);

// Clear existing data
db.delete(schema.fixes).run();
db.delete(schema.teams).run();

// Seed teams (skip "All" — it's a UI-only filter)
const teamNames = TEAMS.filter(t => t !== "All");
for (const name of teamNames) {
  db.insert(schema.teams).values({
    name,
    slug: name.toLowerCase(),
  }).run();
}

// Seed fixes
for (const fix of FIXES) {
  db.insert(schema.fixes).values({
    id: fix.id,
    title: fix.title,
    team: fix.team,
    component: fix.component,
    author: fix.author,
    pr: fix.pr,
    date: fix.date,
    beforeLabel: fix.before.label,
    beforeImage: fix.before.image ?? null,
    afterLabel: fix.after.label,
    afterImage: fix.after.image ?? null,
    createdAt: new Date().toISOString(),
  }).run();
}

const fixCount = db.select({ count: sql<number>`count(*)` }).from(schema.fixes).get();
const teamCount = db.select({ count: sql<number>`count(*)` }).from(schema.teams).get();

console.log(`Seeded ${fixCount?.count} fixes and ${teamCount?.count} teams into ${DB_PATH}`);

sqlite.close();
