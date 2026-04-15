export interface Fix {
  id: number;
  title: string;
  team: string;
  pr: string;
  date: string;
  author: string;
  before: { label: string; image?: string };
  after: { label: string; image?: string };
  component: string;
}

export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
  /** "You" = designer action, "Automated" = runs without manual steps */
  badge?: "You" | "Automated";
}

export interface SetupStep {
  id: number;
  title: string;
  desc: string;
  action: string;
}
