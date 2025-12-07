import { DataSet, pattern } from "obscenity";
import { englishSafeDataset } from "#lib/moderation/englishSafeDataset.js";

export const englishExtendedDataset = new DataSet()
  .addAll(englishSafeDataset)

  // 🔥 Drugs
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "drug" })
      .addPattern(pattern`drug`)
      .addPattern(pattern`drugs`)
      .addPattern(pattern`drugdeal`)
  )
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "cocaine" })
      .addPattern(pattern`cocain[e]`)
      .addPattern(pattern`coke`)
  )
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "heroin" }).addPattern(pattern`heroin`)
  )
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "ecstasy" })
      .addPattern(pattern`ecstas[y]`)
      .addPattern(pattern`mdma`)
  )
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "meth" })
      .addPattern(pattern`meth`)
      .addPattern(pattern`methamphetamin`)
  )
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "weed" })
      .addPattern(pattern`weed`)
      .addPattern(pattern`marijuana`)
      .addPattern(pattern`cannabi[s]`)
  )

  // 🔥 Weapons
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "gun" })
      .addPattern(pattern`gun`)
      .addPattern(pattern`guns`)
      .addPattern(pattern`handgun`)
      .addPattern(pattern`firearm`)
  )
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "rifle" })
      .addPattern(pattern`rifle`)
      .addPattern(pattern`ak47`)
      .addPattern(pattern`ak-47`)
      .addPattern(pattern`kalashnikov`)
  )
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "shotgun" }).addPattern(pattern`shotgun`)
  )

  // 🔥 Violence
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "kill" })
      .addPattern(pattern`kill`)
      .addPattern(pattern`killing`)
      .addPattern(pattern`murder`)
  )
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "stab" })
      .addPattern(pattern`stab`)
      .addPattern(pattern`stabbing`)
  )
  .addPhrase((p) =>
    p.setMetadata({ originalWord: "assault" }).addPattern(pattern`assault`)
  )

  // 🔥 Criminal acts
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "robbery" })
      .addPattern(pattern`robbery`)
      .addPattern(pattern`rob`)
  )
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "kidnap" })
      .addPattern(pattern`kidnap`)
      .addPattern(pattern`kidnapping`)
  )
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "theft" })
      .addPattern(pattern`theft`)
      .addPattern(pattern`steal`)
  )

  // 🔥 Prostitution / exploitation
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "escort" })
      .addPattern(pattern`escort`)
      .addPattern(pattern`escorting`)
  )
  .addPhrase((p) =>
    p
      .setMetadata({ originalWord: "prostitute" })
      .addPattern(pattern`prostitut[e]`)
      .addPattern(pattern`prostitution`)
  );
