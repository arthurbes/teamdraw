# Team Draw FC 🏆⚽

**Team Draw FC** is a premium Progressive Web Application (PWA) designed to manage football tournament draws and player rankings. Built with a sleek, modern UEFA Champions League-inspired aesthetic, it allows groups of friends to quickly draw teams, record results, and track historical performance.

## ✨ Features

- **Dynamic Team Draw**: Randomly assign top European clubs (Real Madrid, Man City, Bayern, etc.) to players.
- **CPU Management**: Automatically fills empty slots with CPU teams, allowing for solo or small group play.
- **Smart Ranking System**: 
    - **Player Ranking**: Track titles and runner-up spots for every participant.
    - **Team Ranking**: Discover which clubs are the most successful in your group.
- **Visual Excellence**: 
    - Official club logos for all teams.
    - Highlighted player names for better visibility in matches.
    - Premium glassmorphism UI with smooth animations.
- **Persistence**: All history and rankings are saved locally in the browser (LocalStorage).
- **PWA Ready**: Install it on your phone or desktop for an app-style experience.

## 🚀 Technologies Used

- **Frontend**: HTML5, Tailwind CSS
- **Logic**: Vanilla JavaScript
- **Design**: UEFA Champions League theme (Montserrat & Outfit fonts)
- **Icons**: SVG official club logos

## 🛠️ Installation

Simply clone the repository and open `index.html` in any modern web browser:

```bash
git clone https://github.com/yourusername/teamdraw.git
cd teamdraw
# Open index.html in your browser
```

To use it as a PWA, serve the folder via a local server (like `live-server`) and click "Add to Home Screen" in your mobile browser.

## 📁 Project Structure

- `index.html`: Main application interface.
- `app.js`: Core logic, state management, and rendering.
- `style.css`: Custom animations and core styles.
- `img/`: High-quality official club logos.
- `manifest.json`: PWA configuration.

## 📝 Rules

*   **CPU Confrontation**: If drawn against a CPU team, a simple victory is required to advance.
*   **Result Registration**: Both the winner and the runner-up must be selected at the end of each tournament to update the rankings.

---
*Developed with ❤️ for the football community.*
