# Beaver Builder — Design Document

**Project:** 1st Rustington Scouts — Beaver Builder
**Date:** 2026-03-24
**Purpose:** A fun, phone-friendly web app for Beavers (aged 5–6) to design their own beaver character using AI image generation. Supports the Digital Citizen Stage 1 badge requirement: "Use an online service to learn a new skill and show others what you've learnt."
**Skill framing:** Learning to design a character using a digital tool.

---

## Overview

A single-page HTML app where kids pick options from four categories — action, outfit, location, and art style — then tap a button to generate a unique AI illustration of a beaver. No accounts, no typing, no login. Just tappable buttons and a big green "CREATE MY BEAVER!" button.

Tonight (24 March 2026) it gets demoed on a projector at Beavers. Afterwards, kids take home a QR code and use it on a parent's phone.

---

## Approach

**Approach A: Single-page HTML app (selected)**

One static HTML file with vanilla JS. Calls the Gemini Imagen API directly from the browser. Hosted on Netlify or Vercel (free tier). Zero dependencies, zero build step.

API key is hardcoded in client-side JS. Acceptable risk: the URL is shared privately via QR code with ~25 families, not publicly indexed. Key can be rotated after a few weeks.

---

## User Experience

### Title
"1st Rustington Scouts - Beaver Builder" with a beaver emoji (🦫).

### Layout (mobile-first)
- Title bar at top
- Four category rows, each with a label and horizontally scrollable pill-shaped buttons
- A "recipe card" below the selectors showing the assembled sentence (updates live as kids tap)
- A big green "CREATE MY BEAVER!" button (minimum 60px tall)
- Loading state: beaver emoji with pulse animation + "Building your Beaver..." text
- Generated image displayed full-width
- "Save Image" and "Make Another!" buttons below the image

### Selector Categories

**What's your Beaver doing?**
Swimming, Cooking, Skateboarding, Flying a Rocket, Painting a Picture, Playing Football

**What are they wearing?**
Top Hat, Superhero Cape, Space Helmet, Chef's Hat, Crown, Scarf & Goggles

**Where are they?**
Outer Space, Underwater, On a Mountain, In a Jungle, At the Beach, In a Castle

**What style?**
Cartoon, Pixel Art, Watercolour, Clay Model, Pencil Sketch, Sticker

### Interaction
- Tap one pill per category — it highlights with a bold border and subtle bounce
- No typing anywhere
- One option per category must be selected before the generate button activates
- "Make Another!" resets to the selector screen with previous choices still highlighted

### Recipe Card (educational element)
Between the selectors and the generate button, a card displays:
*"A beaver who is skateboarding, wearing a superhero cape, in outer space, in watercolour style."*
Updates live. Teaches kids that their choices become instructions which become a picture.

---

## Technical Architecture

### Stack
- Single HTML file
- Inline CSS (mobile-first, no framework)
- Vanilla JavaScript (no dependencies)

### Colour Palette
- Primary accent: Scouts purple (#7413dc)
- Warm oranges, greens, browns for category blocks
- White background
- Big rounded corners throughout

### API Integration
- Google Gemini Imagen API (Imagen 3 — referred to internally as "NanoBanana Pro 2")
- Called via `fetch()` from client-side JS
- API key hardcoded in JS
- Request: POST with assembled prompt string
- Response: base64 image data displayed in an `<img>` tag

### Hidden Prompt Template
```
Create an adorable, child-friendly illustration of a cute beaver character who is {action}, wearing a {outfit}, in {location}. The art style should be {style}. The beaver should be happy, colourful, and appealing to young children. White background, no text.
```

### Error Handling
- API failure: friendly message — "Oops! The Beaver Builder is having a rest. Try again in a moment!" with a retry button
- No scary error codes or technical language

### Loading State
- Beaver emoji (🦫) with CSS pulse animation
- "Building your Beaver..." text
- Typical generation time: 5–10 seconds

### Image Saving
- "Save Image" button triggers a download link from the base64 data
- Works on mobile browsers

### Hosting
- Single HTML file deployed to Netlify or Vercel (free tier)
- One URL, one QR code printed on slips for the kids

### API Costs
- ~$0.02–$0.04 per image generation
- No per-user or total cap — Ben is comfortable with open usage
- Key will be rotated manually after a few weeks

---

## What's NOT in scope
- User accounts or authentication
- Server-side backend
- Rate limiting
- Analytics or tracking
- Image gallery / history
- Any form of data collection from children
