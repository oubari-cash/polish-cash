"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { TeamFilter } from "./TeamFilter";
import { SearchOverlay } from "./SearchOverlay";
import { FixFeed } from "./FixFeed";
import { HowItWorksModal } from "./modals/HowItWorksModal";
import { getFixes, getFixCount } from "@/lib/db";
import styles from "./styles/PolishCash.module.css";

const CATEGORIES = ["Lending", "Banking", "Core Experiences", "Trust", "Intelligence", "Commerce"];

export function PolishCash() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const teamParam = searchParams.get("team");
  const filter = teamParam && teamParam !== "All" ? teamParam : null;
  const [searchInput, setSearchInput] = useState("");
  const [processOpen, setProcessOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);

  const totalCount = getFixCount();
  const teamForQuery = filter ?? undefined;
  const filtered = getFixes(teamForQuery, searchInput.trim() || undefined);
  const overlayMatches = searchInput.trim() ? getFixes(teamForQuery, searchInput.trim()) : [];

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== "k" || (!e.metaKey && !e.ctrlKey)) return;
      if (processOpen) return;
      e.preventDefault();
      setSearchOverlayOpen(o => {
        if (!o) {
          setSearchInput("");
          return true;
        }
        return false;
      });
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [processOpen]);

  const handleTeamClick = (team: string) => {
    const next = filter === team ? null : team;
    const params = new URLSearchParams(searchParams.toString());
    if (next === null) {
      params.delete("team");
    } else {
      params.set("team", next);
    }
    const query = params.toString();
    router.replace(query ? `/?${query}` : "/", { scroll: false });
  };

  return (
    <div className={styles.page}>
      <Header
        onHowItWorks={() => {
          setSearchOverlayOpen(false);
          setProcessOpen(true);
        }}
      />
      <Hero count={totalCount} />
      <TeamFilter
        teams={CATEGORIES}
        active={filter}
        onChange={handleTeamClick}
        searchQuery={searchInput}
        onSearchClick={() => {
          setSearchInput("");
          setSearchOverlayOpen(true);
        }}
        onClearSearch={() => setSearchInput("")}
      />
      <FixFeed fixes={filtered} />
      <div style={{ height: 120 }} />

      <SearchOverlay
        isOpen={searchOverlayOpen}
        onClose={() => setSearchOverlayOpen(false)}
        value={searchInput}
        onChange={setSearchInput}
        matches={overlayMatches}
        onSelectFix={id => {
          setSearchOverlayOpen(false);
          requestAnimationFrame(() => {
            document.getElementById(`fix-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        }}
      />

      <HowItWorksModal isOpen={processOpen} onClose={() => setProcessOpen(false)} />
    </div>
  );
}
