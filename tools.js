/* ==========================================================================
   Stacked – tool data
   Add a tool = add one object to this list (newest first).

   title       – tool name (required)
   description – one short sentence (required)
   url         – link opened in a new tab (required; empty = card not clickable yet)
   image       – 16:10 thumbnail, ideally 560×350 px (webp/png/jpg) in assets/tools/
   categories  – one or more of the category names used in index.html
                 (3D, Accessibility, AI, Analytics, Audio, Careers, Coding, Design,
                  Design Resources, E-Commerce, Finance, Fitness & Health, Inspiration,
                  Learning, Marketing, No-Code, Privacy & Security, Productivity,
                  Social Media, Startups, Video, Web3, Writing)
   ========================================================================== */

window.STACKED_TOOLS = [
  {
    title: "Easing Graphs",
    description: "Curated collection of cubic and spring easing graphs for motion design",
    url: "", // TODO
    image: "assets/tools/easing-graphs.webp",
    categories: ["Design Resources", "Coding"]
  },
  {
    title: "Generative Loaders",
    description: "React library of animated loaders for text, inline and image generation states",
    url: "", // TODO
    image: "assets/tools/generative-loaders.webp",
    categories: ["Coding", "AI", "Design Resources"]
  },
  {
    title: "AnimateIcons",
    description: "Open-source library of 1,170+ animated icons for React, Vue, Angular and plain JavaScript",
    url: "https://animateicons.in",
    image: "assets/tools/animateicons.webp",
    categories: ["Design Resources", "Coding"]
  },
  {
    title: "unFocus",
    description: "Browser-based generator of soft-focus wallpapers and backgrounds with real film grain",
    url: "", // TODO
    image: "assets/tools/unfocus.webp",
    categories: ["Design", "Design Resources"]
  },
  {
    title: "Obry",
    description: "macOS menu-bar app that turns screen captures into floating cards with on-device OCR",
    url: "", // TODO
    image: "assets/tools/obry.webp",
    categories: ["Productivity"]
  },
  {
    title: "PhotoCraft",
    description: "Open-source, offline image editor written in Rust with layers, masks and PSD support",
    url: "", // TODO
    image: "assets/tools/photocraft.webp",
    categories: ["Design"]
  },
  {
    title: "Foundr Radio",
    description: "Virtual FM dial of internet radio stations where you can claim a frequency and broadcast from your browser",
    url: "", // TODO
    image: "assets/tools/foundr-radio.webp",
    categories: ["Audio", "Inspiration"]
  },
  {
    title: "Sprint",
    description: "AI canvas for generating, branching and iterating on images and video",
    url: "", // TODO
    image: "assets/tools/sprint.webp",
    categories: ["AI", "Design", "Video"]
  },
  {
    title: "OGFolio",
    description: "Curated library of Open Graph images from around the web for design inspiration",
    url: "", // TODO
    image: "assets/tools/ogfolio.webp",
    categories: ["Inspiration", "Design Resources", "Marketing"]
  },
  {
    title: "Energy Icons",
    description: "Free open-source icon library with deeper coverage for energy, climate and infrastructure",
    url: "", // TODO
    image: "assets/tools/energy-icons.webp",
    categories: ["Design Resources"]
  }
];
