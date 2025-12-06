import { DataSet, pattern } from "obscenity";

export const czechDataset = new DataSet()

  // 🔥 Drogová témata
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "drogy" })
      .addPattern(pattern`drog[y]`)
      .addPattern(pattern`drog`)
  )
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "pervitin" }).addPattern(pattern`pervitin`)
  )
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "heroin" }).addPattern(pattern`heroin`)
  )
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "kokain" }).addPattern(pattern`koka[i]n`)
  )
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "metamfetamin" })
      .addPattern(pattern`metamfetamin`)
      .addPattern(pattern`metamfetam`)
  )

  // 🔥 Sexuální / placené služby
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "porno" }).addPattern(pattern`porno`)
  )
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "sexuální služby" })
      .addPattern(pattern`sexua[l]n[i]`)
      .addPattern(pattern`sexsluzb`)
  )
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "prostitutka" })
      .addPattern(pattern`prostitut`)
  )
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "escort" }).addPattern(pattern`escort`)
  )

  // 🔥 Násilí
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "zabit" }).addPattern(pattern`zab[i]t`)
  )
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "usmrtit" }).addPattern(pattern`usmrtit`)
  )
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "vražda" }).addPattern(pattern`vrazd[a]`)
  )

  // 🔥 Hate / urážky
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "negr" }).addPattern(pattern`negr`)
  )
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "cikán" }).addPattern(pattern`cikan`)
  )
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "židák" }).addPattern(pattern`zidak`)
  )
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "nenávist" }).addPattern(pattern`nenavist`)
  )

  // Vulgarismy (sex / agresivní vulgarita)
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "jebat" })
      .addPattern(pattern`jebat`)
      .addPattern(pattern`jeb`)
  )

  .addPhrase((p) =>
    p.setMetadata({ originalWord: "vyjebat" }).addPattern(pattern`vyjeb`)
  )

  .addPhrase((p) =>
    p.setMetadata({ originalWord: "pojebu" }).addPattern(pattern`pojebu`)
  )

  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "mrd" })
      .addPattern(pattern`mrd`)
      .addPattern(pattern`mrdat`)
  )

  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "šukat" })
      .addPattern(pattern`šukat`)
      .addPattern(pattern`sukat`)
  )

  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "šoust" })
      .addPattern(pattern`šou[s]t`)
      .addPattern(pattern`sou[s]t`)
  )

  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "píča" })
      .addPattern(pattern`p[i]ca`)
      .addPattern(pattern`p[i]c[a]`)
  )

  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "čurák" })
      .addPattern(pattern`curak`)
      .addPattern(pattern`čur[a]k`)
  )

  .addPhrase((p) =>
    p.setMetadata({ originalWord: "kokot" }).addPattern(pattern`kokot`)
  )

  .addPhrase((p) =>
    p.setMetadata({ originalWord: "kurva" }).addPattern(pattern`kur[v]a`)
  )

  // 🔥 Kriminalita
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "loupež" }).addPattern(pattern`loupez`)
  )
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "krádež" }).addPattern(pattern`kradez`)
  )
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "únos" })
      .addPattern(pattern`unos`)
      .addPattern(pattern`unesen`)
  );
