import type { ImageSourcePropType } from "react-native";

interface RAConfig {
  flag: ImageSourcePropType;
  neighborhoodKeywords: string[];
}

const raFlagsMap: Record<string, RAConfig> = {
  gama: {
    flag: require("../assets/flags/ra_gama.jpg"),
    neighborhoodKeywords: [
      "gama sul",
      "gama centro",
      "setor central",
      "gama norte",
    ],
  },
};

export function findFlag(
  neighborhood?: string,
  city?: string,
): ImageSourcePropType | undefined {
  const neighborhoodText = neighborhood?.toLowerCase().trim() ?? "";
  const cityText = city?.toLowerCase().trim() ?? "";

  // Phase 1: match by neighborhood keywords (prioridade)
  for (const ra of Object.values(raFlagsMap)) {
    const matchesNeighborhood = ra.neighborhoodKeywords.some((keyword) =>
      neighborhoodText.includes(keyword),
    );
    if (matchesNeighborhood) return ra.flag;
  }

  // Phase 2: fallback para cidade/RA
  for (const [raKey, ra] of Object.entries(raFlagsMap)) {
    if (cityText.includes(raKey)) return ra.flag;
  }

  return undefined;
}

export function getDisplayText(neighborhood?: string, city?: string): string {
  const neighborhoodClean = neighborhood?.trim();
  if (neighborhoodClean) return neighborhoodClean;
  return city?.trim() ?? "";
}
