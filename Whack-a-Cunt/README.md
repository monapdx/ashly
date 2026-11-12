# Whack-a-Cunt — Arcade refresh

Extract the ZIP and open index.html. Keep arcade.css, arcade.js, and the images beside the HTML files. No install, server, or internet connection required.

Click LET’S WHACK to begin. Click/tap a face or press keys 1–9 (left to right, top to bottom). Escape pauses. Choose Amy, Brett, or Clarence using the tabs; switching character starts a fresh score. Personal best is shared across characters when browser storage is available.

## What changed
- Pink, cream, and ink arcade cabinet with lime accents and responsive sizing.
- Springy face entrances, comic hit callouts, particles, and animated scoring.
- Synthesized cartoon impacts and scoring chimes; every fifth point gets a flourish.
- Sound toggle, pause/resume, keyboard play, and reduced-motion support.
- Repaired mallet cursor, relative asset paths, and page structure.
- Shared arcade.css and arcade.js for consistent styling across characters.

Sound starts after a user gesture. Mute and best score use localStorage when available; file-URL persistence varies by browser. No external audio assets or libraries.

Validation: JavaScript syntax and simulated gameplay checks passed (start, scoring, duplicate-hit protection, pause cleanup, mute). A real-browser visual/audio check could not be completed in the build environment.

Original artwork and source assets are retained. Git history is omitted from this distribution; copy the updated files into your existing checkout if using GitHub.

Political parody and cartoon catharsis.

## Contempt of Court — Trump bonus round

After every 25 successful regular hits, unlock a 20-second bonus round. Press OVERTURN IMMUNITY to start: the cabinet turns gold, the mallet turns gold, and Trump replaces your selected justice. Each hit earns +3 points and speeds up the next appearance. Miss him and TOTAL IMMUNITY! appears; hit him for OVERTURNED! +3.

The bonus countdown pauses with Escape, PAUSE, or when the page becomes hidden. The results screen shows hits, bonus points, and total contempt. BACK TO COURT returns to your selected justice. Bonus points do not count toward the next unlock. Switching character opens a fresh game, as before.

Bonus validation: simulated-clock checks passed for unlocks at 25 and 50 regular hits, +3 scoring, duplicate-hit protection, timer expiry, pause/resume, escape effects, zero-hit results, returning to regular play, mute, and saved best. Real-browser visual/audio verification remains pending because a browser executable was unavailable.

The Trump sprite (trump.png) was created with the built-in image-generation tool. Prompt: a single front-facing cartoon Donald Trump bust for a satirical arcade game, indignant pout, swept blond hair, orange tan, navy suit and red tie, bold ink outlines, readable at 100 pixels, transparent background, no text or scenery.
