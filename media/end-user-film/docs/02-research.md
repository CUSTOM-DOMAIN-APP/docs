# Phase 2: Research, references and tools

## Pacing and structure (explainer craft)

- **Narration pace:** 130 to 150 words per minute is the comfortable explainer range; a 90-second script is about 195 to 225 words ([VideoScribe](https://blog.videoscribe.co/how-to-write-the-perfect-explainer-video-script), [Bread & Beyond](https://breadnbeyond.com/how-many-words-does-a-60-seconds-explainer-video-needs/), [CapCut](https://www.capcut.com/create/ai-voiceovers-natural-explainer-videos)).
- **Length:** 60 to 90 seconds is the norm for marketing explainers; a denser how-it-works piece can run longer if every line earns its place ([Yum Yum Videos](https://www.yumyumvideos.com/blog/short-vs-long-videos-explainer-video-length-wp/), [Dream Engine](https://www.dreamengine.com.au/news/corporate-explainer-under-90-seconds/)).
- **Structure:** hook, problem, solution, how it works, call to action. Keep the solution short, write for the ear, and write one person talking to one person.
- **Rule taken from the Motion Reel Kit:** words on screen match the voice word for word, or they are a deliberately shorter caption. Never a paraphrase.

What this means for the film: about 230 words at about 150 wpm with real pauses between lines, so roughly 95 seconds. That is over the minute the brief asks for, and inside the "dense how-it-works" allowance.

## Visual references

- **Line-style explainer toolkits** (for example [Renderforest's line-style toolkit](https://www.renderforest.com/template/line-style-explainer-video-toolkit) and the hand-drawn SaaS line-art loops on [Envato](https://elements.envato.com/saas-HFZXXW6)): a browser window at the centre, simple line icons around it, kinetic type. They confirm the grammar. Their faults are clip-art characters, colour fills and generic icons. The film avoids all three: ink only, drawn as the brand's console draws.
- **The brand itself** ([customdomain.ai/brand](https://customdomain.ai/brand)): paper #fafaf9, ink #1c1917, warm stone greys. Green #16a34a marks a finished step and nothing else. Errors are inverted, never red. Instrument Serif for display, Inter for UI, Geist Mono for records. The brand's existing 29-second intro film and the earlier "human middleware" film set the type rhythm.
- **[What Ships](https://whatships.com/)** launch films: the strongest explainers hold one idea per shot and let a single object (a card, a line) carry the story across cuts. Here, that object is the customer's journey line.

## Tools chosen

| Need | Tool | Why |
|---|---|---|
| Deterministic animation, beat grid, renders, critique kit | Motion Reel Kit (the uploaded zip) | Proven on the first film; frame-exact `seek(t)`; 60 fps with motion blur. |
| Hand-drawn line style | [rough.js](https://roughjs.com) 4.6.6, seeded | Sketchy but restrained strokes, identical on every frame. |
| Line drawing on | SVG stroke-dash animation | Every path draws itself along its length, driven by time. |
| Text animation | Kit `TYPE.rise` masks + typewriter | The first film's tested type system, in the brand faces. |
| Voiceover | Kokoro-82M (open model, Apache 2.0) via kokoro-onnx, run locally | No voice service is connected to this workspace. Kokoro's `af_heart` voice is the model's highest-rated voice, with a warm, clear, conversational American read. |
| Pronunciation check | Speech-to-text read-back of every line | Catches mispronounced brand words ("CustomDomain", "DNS", "HTTPS") before picture lock. |
| Score and sound | Synthesized in code | Soft mallet and sub bass, ducked under the voice; pencil ticks and soft pops for the drawings. |

Also considered: the Motion artifact type (prompt-to-film in the browser). Not used, because the four deliverables need frame-exact sync with a voiceover and two layouts from one timeline, which the kit already does. Skill search: nothing for explainers or voiceover is installed in this workspace.

## Voice spec

- **Voice:** Kokoro `af_heart`, an American English female voice: warm, unhurried, confident, never salesy.
- **Speed:** 0.9× of the voice's natural rate, landing at about 150 to 160 wpm inside a line. With pauses, about 140 wpm overall.
- **Cadence:** short sentences, one idea per line. A 0.35 s breath between lines in a scene, and about 0.9 s at a scene change. The narrator pauses after "And a job." and "That's it for your customer." so they land.
- **Pronunciation:** the brand is written "Custom Domain" in the voice script, so it is read as two clear words. On screen it is always CustomDomain™.
