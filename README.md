# sabr's convention quest

A lightweight tabletop RPG designed for convention one-shots. Players can create characters in 10-15 minutes and start playing immediately.

## What's Included

### Rule Sheets (Print-Ready)
- **player-rules.md** — Single-page player reference covering character creation, core mechanics, combat, spells, and equipment
- **gm-rules.md** — Single-page GM reference with monster rules, situational modifiers, complications/bonuses, and running tips
- **character-sheet.md** — Index card-sized character sheet template

### Character Creation Web App
A mobile-friendly wizard that walks players through character creation step-by-step. Players roll physical dice at the table while the app guides them through the process.

**Features:**
- Step-by-step wizard interface
- Stat assignment with triplicate detection
- Spell selection (14 options, pick 3)
- Save characters to phone (LocalStorage)
- Print/PDF export for paper copies

## Game Overview

sabr's convention quest uses a simple 2d6 system inspired by Powered by the Apocalypse games:

| Roll (2d6 + mods) | Result |
|-------------------|--------|
| 1-5 | Fail |
| 6-8 | Success with complication |
| 9-10 | Success |
| 11+ | Success with bonus |

Characters are defined by a sentence: *"I am a [ancestry] [background] who is good at [talent], BUT [flaw]."*

## Running the Character Creator Locally

1. Clone or download this repository
2. Open `index.html` in any web browser

Or use a local server:
```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000
```

## Deploying to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon in the top right, select **New repository**
3. Name your repository (e.g., `convention-quest`)
4. Choose **Public** (required for free GitHub Pages)
5. Click **Create repository**

### Step 2: Push Your Code

If you haven't already connected your local repo to GitHub:

```bash
# Add the remote (replace with your username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/convention-quest.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (tab at the top)
3. In the left sidebar, click **Pages**
4. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **Save**

### Step 4: Access Your Site

After a few minutes, your site will be live at:

```
https://YOUR_USERNAME.github.io/convention-quest/
```

GitHub will show the URL on the Pages settings page once it's ready.

### Updating Your Site

Any time you push changes to the `main` branch, GitHub Pages will automatically rebuild your site:

```bash
git add .
git commit -m "Your commit message"
git push
```

Changes typically appear within 1-2 minutes.

## Customization

### Changing the Game Name

1. Update the title in `index.html` (line 5 and the header)
2. Update `STORAGE_KEY` in `js/storage.js` if you want separate save data
3. Update headers in the markdown rule sheets

### Adding/Removing Spells

Edit the `SPELLS` array in `js/spells.js`. Each spell needs:
```javascript
{ id: 'spellname', name: 'Display Name', effect: 'What it does' }
```

### Styling

All styles are in `css/styles.css`. Key CSS variables at the top control colors:
```css
:root {
    --primary: #2c5530;      /* Main accent color */
    --secondary: #8b4513;    /* Secondary accent */
    --background: #f5f5f0;   /* Page background */
    /* ... */
}
```

## License

This game was created for personal use at GenCon. Feel free to use, modify, and share.
