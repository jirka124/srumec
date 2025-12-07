import { DataSet, englishDataset } from "obscenity";

export const englishSafeDataset = new DataSet()
  .addAll(englishDataset)
  .removePhrasesIf((phrase) => phrase.metadata?.originalWord === "anal");
