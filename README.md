# Stacked

A place where I collect tools worth keeping. Static site – plain HTML, CSS and a little vanilla JS. No build step, no dependencies.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## Deploy on GitHub Pages

1. Push this folder to a repository.
2. **Settings → Pages → Build and deployment → Deploy from a branch** → `main` / `/ (root)`.
3. The site goes live at `https://<user>.github.io/<repo>/` (all paths are relative, so sub-paths work).

## Structure

```
index.html     markup: top nav, categories, grid container, footer, "Add a new tool" modal, icon sprite
styles.css     design tokens (:root) + components + responsive rules
script.js      renders cards, category filter, search, modal + form
tools.js       the list of tools (this is the file you edit most)
assets/
  icons/       original SVG icons + logo (the sprite inside index.html is built from these)
  tools/       card thumbnails (16:10, ~560×350)
  fonts/       Geist (SIL Open Font License, see OFL.txt)
  favicon.svg
```

## Add a tool

Add an object at the top of `window.STACKED_TOOLS` in `tools.js`, and drop a 16:10 thumbnail (≈560×350 px, `.webp`/`.png`/`.jpg`) into `assets/tools/`:

```js
{
  title: "Tool name",
  description: "One short sentence.",
  url: "https://example.com",
  image: "assets/tools/tool-name.webp",
  categories: ["Design", "AI"]      // one or more names from the category bar
}
```

The "tools collected" counter in the nav is calculated from the list. A card with an empty `url` is shown but not clickable.

## "Submit tool" form

GitHub Pages has no backend. By default the form opens a pre-filled e-mail draft to the address in `script.js` (`CONFIG.fallbackEmail`). To receive submissions directly, create a form on a service such as Formspree, Web3Forms or Basin and put its URL into `CONFIG.submitEndpoint` in `script.js` – the form will then POST JSON (`firstName`, `email`, `toolName`, `toolLink`).

## Design tokens

| Token | Value |
| --- | --- |
| Background | `#000000` |
| Surface (inputs, card hover) | `#0d0d0d` |
| Border / hover border | `#232323` / `#404040` |
| Text / muted text | `#ffffff` / `#737373` |
| Primary button hover | `#cccccc` |
| Radius | 8 px (controls) · 12 px (modal) · 16 px (card) |
| Font | Geist – 400 / 500 |

All of these live in `:root` at the top of `styles.css`.

## Adding or changing an icon

Icons are inlined as an SVG sprite (`<symbol id="i-name">`) at the top of `index.html` so they work with `currentColor` and also when the page is opened from disk. To add one: put the SVG into `assets/icons/`, paste it as a `<symbol>` into the sprite (replace its black stroke/fill with `currentColor`), and use `<svg class="icon"><use href="#i-name"/></svg>`.

## Credits

Made by [@dsgntgthr](https://designtogether.framer.website/). Typeface: [Geist](https://github.com/vercel/geist-font) (OFL 1.1).
