/** Accent dots for search, filters, and cards — one hue per team */
export const TEAM_DOT_COLORS: Record<string, string> = {
  All: "#636366",
  Lending: "#0A84FF",
  Banking: "#34C759",
  "Core Experiences": "#BF5AF2",
  Trust: "#FF9F0A",
  Intelligence: "#FF453A",
  Commerce: "#FFD60A",
  P2P: "#FFD60A",
  Moneybot: "#BF5AF2",
};

export function teamDotColor(team: string): string {
  return TEAM_DOT_COLORS[team] ?? "#636366";
}
