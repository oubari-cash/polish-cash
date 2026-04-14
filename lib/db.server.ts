/**
 * Server-only database access layer.
 * Uses SQLite via Drizzle ORM. Only import this from server components, API routes, or scripts.
 */
import "server-only";
import { db } from "./drizzle";
import { fixes, teams } from "./schema";
import { eq, like, or, sql, and } from "drizzle-orm";
import type { Fix } from "@/types";

function rowToFix(row: typeof fixes.$inferSelect): Fix {
  return {
    id: row.id,
    title: row.title,
    team: row.team,
    component: row.component,
    author: row.author,
    pr: row.pr,
    date: row.date,
    before: { label: row.beforeLabel, image: row.beforeImage ?? undefined },
    after: { label: row.afterLabel, image: row.afterImage ?? undefined },
  };
}

export function getFixes(team?: string, query?: string): Fix[] {
  const conditions = [];

  if (team && team !== "All") {
    conditions.push(eq(fixes.team, team));
  }

  if (query) {
    const pattern = `%${query.toLowerCase()}%`;
    conditions.push(
      or(
        like(sql`lower(${fixes.title})`, pattern),
        like(sql`lower(${fixes.component})`, pattern),
        like(sql`lower(${fixes.author})`, pattern),
        like(sql`lower(${fixes.team})`, pattern),
      )!
    );
  }

  const rows = conditions.length > 0
    ? db.select().from(fixes).where(and(...conditions)).all()
    : db.select().from(fixes).all();

  return rows.map(rowToFix);
}

export function getFixById(id: number): Fix | undefined {
  const row = db.select().from(fixes).where(eq(fixes.id, id)).get();
  return row ? rowToFix(row) : undefined;
}

export function getTeams(): string[] {
  const rows = db.select({ name: teams.name }).from(teams).all();
  return ["All", ...rows.map(r => r.name)];
}

export function getFixCount(): number {
  const row = db.select({ count: sql<number>`count(*)` }).from(fixes).get();
  return row?.count ?? 0;
}
