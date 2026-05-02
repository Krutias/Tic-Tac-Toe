# Tic-Tac-Toe

An interactive, responsive Tic Tac Toe game built with HTML5, CSS3, and Vanilla JavaScript.

## ✨ Features
- **Solo Mode:** Play against a smart AI (Win/Block logic).
- **Duo Mode:** Local multiplayer for two friends.
- **Scoreboard:** Tracks wins for each player.
- **Responsive:** Works perfectly on Desktop, Tablet, and Mobile.
- **Clean Code:** Built using SOLID principles and Modular JS.

## 🚀 How to Run
1. Clone the repository.
2. Open `index.html` in any browser.
3. Choose your mode and start playing!

## 🧠 Smart AI Logic
The computer doesn't just play randomly. It follows a hierarchy:
1. **Win:** If it can win this turn, it takes it.
2. **Block:** If you are about to win, it blocks you.
3. **Control:** It prioritizes the center square, then corners.
