import taxonomy from "@/config/category-taxonomy.json";
import type { CategoryConfig, LibraryCategory } from "@/types/library";

export function getCategories(): CategoryConfig[] {
  return taxonomy.categories as CategoryConfig[];
}

export function getCategoryById(categoryId: LibraryCategory): CategoryConfig | undefined {
  return getCategories().find((category) => category.id === categoryId);
}

export function getCategoryName(categoryId: LibraryCategory): string {
  return getCategoryById(categoryId)?.name ?? categoryId;
}
