import {
  collapseDuplicatesTransformer,
  resolveConfusablesTransformer,
  resolveLeetSpeakTransformer,
  toAsciiLowerCaseTransformer,
} from "obscenity";

// Transformery pro "černou listinu" (to, co chceme chytat i když je to rozbité/leet)
export const czechBlacklistTransformers = [
  resolveConfusablesTransformer(),
  resolveLeetSpeakTransformer(),
  toAsciiLowerCaseTransformer(),
  collapseDuplicatesTransformer({
    defaultThreshold: 1,
    customThresholds: new Map([
      ["b", 2],
      ["e", 2],
      ["o", 2],
      ["l", 2],
      ["s", 2],
      ["g", 2],
    ]),
  }),
];

// Transformery pro whitelist (pokud bys chtěl někdy používat)
export const czechWhitelistTransformers = [
  toAsciiLowerCaseTransformer(),
  collapseDuplicatesTransformer({
    defaultThreshold: Number.POSITIVE_INFINITY,
    customThresholds: new Map([[" ", 1]]), // jen spojování mezer
  }),
];

export const czechRecommendedTransformers = {
  blacklistMatcherTransformers: czechBlacklistTransformers,
  whitelistMatcherTransformers: czechWhitelistTransformers,
};
