---
title: "Why we built our own HTML-to-PDF API"
slug: why-we-built-our-own-html-to-pdf-api
date: 2026-01-29
author: "Nicolas Rouanne"
---

At Qraft, we build two products that generate a lot of PDFs: Billi, a SaaS invoicing platform for freelance agencies, and Embarq, a fully automated umbrella company (portage salarial) in France. Between the two, we generate invoices, activity reports, expense reports, credit notes, quotes, contracts, and pay simulations. PDFs are everywhere.

For years, we've been generating these documents with the same stack in both products. It worked, but it was never great. I want to explain why we decided to build a dedicated, standalone HTML-to-PDF API instead of continuing to patch what we had.

## The setup: Grover, Rails, and Sidekiq

Both Billi and Embarq are Rails applications. For PDF generation, they both use Grover, a Ruby gem that wraps Puppeteer (which itself wraps headless Chromium). The flow looks like this:

1. A background job (Sidekiq) picks up a PDF generation task
2. Rails renders an ERB template into an HTML string
3. Grover preprocesses relative URLs into absolute ones
4. Grover spawns a headless Chrome instance and converts the HTML to PDF
5. The resulting PDF blob gets stored in ActiveStorage (S3)

Each product has its own set of service classes, templates, stylesheets, and jobs. In Billi, there's a `Pdfable` concern with a state machine (`draft` -> `generating` -> `generated`). In Embarq, there's a similar pattern with its own `Pdf::Base` service class hierarchy.

## What went wrong

**The same problem, solved twice.** Both products have essentially the same PDF pipeline: HTML in, PDF out, store it. But because the PDF logic is deeply embedded in each Rails app, we maintain two parallel implementations. Two sets of Grover configurations. Two sets of CSS debugging sessions. Two Dockerfiles with Chromium system dependencies.

**Chromium is a nightmare to deploy.** Every time we update a base image, something breaks. Grover needs Node.js, Puppeteer, and Chromium system libraries (GTK, NSS, ALSA, and more). On Apple Silicon Macs, developers hit `spawn Unknown system error -86` and need workarounds. The dependency chain is fragile and adds complexity to every CI/CD pipeline.

**No browser reuse.** Grover creates a new headless Chrome instance for every single PDF. At scale, that means spinning up and tearing down a full browser process for each invoice. It's slow and memory-hungry. There's no pooling, no reuse.

**CSS and pagination are painful.** We've spent more time than I'd like to admit debugging `break-inside` properties, page breaks, and layout fragility. The git history tells the story: commit after commit of "review invoice pdf layout", "PDF Company invoice rework", "Adding break-inside properties". Every template change risks breaking the PDF output in subtle ways, and there's no fast feedback loop.

**Async when we don't need it.** The Sidekiq-based approach means PDFs are generated in the background and stored. But often, what we actually want is: send HTML, get PDF back, done. The async model adds state management, retry logic, and storage overhead for something that could be a simple synchronous HTTP call.

## What we actually needed

When I stepped back and looked at the problem, what we really needed was simple:

- **One service** that converts HTML to PDF, shared across products
- **Synchronous response** — send HTML, get a PDF back immediately
- **Browser reuse** — one Chromium instance, new context per request
- **No dependency on Rails** — any product, any language can call it
- **Simple deployment** — one container, one process

That's it. No state machine, no ActiveStorage, no background jobs. Just an HTTP endpoint.

## The decision

We decided to build a standalone HTML-to-PDF API. A small, focused service that does one thing well. Both Billi and Embarq can call it over HTTP, and any future product can too.

This is the first article in a series. In the next ones, I'll cover the technical choices we made (Playwright over Puppeteer, TypeScript, Hono) and how we designed the API itself.

## Takeaways

If you have PDF generation logic duplicated across multiple apps, and you're fighting with Chromium dependencies and CSS pagination issues, extracting it into a dedicated service might be worth considering. It's not a complex architectural decision — it's just pulling shared infrastructure out of application code.

The hardest part wasn't building the new service. It was admitting that the existing approach, which worked "well enough" for years, was costing us more than we realized in maintenance time and developer frustration.
