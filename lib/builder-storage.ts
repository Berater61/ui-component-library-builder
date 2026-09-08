"use client";

import { emptyBuilderState, type BuilderState } from "@/types/builder";

export const builderStorageKey = "website-library-builder-state";

export function loadBuilderState(): BuilderState {
  const raw = window.localStorage.getItem(builderStorageKey);
  if (!raw) {
    return {
      ...emptyBuilderState,
      basics: { ...emptyBuilderState.basics }
    };
  }

  try {
    const parsed = JSON.parse(raw) as BuilderState;
    return {
      ...emptyBuilderState,
      ...parsed,
      basics: {
        ...emptyBuilderState.basics,
        ...parsed.basics
      },
      selectedItems: Array.isArray(parsed.selectedItems) ? parsed.selectedItems : [],
      skippedCategories: Array.isArray(parsed.skippedCategories) ? parsed.skippedCategories : []
    };
  } catch {
    return {
      ...emptyBuilderState,
      basics: { ...emptyBuilderState.basics }
    };
  }
}

export function saveBuilderState(state: BuilderState) {
  window.localStorage.setItem(
    builderStorageKey,
    JSON.stringify({
      ...state,
      updatedAt: new Date().toISOString()
    })
  );
}
