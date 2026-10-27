# Phase 1: Concept, "Under the Button"

## The idea in one sentence
The "Connect domain" button is the tip of an iceberg. The film dives under the waterline and names, layer by layer, what the button is really sitting on. It then comes back up, because a platform can ship the button without building the ice.

## Who it is for, and what they should do
- **Viewer:** the person who decides whether to build custom domains in-house: a founder, CTO or head of product at a SaaS platform.
- **What they should leave knowing:**
  - The button is the small part.
  - Under it are eight real systems, each one a docs page: detection, sign-in rails, the guided path, root domains, value checks, certificates, the edge and monitoring.
  - CustomDomain™ runs all of them behind one embeddable widget.
- **What they should do:** stop scoping a build, and look at the widget.

## How it differs from the films before it
- **"The human middleware"** is a kinetic brand film about a person stuck between two tabs. This film has no person in it.
- **"The end user's path"** is a line-drawn walkthrough told from the end user's side. This film is told from the builder's side, and is about cost and depth, not steps.
- **Its grammar is one continuous descent:** a single long take, top to bottom and back up. Neither earlier film uses that.

## The metaphor, made literal
- **Above the waterline, paper:** the app as the end user sees it, one card and one button.
- **Below the waterline, ink:** the brand's own darkest colour as deep water. The iceberg is faceted in warm stone greys and grows wider with every layer.
- **A depth rail** counts the layers, 01 to 08, in Geist Mono.
- **Green appears once,** at the end, when the button is pressed and the domain goes live. That is the brand's rule: green means done.

## Accuracy guardrails (from cd-film-slate/FACTS.md)
- **Every layer names a real system,** and every number on screen comes from the docs:
  - 189 providers catalogued, with 73 automatic (6 OAuth, 1 Domain Connect, 66 API key) and 116 guided
  - checks every 5 seconds at first, with a 24-hour deadline
  - Let's Encrypt, renewal about 30 days before expiry
  - hourly monitoring
- **Monitoring is described as checking only,** never as alerting or auto-repair, because alerts are not delivered on the hosted service yet.
- **"Strict isolation" is not used.** The docs back "never obtains a certificate for a host it shouldn't", so the edge layer says that.

## Deliverables
16:9 and 9:16, each with and without voiceover. The 9:16 is a true vertical descent: the format suits the metaphor.
