# GaveØnske.no

Here comes some more text in near future. Maybe some more now. Or now
## Gemini prompt templates (Firebase AI Logic)

The project runs AI Logic in template-only mode, so each prompt lives as a
server prompt template in the Firebase console (AI Logic > Prompt templates).

### `wish-from-link`

Used by `generateWishFromLink` in `src/services/ai.ts`. When someone pastes a
link as a wish, the meta tags are read first; this template then fills in
whatever is still missing (title, description, price, image). Enable the
URL context and Google Search tools so it also works on pages without meta
tags or that block scrapers. Use the same model as `blank-template`.

```
---
model: <same model as blank-template>
config:
  temperature: 0.2
tools:
  - urlContext
  - googleSearch
input:
  schema:
    url: string
    knownTitle: string
    knownDescription: string
---
You help fill in a gift wish list. Look up the product at this link: {{url}}

Read the page. If it can't be read or has little information, search the web
for the product.

Already known (may be empty or incomplete):
- Title: {{knownTitle}}
- Description: {{knownDescription}}

Reply with ONLY a JSON object, no markdown:
{"title": string, "description": string, "price": number | null, "image": string | null}

- title: short product name in Norwegian (keep brand and model names as is).
- description: 1–2 sentences in Norwegian about what the product is.
- price: current price in NOK as a plain number, or null if unknown.
- image: an absolute https URL to a product image found on the page, or null.
  Never invent URLs.
```
