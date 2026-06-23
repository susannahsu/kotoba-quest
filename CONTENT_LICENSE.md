# Content & Data Licensing

This project's **source code** is MIT licensed (see `LICENSE`). This document covers the
**game content and third-party data**.

## Story & characters (fan use)

*Mushoku Tensei: Jobless Reincarnation* and its characters, names, and setting belong to their
respective creators and publishers. They are referenced here as a **non-commercial fan
tribute** under fair/fan use. This project is not affiliated with or endorsed by the rights
holders and must never be monetized.

## Vocabulary data

- The starter deck in `src/content/vocab/` is **hand-authored original content** written for
  this project (word, reading, romaji, gloss, JLPT tag).
- **Planned:** when full dictionary lookup is added, this project will bundle a subset of
  **JMdict / JMnedict**, which are the property of the **Electronic Dictionary Research and
  Development Group (EDRDG)** and licensed under **Creative Commons Attribution-ShareAlike 4.0
  (CC BY-SA 4.0)**. Attribution to EDRDG will be required and provided at that point.
  - JMdict (simplified JSON): https://github.com/scriptin/jmdict-simplified
  - JLPT vocabulary lists: https://github.com/Bluskyo/JLPT_Vocabulary
- "JLPT" is administered by the Japan Foundation and JEES; JLPT level tags here are
  community-sourced approximations for study convenience, not official.

## Art & audio

All visual art is **original placeholder geometry** generated in code (see
`src/game/scenes/BootScene.ts`) — no assets from the anime or novels are used. Audio uses the
browser's Web Speech API. See `public/assets/ASSETS_LICENSE.md` for details and the plan for
swapping in CC0 art/audio packs.
