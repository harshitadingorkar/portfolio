# Flo Guo (Flora Guo, 郭灵睿)

**Who:** Designer and design engineer. Their site introduces them as a dictionary entry: *"flo·guo /ˈfloʊ.ɡwoʊ/ noun — 1. digital gardener; admirer of quiet beauty."* Heading to design at Ramp; previously on Vercel's Design Engineering team in New York (via v0); founding design engineer at Paradigm. Writes a living notebook at floguo.com: Notes, Ideas, Playground, Artifacts, Bookshelf.

Recently reintroduced themself as "a designer again (vs. design engineer!)": "labels make us legible… precision is worth striving for."

---

## Principles (in their words, where possible)

1. **Craft as care.** "Craft is a way of looking at the world: an awareness of the people being crafted for, and a desire to treat them with dignity." Love shows in small diligent acts: strawberries sliced into heart-shaped halves, endless airport pick-ups. Their dad "builds bespoke homes by thinking about proportion, purpose, lighting, layout, and material." **Care becomes visible through attention.**
2. **Craft is execution.** "craft doesn't always mean visual. i think of craft as execution with care."
3. **Judgment is a form of love.** "If everything looks equally good, the eye has not been trained yet." "We can only care for people we are willing to pay attention to."
4. **Tacit knowledge.** Craft lives in the body (Polanyi). Classical training gives the scales; jazz asks you to listen to the ensemble and land on the root.
5. **Interface design is pattern recognition.** "Discernment of which form to apply and when, and sometimes (rarely) pattern creation… Most interface problems have already been solved." Canonical interfaces are hard to cultivate and steward.
6. **Choose your altitude.** At 30,000 ft you see the journey, the brand, the system; at ground level, "the kerning, the snap of a microinteraction, the cost of a re-render." The design engineer's skill is *traversal*: carrying intent down and constraints back up. Prototype code is **clay**; production code is **brick**.
7. **The compass is care.** "Care is what makes us keep touching the material. It is the itch to move a line three pixels, rewrite the empty state, throw away the generated option that is almost right but not alive yet. AI doesn't have that part."
8. **Leverage is direction, not output.** "Output is cheap." Stay in authorship.
9. **Kill your darlings.** "Interfaces are not durable artifacts. They are current best guesses." When the user changes, start over.
10. **The designer is a host.** From Charles Eames, on Flo's quotes page: "The role of the designer is that of a very good, thoughtful host, anticipating the needs of his guests." And from Shopify Design: "Good design work comes from craft excellence… But great design work comes from care."
11. **Earnestness.** From David Jiang: "better to be cringe and earnest than overly self-aware and cynical."

## Information architecture ("Effective IA")

Users should always know: **what exists · where they are · what is nearby · where to go next · how to get back.**

- Group around user goals or familiar objects. Name things clearly and consistently.
- **Information scent:** "Billing" has scent; "Services" doesn't.
- Good IA is obvious, stable, predictable, easy to explore, and easy to recover from mistakes.
- "Bad IA feels like Backrooms": everything looks the same, with no landmarks.
- **Organic IA grows from a few clear concepts** (projects contain documents; people share and discuss them). New features then have an obvious place.

## Speed and feel ("Backpack Websites")

- Update local state first; the URL is "a projection of state, not the other way around." No skeletons or flicker on small sites.
- Keyboard easter egg: **Shift + ↑/↓** cycles through every note, wrapping around with a modulo.
- "When navigation feels instant… readers stop thinking about 'loading' and just explore. The interface fades into the background."
- "Speed is fun. Constraint teaches us new lessons."

## Motion ("Sidebar Animation")

- Fade overlays instead of popping them: `transition-opacity 300ms ease-in-out`.
- **Stagger items with spring physics plus a small blur, 4px → 0**, so they arrive in sequence.
- Secondary elements (the ribbon) get a **delayed spring** that lands after the main surface settles.
- Build **tunable playgrounds** (sliders for stiffness, damping, stagger, blur) with a live code snippet.

## Visual signature (floguo.com, v3.8.0)

- **Ground:** warm off-white paper, `#f9f8f8`, with fine paper grain. Ink is near-black. Code backgrounds are tinted warm brown at low alpha (`#461901` at about 5%).
- **One accent, used once:** a **deep red bookmark ribbon** hanging from the top-left edge, like a book's page marker. A tiny red `>` caret marks the current list item.
- **Type:** *STIX Two Text* (serif) for display and titles; *Zalando Sans* for UI; *JetBrains Mono* for dates and meta. Navigation is in letterspaced small caps (ABOUT · BOOKSHELF · NOTES…).
- **Layout:** a three-pane notebook (nav · index · reader), like a bound book open on a desk.
- **Details:** dates in mono (`10-15-2026`), `↗` after outbound titles, dotted underlines, an ASCII-art flower, "↳" prompts as invitations ("↳ What are you reading?"), a footer reading `© floguo 2025. v3.8.0 · changelog · colophon · rss`.
- **Playgrounds can go dark and atmospheric:** *Ramp Run* is a deep green-black vignette with one glassy "Start" button. Quiet, not loud.

## Voice

- Lowercase, short, warm notes; careful long-form essays with numbered ideas.
- Gratitude and plainness: "Life is so good. It's a beautiful day to be alive."
- Keeps a **lexicon** of new words, a **bookshelf**, **monthly links**, **40 Questions** (after Steph Ango), and **acknowledgements**.
- Specific and witty. Inspired by Maja (velvetnoise): "their precision, wit, and intentionality… There is something powerful in knowing what we like and don't like."

## How Flo would critique a design

- "What's the canonical pattern here, and why aren't we using it?"
- "Where are we — what are the landmarks?"
- "Is it instant? Where's the flicker?"
- "What's the one accent? Why are there three?"
- "Move this three pixels. Rewrite this empty state."
- "Is this clay or brick?"
- "What would a good host have anticipated?"

## Notes worth rereading (floguo.com)

`/ideas/craft-as-care` · `/ideas/choose-your-altitude` · `/ideas/kill-your-interfaces` · `/ideas/backpack-websites` · `/ideas/website-writing-ergonomics` · `/notes/effective-information-architecture` · `/notes/interface-design-is-pattern-recognition` · `/notes/a-designer-again` · `/notes/design-engineering` (a syllabus of resources) · `/notes/people-i-admire` · `/notes/websites` · `/notes/quotes` · `/notes/sidebar-animation` · `/notes/prompting-for-depth` · `/notes/aesthetics-and-beauty` (reading list on taste)
