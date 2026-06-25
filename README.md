# 言葉クエスト · Mushoku Tensei: Kotoba Quest

> A 2D top-down action RPG that teaches you Japanese. Walk the world, talk to people, and
> cast spells with the words you master. **Language is magic.**

A fan project inspired by *Mushoku Tensei* — you play Rudeus, reincarnated into a world of
magic, re-learning how to read and speak. Built with **Phaser 3 + React + TypeScript**.

---

## ✨ The idea

Rudeus has to re-learn language in his new life — and so do you. So the Japanese learning
*is* the game's magic system:

- **Walk** a tile world (Phaser), talk to NPCs, and read everything in Japanese.
- **Tap glowing words** in dialogue to look them up and add them to your **Grimoire**.
- **Fight** Mana Beasts by solving quick Japanese challenges (pick the reading, the meaning,
  or type the kana). Correct + fast = a stronger spell.
- Words you **master** (via the FSRS spaced-repetition algorithm) become your most powerful
  spells. Studying literally levels you up.
- A single **Japanese level** setting (Beginner → N5 → N4–N3 → Advanced) rescales furigana,
  romaji, and support — switchable any time.

## 🎮 Controls

| Action | Keys |
| --- | --- |
| Move | `WASD` or arrow keys |
| Talk / Fight | `Space` (near an NPC or enemy) |
| Advance dialogue | `Space` / click |
| Open Grimoire / Settings | buttons, top-right |

## 🚀 Run it locally

Requires Node 18+.

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build      # typecheck + production build (outputs to dist/)
npm run test       # unit tests (Vitest)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## 🌐 Deploy (GitHub Pages)

Pushing to `main` builds and deploys via GitHub Actions (`.github/workflows/deploy.yml`).
The Vite `base` is set to `/kotoba-quest/` for production — **if you rename the repo, update
`base` in [`vite.config.ts`](vite.config.ts)** to match, or Pages assets will 404.

## 🧱 Tech & architecture

- **Phaser 3** renders the walkable world (tilemap, movement, collision, camera).
- **React** renders all text/learning UI overlays (dialogue, furigana, dictionary, Grimoire,
  combat) — so Japanese typography uses crisp DOM `<ruby>` furigana.
- A small typed **event bus** (`src/bridge/events.ts`) connects the two.
- **Zustand** holds player/save state (localStorage autosave).
- **ts-fsrs** powers word mastery; **wanakana** handles kana input; **Tailwind** for styling.

```
src/
  game/        Phaser scenes (Boot, World), maps, entities
  ui/          React overlays (DialogueBox, BattleScreen, Grimoire, Settings, HUD…)
  systems/     japanese (furigana/levels/dictionary/tts), srs, combat
  content/     vocab decks, characters, dialogue, enemies
  state/       Zustand store
  bridge/      Phaser ↔ React event bus
tests/         Vitest unit tests
```

## 🗺️ Roadmap

- **M1 (done):** walkable village, Roxy's lesson, capture, language-powered combat.
- **M2 (done):** procedural soundtrack + SFX; canon-styled characters with directional walk
  animations; ~36-word themed vocab deck; bigger village + forest with readable signs, item
  pickups, and a second NPC (Sylphiette); graded recognition→recall learning; SRS "Daily
  Training" review; quest log with tracked objectives.
- **M3 (done):** multi-map system with door/edge transitions (village ⇄ house interior ⇄
  forest path); tap-to-learn dictionary so common words & particles are lookupable;
  grammar notebook that unlocks notes as you meet them; Sylphiette & Zenith NPCs.
- **M3.5 (done):** minimap + world-map screen; Roa town with Eris & Ghislaine, the
  "Sword City" quest, and new vocab/grammar.
- **M4 (in progress):** story cutscenes + opening prologue + chapter cards;
  per-character voices; mobile touch controls (D-pad + action); accessibility
  (easy-read text, Esc-to-close, ARIA). Remaining: recorded audio, full jmdict import.
- **Learning model (Duolingo-informed):** every word climbs a **mastery ladder**
  (👁 Seen → 👂 Heard → 📖 Read → ✍️ Written → 🗣 Used → ⭐ Mastered). Each feature has one
  job: **Discover** in the world (cards) → climb stages in step-by-step **Lessons** (🎓) →
  **Apply** in battle (Stage ≥ 3) → **Review** via SRS (🧠).

## ⚖️ Legal & credits

**This is a non-commercial fan project.** It is **not affiliated with, sponsored, or endorsed
by** the creators, authors, or publishers of *Mushoku Tensei*. Please do not monetize it.

- Code: **MIT** ([LICENSE](LICENSE)).
- Story/character **names** reference *Mushoku Tensei* under fair/fan use; all **art and audio
  are original** placeholder geometry (no assets from the anime or novels). See
  [`public/assets/ASSETS_LICENSE.md`](public/assets/ASSETS_LICENSE.md).
- Dictionary/vocabulary data licensing is documented in [CONTENT_LICENSE.md](CONTENT_LICENSE.md).

Built as a personal Japanese-learning project. 頑張って! 🔥
