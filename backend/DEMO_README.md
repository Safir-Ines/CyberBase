# CyberCockpit — Demo Mode (No Database)

This version runs entirely in-memory. No MongoDB, no setup, no seed scripts.

## Quick Start

```bash
cd backend
npm install
node server.js   # or: npm run dev
```

Then start the frontend normally:
```bash
cd frontend
npm install
npm start
```

## Demo Login Credentials

All passwords: **password123**

| Role     | Email                  |
|----------|------------------------|
| CEO      | ceo@acme.com           |
| Manager  | manager@acme.com       |
| Employee | employee1@acme.com     |
| Employee | employee2@acme.com     |
| Employee | employee3@acme.com     |
| Employee | employee4@acme.com     |

## What's Pre-loaded

- **Organization:** Acme Corp
- **20 assets** (19 registered + 1 shadow IT / stale server)
- **5 risks** (including 1 critical)
- **2 assessment responses** (employee1 flagged as suspicious, employee2 clean)
- All AI scoring logic (anomaly detection, risk scoring, network scan simulation) works identically

## Notes

- Data resets every time the server restarts (it's in-memory)
- You can register new users — they join the demo org or create their own
- The `seed.js` and `src/models/` folder have been removed (not needed)
- Removed dependencies: `mongoose`, `bcryptjs`
