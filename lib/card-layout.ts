/** Subtle height variation for masonry cards (not too asymmetric) */
export type CardAspectVariant = "standard" | "tall" | "compact";

export function getCardAspectVariant(index: number): CardAspectVariant {
  const variants: CardAspectVariant[] = ["standard", "tall", "compact"];
  return variants[index % 3]!;
}

export const CARD_ASPECT_CLASSES: Record<CardAspectVariant, string> = {
  standard: "aspect-[4/5]",
  tall: "aspect-[3/4]",
  compact: "aspect-square",
};
