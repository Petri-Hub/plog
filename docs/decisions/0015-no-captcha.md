# 0015. No captcha, and bots are separated in analytics

- **Status:** Accepted
- **Date:** 2026-11-24

## Context

The roadmap asked whether a Cloudflare captcha was worth adding to filter bots. The goal behind it was to tell bots from people, not to stop bots.

The site is static. It has no form, no API route and no server-rendered page, and its only input is the search box, which filters in the browser. Cloudflare's Turnstile guards something a visitor submits, so it has nothing to guard here. A site-wide bot filter, either Cloudflare's Bot Fight Mode or Vercel's Bot Protection in Challenge mode, targets non-browser clients. Those are the RSS readers and the agents that fetch `/rss.xml`, `/llms.txt` and the post Markdown files (ADRs 0013 and 0014). Vercel's documentation also says its Bot Protection doesn't work behind a reverse proxy such as Cloudflare.

## Decision

- No captcha and no site-wide bot challenge.
- Bots are told apart from people in analytics. The planned tools are Vercel Web Analytics, which doesn't count automated traffic by inspecting the User Agent header, and PostHog, whose JavaScript SDK drops known bots by default. Setting `opt_out_useragent_filter` to `true` makes it tag them instead, and its Web Analytics can filter on an "Is bot" property.
- Revisit it when the site accepts input from visitors, such as comments. Turnstile is free and doesn't need the site to go through Cloudflare. If comments sign in through GitHub, the login already filters bots.

## Consequences

- Both analytics tools run JavaScript, so crawlers, AI agents and feed readers that don't run it appear in neither. PostHog documents forwarding server logs as `$http_log` events to count that traffic, and the analytics work can decide whether it is worth it.
- Vercel's Bot Protection has a Log mode that only observes. It stays an option for seeing bot traffic without blocking any.
- These facts come from the vendors' documentation, read on the date above. PostHog's bot classification is described there as a new feature, so check it again when it is set up.
