"use client";

import { useMemo, useState } from "react";
import type { CategoryConfig } from "@/types/library";
import type { LibraryItem } from "@/types/library";
import { LibraryCard } from "./LibraryCard";
import { CustomSelect } from "./ui/CustomSelect";

export function LibraryFilters({ items, categories }: { items: LibraryItem[]; categories: CategoryConfig[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("de-DE");
    return items.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const haystack = [item.name, item.description, item.subcategory, item.tags.join(" ")]
        .join(" ")
        .toLocaleLowerCase("de-DE");
      return matchesCategory && (normalizedQuery.length === 0 || haystack.includes(normalizedQuery));
    });
  }, [category, items, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="surface grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_260px]">
        <label className="grid gap-1 text-sm font-medium">
          Suche
          <input
            className="focus-ring rounded-md border bg-transparent px-3 py-3"
            style={{ borderColor: "var(--border)" }}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, Tag oder Beschreibung"
          />
        </label>
        <CustomSelect
          label="Kategorie"
          value={category}
          onChange={setCategory}
          options={[
            { value: "all", label: "Alle Kategorien" },
            ...categories.map((entry) => ({
              value: entry.id,
              label: entry.name
            }))
          ]}
        />
      </div>

      <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        {filteredItems.length} Einträge gefunden
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Bibliothekseinträge">
        {filteredItems.map((item) => (
          <LibraryCard item={item} key={item.id} />
        ))}
      </section>
    </div>
  );
}
