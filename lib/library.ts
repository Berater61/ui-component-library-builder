import items from "@/data/library-items.json";
import type { LibraryCategory, LibraryItem } from "@/types/library";
import { getCategories } from "./categories";

export function getLibraryItems(): LibraryItem[] {
  return items as LibraryItem[];
}

export function getLibraryItemBySlug(slug: string): LibraryItem | undefined {
  return getLibraryItems().find((item) => item.slug === slug);
}

export function getLibraryItemById(id: string): LibraryItem | undefined {
  return getLibraryItems().find((item) => item.id === id);
}

export function getItemsByCategory(category: LibraryCategory): LibraryItem[] {
  return getLibraryItems().filter((item) => item.category === category);
}

export function getCategoryCounts(libraryItems = getLibraryItems()) {
  return getCategories()
    .map((category) => ({
      category,
      count: libraryItems.filter((item) => item.category === category.id).length
    }))
    .filter((entry) => entry.count > 0);
}

export function getBuilderCategories() {
  const libraryItems = getLibraryItems();
  return getCategories()
    .filter((category) => category.enabled)
    .filter((category) => libraryItems.some((item) => item.category === category.id))
    .sort((left, right) => left.order - right.order);
}
