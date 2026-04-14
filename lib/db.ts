/**
 * Client-safe data access layer.
 * Uses hardcoded data from data/fixes.ts — no Node.js dependencies.
 * Used by client components (PolishCash, etc.).
 *
 * For server-side DB access (API routes, server components), use lib/db.server.ts.
 */
import { FIXES, TEAMS } from "@/data/fixes";
import type { Fix } from "@/types";

export function getFixes(team?: string, query?: string): Fix[] {
  let results = FIXES;

  if (team && team !== "All") {
    results = results.filter(f => f.team === team);
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(f =>
      f.title.toLowerCase().includes(q) ||
      f.component.toLowerCase().includes(q) ||
      f.author.toLowerCase().includes(q) ||
      f.team.toLowerCase().includes(q)
    );
  }

  return results;
}

export function getFixById(id: number): Fix | undefined {
  return FIXES.find(f => f.id === id);
}

export function getTeams(): string[] {
  return TEAMS;
}

export function getFixCount(): number {
  return FIXES.length;
}
