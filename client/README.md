# Placement Tracker — Frontend

A simple React (Vite) frontend for your placement tracker backend.

## Setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`.

## Configure the backend URL

Edit `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

Change the port/path to match wherever your Express server runs.

## Pages

- `/login`, `/register` — auth
- `/applications` — list, add, filter by status, change status inline, delete
- `/applications/:id` — view one application, add/edit/delete rounds
- `/experiences` — shared experiences feed, post your own, filter by company, delete your own
- `/stats` — personal stats (from `GET /api/stats/personal`)

## Required backend changes (do these before testing)

1. **Enable CORS with credentials**, in `index.js`:
   ```js
   const cors = require("cors");
   app.use(cors({ origin: "http://localhost:5173", credentials: true }));
   ```
   Needed because login sets an httpOnly `refreshToken` cookie, and the
   frontend sends `withCredentials: true`.

2. **Fix `authRoutes.js`** — missing leading slashes:
   ```js
   router.post("/logout", userLogout);
   router.post("/refresh", refreshAccessToken);
   ```

3. **Add `verifyToken` to the stats route** — `personalStats` reads
   `req.user.id`, which doesn't exist without it:
   ```js
   router.get("/personal", verifyToken, personalStats);
   ```

4. **Typo in `addRound`** — it saves `req.body.data` instead of
   `req.body.date`, so round dates are silently dropped:
   ```js
   const round = {
       roundNo: (application.rounds?.length || 0)+1,
       roundName: req.body.roundName,
       date: req.body.date   // was: data: req.body.data
   }
   ```
   The frontend already sends the correct `date` key — it just won't
   persist until this is fixed.

## Known limitations, matched to your actual controllers

- **Login uses `username` + `password`**, not email — the frontend form
  reflects this now. `authController.userLogin` returns
  `{ msg, accessToken, user: { username } }`, so that's all the frontend
  stores (no email in the logged-in user object).
- **`updateRound` only accepts `{ status }`** — your controller doesn't
  support editing `roundName` or `date` after creation, so those are shown
  read-only in the rounds table. Only a free-text "status" field is
  editable per round (I don't know your intended enum values — tell me
  and I'll turn it into a dropdown).
- **`addRound` ignores any `roundNo` you send** — it always auto-assigns
  `rounds.length + 1`, so the form doesn't ask for it.
- **Error responses use `{ err: "..." }`**, not `{ message: "..." }` — the
  axios layer (`src/api/axios.js`) normalizes this automatically, so pages
  can keep reading `err.response.data.message`.
- Some of your controllers (e.g. `userLogin`'s "Invalid Creddentials" case,
  and generic `catch` blocks across several controllers) return errors with
  HTTP 200 instead of a 4xx/5xx status. Where I know about these cases
  (login, register) the frontend checks `data.err` manually. If you add
  more such cases elsewhere, wrap them in your own `res.status(400)` etc.
  so error handling stays consistent everywhere.

## Notes on styling

Kept deliberately plain — one CSS file, no UI framework, no build config
beyond Vite defaults. Should be easy to read and modify even without deep
React/CSS experience.
