# everything Harshita notices and makes — project context

This file holds the context behind the portfolio redesign: what the site is, what it borrows, which decisions were made and why, and what's still open. It's written so a new collaborator (or a new Claude session) can pick up without the conversation that produced it.

Detailed pass-by-pass notes are in [`design-log.md`](design-log.md). The design skill used for the passes is in [`chia-flo/`](chia-flo/).

---

## 1. What this is

A personal site for **Harshita Shyale**, a product designer and researcher in Seattle (Salesloft now; before that RoxHealth AI, GitHub, Focused Space, HPE and Nutanix; M.S. in Human Centered Design & Engineering at the University of Washington; computer science and theatre before that).

- **Tagline:** *everything Harshita notices and makes.*
- **Her own line,** used at the origin note and on About: *"I care about making beautiful things that help people."*
- **The idea:** not a list of projects but a **plot of attention**. Everything she makes or keeps sits on two axes:
  - **x: wonder ← → work.** Exploratory and open-ended on the left; applied, shipped and accountable on the right.
  - **y: gather ↓ ↑ make.** Things collected and kept at the bottom; things produced at the top.
  - Shipped product work lives in **make · work** (top right). Theatre, clay and the paper live in **make · wonder**. Odds & ends live in **gather · wonder**.
- **The origin** (where the axes cross) holds a turning, filled mark. Clicking it opens a note from her: everything on the plot is measured from there, so that's where she says hello.

## 2. Where the design lives right now

| Place | State |
|---|---|
| **Artifact (the design workbench)**: https://claude.ai/artifact/R4WPdAqtB6tbdzdyihFksb | **Most current.** Cream with a green fade and grain, oxblood accent, real content only, the dmcg-style click flow, theatre and odds & ends rooms, clay, edit mode. Source in [`artifact/`](artifact/). |
| **Next.js site** (this repo) | Behind the artifact (roughly pass 7: mint ground, IM Fell, the organic blob note). To be brought up to the artifact once Harshita has tuned it in edit mode. |

The artifact has an **edit mode** (the "(edit)" button, or press **E**). It exposes every setting: ground colours, the green fade, grain, ink and accent, axis weight and margins, axis words, fonts and sizes, label position, the mark, the note's shape, the clay glaze. You can also drag points, edit their words and verticals, and add or remove them. Edits save to the artifact's shared database document `design/current`, which can be read back and ported to this repo.

To rebuild the artifact from source: `cd docs/artifact && python3 build.py` produces `harshita-plot.html` with every image inlined.

## 3. References, and what was taken from each

- **Andrew Trousdale** (andrewtrousdale.com): the original inspiration. An index panel with images to its left; lives on as the "as text" view.
- **dmcg.co** (David McGillivray): **motion.**
  - One long, soft deceleration for every arrival, `cubic-bezier(.22,1,.36,1)`, about 0.42–0.72s.
  - Media comes into focus (blur 8px → 0) while it scales from 0.97.
  - Leaving uses a plainer, quicker `cubic-bezier(.4,0,.2,1)`, about 0.22s.
  - From the **catalog:** a clicked tile morphs into a large centred view (about 0.7s), the title sits above it at left with a thin × at right, a thumbnail strip runs beneath, and the world behind blurs.
  - From the **case page:** a big centred title, the project image overlapping it, a short line beneath, and a pill-shaped project switcher with a × at the top.
- **Ainsley Romero** (ainsleyromero.com): the homepage *is* a plot.
  - Heavy black axes and plain type.
  - Many dots, each always labelled.
  - The work's image appears big at the centre with the dots kept on top.
  - A filter sentence (Books, Branding, Posters…) that colours matching dots in one accent.
  - A hand-drawn mark.
- **josephines.world** (Josephine Onggowarsito): the place's own time beside yours (the clock line), one ink at several alphas, bracketed small print, a handmade gesture.
- **christieychang.com** (Christie Chang): clicking plants a line-drawn potted flower. **Our version is clay.** Clicking the plot makes a small hand-drawn vessel, a cousin of Sir Wobblefoot; dragging up throws it taller; it lands with a wobble, says its coordinates, and plays that spot's note.
- **Rama Duwaji** (ramaduwaji.com; Hyperallergic, "In the Studio With Rama Duwaji"): **the hand.**
  - Hand-lettered interface words.
  - Line "boil", where a drawing cycles through a few slight redrawings to stay alive.
  - Small loops of life on still objects, texture where the hand was, a ground for the page, limits as method.
  - Added to the chia-flo skill as `references/rama-duwaji.md`.
- **Chia Amisola and Flo Guo:** the two sensibilities the design skill is built on. Chia gives the soul (ritual, words, atmosphere, time); Flo gives the frame (legibility, restraint, craft as care).

## 4. Current design system (artifact)

- **Ground:** cream `#F5F2E6` fading to a very light green `#DDEBD5` from 38% down, with a fine noise grain (8%) carried over from the old site's paper texture.
- **Ink** `#1A1A16`.
- **Accent: oxblood `#6B3237`,** sampled from the glaze of Sir Wobblefoot (shadow `#593031`, light `#6C3B3F`). **No orange:** it reads as Claude's brand.
- **Type:**
  - **Averia Serif Libre** for her voice (tagline, titles, the note, case-study text), weight 300 for running text.
  - Plain Helvetica/Arial for the plot's labels and all small print.
  - The name at the origin uses Averia with ornate **H** and **S** in Mea Culpa.
  - Approximate scale: 12.5 / 14 / 17–19 / 21–23 / 40 / 46–112px.
- **Motion:** the dmcg values above. Settled clay vessels "boil" (three redrawings cycling at about 167ms). The mark turns once a minute. Reduced motion is respected throughout.
- **The click flow:**
  1. **Hover a dot:** its picture appears large at the centre with no text block. The dot keeps a small label tag while the others step back.
  2. **Click:** the picture (or the dot itself) grows into the large view: title and meta above, "open the case study →" and a thin × at the right, a thumbnail strip below, and the world blurred behind.
  3. **Open:** the picture travels to the top of the case-study page under a large title, and the details (meta, sections, quote, gallery, link to the full case) float up beneath it.
- **Theatre** and **Odds & ends** open rooms where the photographs are prints you can pick up and move, with "(tidy up)" and "(scatter them)".

## 5. Content: what's real, and the rules

**Only real work goes on the site.** No site features dressed up as projects (an earlier "patronus" visitor ritual, the "site voice", and "each point a note" were all cut), no résumé or LinkedIn as dots, and no stock placeholder photos. When a real image is missing, use a typeset title card. When a line has to be written, base it on her words and mark it as a draft.

**On the plot now (9 points):**

| Point | Where it sits | Source |
|---|---|---|
| Influence Graph | Salesloft · 2025 | Her current flagship. Public copy kept general; the full story is "ask me for a walkthrough". |
| GitHub pull requests | GitHub · Jan–Mar 2024 | Repo case study (`app/work/github`) and the old site's /github. |
| Sony | Sony × UW capstone | Old site: "Reimagining a smart, sustainable Sony customer experience". About page: post-purchase experience. |
| Keeping AI models in check | HPE · Sept 2022–Mar 2023 | Old site /hpe: AI model monitoring dashboard, data drift, built in React with Grommet. |
| A Safe Space | UW + UW Medicine · Sept–Dec 2023 | Old site /safe: trauma-informed care for invasive exams. |
| Sir Wobblefoot | ceramics | Her photographs, including the six-view turnaround. |
| Theatre | acted · wrote · directed | Old site /about: "Searching for a Lullaby", "You're all Mime", national-level wins, sold-out shows. |
| Props, people & "problems" | a paper | Her paper "How Props, People, and 'Problems' Created Unexpected Theatre" (sociomaterial theory, Actor-Network Theory). |
| Odds & ends | visual notes | The old site's /odds-ends: 13 photographs. |

**Sources of truth:**
- **Old portfolio:** https://nuanced-choose-563332.framer.app (/about, /odds-ends, /github, /hpe, /safe).
- **Links:**
  - LinkedIn https://www.linkedin.com/in/harshita-shyale (with the hyphen)
  - Letterboxd https://letterboxd.com/harshita/
  - Instagram (silly things) https://www.instagram.com/ashlime_soda/
  - GitHub https://github.com/harshitadingorkar
  - Email hello@harshitashyale.com
  - Résumé PDF: https://drive.google.com/file/d/1w5oACA9h247lCVzwbkQ4_lrwidORU5lw/view
- **A private Salesloft document exists locally for background only.** It is deliberately **not** in this repo, and its details (metrics, revenue figures, internal names) must not be published.
- Some older pages in this repo (`app/work/sony`, `app/work/influence-graph`, `app/work/ai-email-assistant`, and parts of `lib/projects.ts`) contain **generic placeholder copy that contradicts her real work** (for example, Sony headphone research). Treat them as drafts to rewrite, not as sources.

## 6. Decisions, in short (passes 1–10)

1. **Passes 1–3:** labelled two-axis plot; axes flipped so make · work is top right; sound (pitch follows height, stereo follows left–right); clock; about, writing and résumé pages.
2. **Pass 4 (josephines.world):** her time beside yours; axis words became labels, not headlines; screenplay-style parentheticals for controls.
3. **Pass 5 (Ainsley Romero):** studied the plot-as-homepage; serif auditions.
4. **Pass 6:** IM Fell English; heavy 2px axes; the large centred hover image; dmcg motion everywhere.
5. **Pass 7:** mint ground; a hand-drawn loop mark at the origin; an organic note panel. Both were later replaced.
6. **Pass 8 (why it lacked Ainsley's spark):**
   - The diagnosis: too few dots, too many typefaces, colour that meant nothing, too much softness, axes that read as chart furniture.
   - The response: plain type on the plot, 3px axes with no arrowheads or ticks, the filter sentence, cream with a green fade, a filled turning mark, a classic engraved "long star" note, and edit mode saving to a shared record.
7. **Pass 8½:** Sir Wobblefoot added, with a stop-motion turnaround; the clay click interaction (after Christie Chang).
8. **Pass 9:** cut every made-up point; real content from the old portfolio; theatre and odds & ends as clusters and rooms of draggable prints; her own words in the note and About; oxblood replaced terracotta; Averia for her voice; Rama Duwaji added to the skill; vessels boil.
9. **Pass 10:**
   - The hover panels lost their "appended text" captions.
   - The dmcg click flow was built: dot → large view with × and thumbnail strip → the image morphs into the case study.
   - Points that conveyed nothing (AI Email Assistant, Nutanix, Films, M.S. at UW) were removed.
   - The note was rewritten shorter, with a cameo portrait.
   - Grain was carried over; the accent was sampled from the ceramic.
   - Type was consolidated to Averia plus plain sans.

## 7. Open — what's needed next

- **Her handwriting:** "make, gather, work, wonder" and her name, photographed and turned into vector lines (the Rama move, and the single biggest step toward the hand-made quality we're after).
- **Real images** for Influence Graph (currently a typeset card).
- **More real things** to plot, especially gather · work (references and research libraries) and more ceramics.
- **Confirmations:** Sony's year and title; whether the condensed lines in the origin note read right in her voice.
- **Port the artifact to this Next.js site:**
  - the content model (`lib/entries.ts`), the click flow, the rooms, grain, type and colour
  - delete the leftover components (Patronus/visitor, SiteVoice, NodeGraph, UnicornHero, the old organic panel)
  - rewrite the placeholder case-study pages
- **Build fix:** `app/api/taste-blocks/route.ts` imports `@supabase/supabase-js`, which isn't installed, so `next build` fails until it's installed or the route is removed.
- **Security:** the git remotes in `.git/config` embed a GitHub personal access token. **Revoke it on GitHub and switch to a credential helper or SSH.**
