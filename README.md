# GameVerse — five games only

Games: Ludo, Chess, Checkers, Tic Tac Toe, Rock Paper Scissors.

## Run locally
Install Node.js 18+, open a terminal in this folder, then:
- `npm install`
- `npm start`
- Open `http://localhost:3000`

## Deploy with GitHub + Render
1. Create a GitHub repository called `gameverse`.
2. Upload the contents of this folder to the repository root.
3. In Render choose **New + → Web Service**, connect the repository.
4. Build command: `npm install`
5. Start command: `npm start`
6. Deploy and share the Render URL.

## Notes / limitations
- Socket.IO handles real-time rooms; server validates turn ownership and game actions.
- Rooms are in memory and are lost if the service restarts. This version does not yet include accounts, persistent statistics, or a database.
- Chess uses chess.js in the browser via CDN and on the server for move validation.
- Ludo is a simplified token-progress implementation, not a full traditional cross-shaped Ludo board. Checkers currently supports basic moves and single jumps; forced multi-jumps and draw rules are not implemented.
- Test with two separate devices before sharing widely. This is a starter build, not a security-audited commercial release.
