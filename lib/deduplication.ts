import type { DuplicateSignal, LibraryItem } from "../types/library";

export type DuplicateCheckResult =
  | {
      kind: "exact";
      duplicateOf: string;
      signals: DuplicateSignal[];
    }
  | {
      kind: "probable";
      duplicateOf: string;
      signals: DuplicateSignal[];
    }
  | {
      kind: "none";
      signals: [];
    };

export function checkDuplicateItem(
  candidate: Pick<
    LibraryItem,
    "name" | "description" | "sourceUrl" | "duplicateSignals"
  > & {
    htmlCode?: string;
    screenshotHash?: string;
  },
  existingItems: Array<
    Pick<LibraryItem, "id" | "name" | "description" | "sourceUrl"> & {
      htmlCode?: string;
      screenshotHash?: string;
    }
  >,
): DuplicateCheckResult {
  const signalsByItem = new Map<string, DuplicateSignal[]>();

  for (const item of existingItems) {
    const signals: DuplicateSignal[] = [];

    if (candidate.sourceUrl && item.sourceUrl && candidate.sourceUrl === item.sourceUrl) {
      signals.push({
        type: "source-url",
        confidence: "exact",
        matchedItemId: item.id,
      });
    }

    if (normalize(candidate.name) === normalize(item.name)) {
      signals.push({
        type: "name",
        confidence: "exact",
        matchedItemId: item.id,
      });
    }

    if (candidate.htmlCode && item.htmlCode && candidate.htmlCode === item.htmlCode) {
      signals.push({
        type: "html",
        confidence: "exact",
        matchedItemId: item.id,
      });
    }

    if (
      candidate.screenshotHash &&
      item.screenshotHash &&
      candidate.screenshotHash === item.screenshotHash
    ) {
      signals.push({
        type: "screenshot-hash",
        confidence: "exact",
        matchedItemId: item.id,
      });
    }

    const similarity = descriptionSimilarity(candidate.description, item.description);
    if (similarity >= 0.82) {
      signals.push({
        type: "description",
        confidence: "probable",
        matchedItemId: item.id,
        note: `description similarity ${similarity.toFixed(2)}`,
      });
    }

    if (signals.length > 0) {
      signalsByItem.set(item.id, signals);
    }
  }

  for (const [itemId, signals] of signalsByItem) {
    if (signals.some((signal) => signal.confidence === "exact")) {
      return {
        kind: "exact",
        duplicateOf: itemId,
        signals,
      };
    }
  }

  for (const [itemId, signals] of signalsByItem) {
    if (signals.some((signal) => signal.confidence === "probable")) {
      return {
        kind: "probable",
        duplicateOf: itemId,
        signals,
      };
    }
  }

  return {
    kind: "none",
    signals: [],
  };
}

export function normalize(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("de-DE")
    .replace(/\s+/g, " ");
}

function descriptionSimilarity(left: string, right: string): number {
  const leftTokens = tokenSet(left);
  const rightTokens = tokenSet(right);

  if (leftTokens.size === 0 || rightTokens.size === 0) {
    return 0;
  }

  let intersection = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      intersection += 1;
    }
  }

  const union = new Set([...leftTokens, ...rightTokens]).size;
  return intersection / union;
}

function tokenSet(value: string): Set<string> {
  return new Set(
    normalize(value)
      .split(/[^a-z0-9äöüß-]+/i)
      .filter((token) => token.length >= 3),
  );
}
