# Beaver Builder Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page HTML app where 5–6 year old Beavers pick options to design a beaver character, then generate an AI image using the Gemini API.

**Architecture:** One static HTML file with inline CSS and vanilla JS. No build step, no dependencies, no backend. Calls the Gemini image generation API directly from the browser via fetch(). Deployed as a single file to Netlify/Vercel.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Gemini API (gemini-2.0-flash-exp or current image-capable model)

---

### Task 1: HTML Structure — Header & Selector Blocks

**Files:**
- Create: `beaver-builder/index.html`

**Step 1: Create the HTML skeleton**

Create `index.html` with:
- `<!DOCTYPE html>`, viewport meta tag for mobile
- A `<header>` with the title "1st Rustington Scouts - Beaver Builder" and 🦫 emoji
- Four selector sections, each with:
  - A label (h2): "What's your Beaver doing?", "What are they wearing?", "Where are they?", "What style?"
  - A container div with class `pill-row` (will hold the pill buttons)
- Each pill is a `<button>` with a `data-category` and `data-value` attribute
- A `<div id="recipe-card">` for the assembled sentence
- A `<button id="generate-btn">` — "CREATE MY BEAVER! 🦫"
- A `<div id="loading">` (hidden by default) with "Building your Beaver..." text
- A `<div id="result">` (hidden by default) with an `<img>` tag, "Save Image" button, and "Make Another!" button
- A `<div id="error">` (hidden by default) with friendly error message and retry button

Pill button options:

**Category: action**
- Swimming, Cooking, Skateboarding, Flying a Rocket, Painting a Picture, Playing Football

**Category: outfit**
- Top Hat, Superhero Cape, Space Helmet, Chef's Hat, Crown, Scarf & Goggles

**Category: location**
- Outer Space, Underwater, On a Mountain, In a Jungle, At the Beach, In a Castle

**Category: style**
- Cartoon, Pixel Art, Watercolour, Clay Model, Pencil Sketch, Sticker

**Step 2: Verify the HTML renders**

Open `index.html` in a browser. Confirm:
- Title displays correctly
- All four category sections show with their pill buttons
- Recipe card area is visible (empty text is fine)
- Generate button is visible
- Loading, result, and error divs are hidden

---

### Task 2: CSS — Mobile-First Kid-Friendly Styling

**Files:**
- Modify: `beaver-builder/index.html` (add `<style>` block in `<head>`)

**Step 1: Add all CSS in a single `<style>` block**

Key styling rules:

- `* { box-sizing: border-box; margin: 0; padding: 0; }` + system font stack
- `body`: white background, max-width 480px centred, padding 16px
- **Header**: Scouts purple (#7413dc) background, white text, rounded bottom corners, padding 20px, text-align centre. Title font-size ~1.3rem. Beaver emoji large.
- **Category sections**: margin-top 20px. Label (h2) in a warm colour (e.g. dark brown #4a3728), font-size 1rem, margin-bottom 8px
- **Pill row**: `display: flex; flex-wrap: wrap; gap: 8px;`
- **Pill buttons**: `border-radius: 20px; padding: 10px 18px; font-size: 0.95rem; border: 2px solid #ddd; background: #f8f4ff; cursor: pointer; transition: all 0.2s;` No outline on focus (use visible border instead for accessibility)
- **Pill selected state** (class `.selected`): `border-color: #7413dc; background: #ede4fb; transform: scale(1.05);` with a subtle bounce via CSS transition
- **Pill colours per category**: Give each category's pills a different tint:
  - Action: light orange bg (#fff3e6), orange border when selected (#f59e0b)
  - Outfit: light green bg (#ecfdf5), green border when selected (#10b981)
  - Location: light blue bg (#eff6ff), blue border when selected (#3b82f6)
  - Style: light pink bg (#fdf2f8), pink border when selected (#ec4899)
- **Recipe card**: `background: #fefce8; border: 2px dashed #d4a053; border-radius: 12px; padding: 14px; margin: 20px 0; font-style: italic; font-size: 1rem; min-height: 50px; text-align: centre;`
- **Generate button**: `width: 100%; padding: 18px; font-size: 1.2rem; font-weight: bold; background: #22c55e; color: white; border: none; border-radius: 16px; cursor: pointer; min-height: 60px;` Disabled state: `opacity: 0.5; cursor: not-allowed;`
- **Loading div**: centred text, beaver emoji with CSS pulse animation (`@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.2); } }`), font-size 1.2rem
- **Result section**: `text-align: centre;` Image: `width: 100%; border-radius: 12px; margin: 16px 0;`
- **Save/Make Another buttons**: same rounded style as generate, 100% width, stacked vertically with 10px gap. Save = blue (#3b82f6), Make Another = Scouts purple (#7413dc)
- **Error div**: friendly styling, orange background, rounded, padding, with retry button
- **Hide/show utility**: `.hidden { display: none; }`

**Step 2: Verify styling on mobile viewport**

Open in browser, use devtools mobile view (375px width). Confirm:
- Pills wrap nicely and are easy to tap (large touch targets)
- Colours look warm and kid-friendly
- Generate button is big and prominent
- No horizontal scrolling
- Text is readable

---

### Task 3: JavaScript — Selection Logic & Recipe Card

**Files:**
- Modify: `beaver-builder/index.html` (add `<script>` block before `</body>`)

**Step 1: Add selection state management**

```javascript
const state = {
  action: null,
  outfit: null,
  location: null,
  style: null
};
```

**Step 2: Add pill click handler**

Add a single delegated click listener on `document.body` (or a wrapper div) that:
1. Checks if the clicked element is a `.pill` button
2. Reads `data-category` and `data-value`
3. Removes `.selected` class from all pills in that category
4. Adds `.selected` class to the clicked pill
5. Updates `state[category] = value`
6. Calls `updateRecipeCard()`
7. Calls `updateGenerateButton()`

**Step 3: Add recipe card updater**

```javascript
function updateRecipeCard() {
  const card = document.getElementById('recipe-card');
  if (!state.action && !state.outfit && !state.location && !state.style) {
    card.textContent = 'Pick your options above to design your Beaver!';
    return;
  }
  const parts = [];
  if (state.action) parts.push(`who is ${state.action.toLowerCase()}`);
  if (state.outfit) parts.push(`wearing a ${state.outfit.toLowerCase()}`);
  if (state.location) parts.push(`${state.location.toLowerCase()}`);
  if (state.style) parts.push(`in ${state.style.toLowerCase()} style`);
  card.textContent = `A beaver ${parts.join(', ')}.`;
}
```

**Step 4: Add generate button enabler**

```javascript
function updateGenerateButton() {
  const btn = document.getElementById('generate-btn');
  const allSelected = state.action && state.outfit && state.location && state.style;
  btn.disabled = !allSelected;
}
```

Initial state: button disabled, recipe card shows placeholder text.

**Step 5: Verify interactivity**

Open in browser. Confirm:
- Tapping a pill highlights it and deselects others in the same category
- Recipe card updates live
- Generate button enables only when all four categories have a selection

---

### Task 4: JavaScript — API Integration & Image Display

**Files:**
- Modify: `beaver-builder/index.html` (extend the `<script>` block)

**Step 1: Add the API key config**

At the top of the script block:
```javascript
const API_KEY = 'YOUR_API_KEY_HERE'; // Ben will replace this
const MODEL = 'gemini-2.0-flash-exp'; // Update to latest image-capable model
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
```

**Step 2: Add prompt builder**

```javascript
function buildPrompt() {
  return `Create an adorable, child-friendly illustration of a cute beaver character who is ${state.action.toLowerCase()}, wearing a ${state.outfit.toLowerCase()}, ${state.location.toLowerCase()}. The art style should be ${state.style.toLowerCase()}. The beaver should be happy, colourful, and appealing to young children. White background, no text in the image.`;
}
```

**Step 3: Add generate function**

```javascript
async function generateImage() {
  const selectorsEl = document.getElementById('selectors');
  const loadingEl = document.getElementById('loading');
  const resultEl = document.getElementById('result');
  const errorEl = document.getElementById('error');
  const imgEl = document.getElementById('generated-image');

  // Show loading, hide others
  selectorsEl.classList.add('hidden');
  document.getElementById('generate-btn').classList.add('hidden');
  document.getElementById('recipe-card').classList.add('hidden');
  loadingEl.classList.remove('hidden');
  resultEl.classList.add('hidden');
  errorEl.classList.add('hidden');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt() }] }],
        generationConfig: {
          responseModalities: ['IMAGE']
        }
      })
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const imageData = data.candidates[0].content.parts[0].inline_data;
    imgEl.src = `data:${imageData.mime_type};base64,${imageData.data}`;

    // Show result
    loadingEl.classList.add('hidden');
    resultEl.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    loadingEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
  }
}
```

**Step 4: Wire up the generate button**

```javascript
document.getElementById('generate-btn').addEventListener('click', generateImage);
```

**Step 5: Add "Make Another" handler**

```javascript
document.getElementById('make-another-btn').addEventListener('click', () => {
  document.getElementById('result').classList.add('hidden');
  document.getElementById('selectors').classList.remove('hidden');
  document.getElementById('generate-btn').classList.remove('hidden');
  document.getElementById('recipe-card').classList.remove('hidden');
});
```

**Step 6: Add "Save Image" handler**

```javascript
document.getElementById('save-btn').addEventListener('click', () => {
  const img = document.getElementById('generated-image');
  const link = document.createElement('a');
  link.download = 'my-beaver.png';
  link.href = img.src;
  link.click();
});
```

**Step 7: Add retry handler**

```javascript
document.getElementById('retry-btn').addEventListener('click', generateImage);
```

**Step 8: Test end-to-end with API key**

- Insert a real API key
- Select one option per category
- Tap "CREATE MY BEAVER!"
- Confirm loading state appears
- Confirm image appears after ~5-10 seconds
- Confirm "Save Image" downloads a .png
- Confirm "Make Another!" returns to selectors with previous choices still highlighted
- Deliberately break the API key, confirm friendly error message appears with retry button

---

### Task 5: Polish & Final Checks

**Files:**
- Modify: `beaver-builder/index.html`

**Step 1: Add a favicon**

Use an inline SVG favicon with a beaver emoji:
```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦫</text></svg>">
```

**Step 2: Add Open Graph meta tags**

So the link looks nice when shared:
```html
<meta property="og:title" content="1st Rustington Scouts - Beaver Builder">
<meta property="og:description" content="Design your own Beaver character!">
```

**Step 3: Add a subtle footer**

Small text at the bottom: "Made with 🦫 by 1st Rustington Scouts"

**Step 4: Final mobile testing checklist**

Test on actual phone (or devtools mobile):
- [ ] All pills tappable without mis-taps
- [ ] Recipe card text readable
- [ ] Generate button big enough for small fingers
- [ ] Loading animation visible and fun
- [ ] Generated image fills width nicely
- [ ] Save Image works on mobile Safari and Chrome
- [ ] Make Another resets cleanly
- [ ] Error state is friendly, retry works
- [ ] No console errors
- [ ] Page loads fast (single file, no external resources)

**Step 5: Copy final file to outputs**

Copy the completed `index.html` to the outputs folder for Ben.

---

### Task 6: Deployment

**Step 1: Deploy to Netlify or Vercel**

For Netlify (simplest):
- Drag and drop the HTML file to netlify.com/drop
- Note the generated URL

Or via CLI:
```bash
npx netlify-cli deploy --prod --dir=beaver-builder
```

**Step 2: Generate QR code**

Create a QR code image linking to the deployed URL. Can use a free QR generator or generate one inline.

**Step 3: Test deployed version**

- Open the deployed URL on a phone
- Run through the full flow: select → generate → save → make another
- Confirm it works end-to-end on the live URL
