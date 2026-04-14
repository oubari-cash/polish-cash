"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { TeamFilter } from "./TeamFilter";
import { SearchBar } from "./SearchBar";
import { FixFeed } from "./FixFeed";
import { HowItWorksModal } from "./modals/HowItWorksModal";
import { GetStartedModal } from "./modals/GetStartedModal";
import { FixDetailModal } from "./modals/FixDetailModal";
import { useDebounce } from "@/hooks/useDebounce";
import { getFixes, getTeams, getFixCount } from "@/lib/db";
import type { Fix } from "@/types";

export function PolishCash() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const teamParam = searchParams.get("team") ?? "All";
  const [filter, setFilter] = useState(teamParam);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput);
  const [processOpen, setProcessOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [selectedFix, setSelectedFix] = useState<Fix | null>(null);

  const teams = getTeams();
  const totalCount = getFixCount();
  const filtered = getFixes(filter, debouncedSearch);

  const handleFilterChange = (team: string) => {
    setFilter(team);
    const params = new URLSearchParams(searchParams.toString());
    if (team === "All") {
      params.delete("team");
    } else {
      params.set("team", team);
    }
    const query = params.toString();
    router.replace(query ? `/?${query}` : "/", { scroll: false });
  };

  return (
    <div style={{ background: "#fff", color: "#000", minHeight: "100vh" }}>
      <Header
        onHowItWorks={() => setProcessOpen(true)}
        onGetStarted={() => setSetupOpen(true)}
      />
      <Hero count={totalCount} />
      <TeamFilter teams={teams} active={filter} onChange={handleFilterChange} />
      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        resultCount={filtered.length}
        totalCount={totalCount}
      />
      <FixFeed
        fixes={filtered}
        onSelectFix={setSelectedFix}
        onSetupClick={() => setSetupOpen(true)}
      />
      <div style={{ height: 120 }} />

      <HowItWorksModal isOpen={processOpen} onClose={() => setProcessOpen(false)} />
      <GetStartedModal isOpen={setupOpen} onClose={() => setSetupOpen(false)} />
      <FixDetailModal fix={selectedFix} onClose={() => setSelectedFix(null)} />
    </div>
  );
}
