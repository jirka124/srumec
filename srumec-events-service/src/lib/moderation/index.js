import { RegExpMatcher, englishRecommendedTransformers } from "obscenity";

import { englishExtendedDataset } from "#lib/moderation/englishExtendedDataset.js";
import { czechDataset } from "#lib/moderation/czDataset.js";
import { czechRecommendedTransformers } from "#lib/moderation/czTransformers.js";

// EN matcher (obscenity + drogy + násilí atd.)
const englishMatcher = new RegExpMatcher({
  ...englishExtendedDataset.build(),
  ...englishRecommendedTransformers,
});

// CZ matcher (náš vlastní dataset)
const czechMatcher = new RegExpMatcher({
  ...czechDataset.build(),
  ...czechRecommendedTransformers,
});

export function containsBadContent(str) {
  if (!str) return false;

  return englishMatcher.hasMatch(str) || czechMatcher.hasMatch(str);
}

export function resolveEventStatus({ incomingStatus, title, description }) {
  if (incomingStatus !== undefined) return incomingStatus;

  const bad = containsBadContent(title) || containsBadContent(description);

  return bad ? "pending" : "approved";
}
