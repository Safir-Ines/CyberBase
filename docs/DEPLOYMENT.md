# 🚀 Deployment Guide: CyberBase Intelligence Cockpit

The platform has been optimized for a **unified production deployment**. The Node.js backend is now configured to serve the built React frontend, allowing you to deploy the entire system as a single service.

## 🏁 Recommended Platform: Render
[Render](https://render.com) is the easiest platform for this setup as it automatically detects your GitHub repository and handles the build process.

### 1. Connect Your Repository
1.  Log in to [Render](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub account and select the `CyberBase` repository.

### 2. Configure Build & Start Commands
On the configuration screen, use the following settings:

| Setting | Value |
|---|---|
| **Runtime** | `Node` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |

### 3. Set Environment Variables
Click on the **Advanced** button and add the following:

| Key | Value | Note |
|---|---|---|
| `NODE_ENV` | `production` | Enables frontend serving logic |
| `PORT` | `10000` | Render's default port |

---

## 🛠️ How the Deployment Works
I have updated your repository with a **Root Configuration** that simplifies the process:

1.  **Monolith Architecture**: The backend (`server.js`) now uses `express.static` to serve the React `build` folder.
2.  **Unified Build**: The root `package.json` contains a `build` script that automatically installs frontend dependencies and generates the production bundle.
3.  **Single Entry Point**: Your deployment service only needs to run the backend; it will automatically handle all frontend routing.

## ✅ Verification
Once the deployment is finished:
1.  Visit your Render URL (e.g., `https://cyberbase.onrender.com`).
2.  Verify that the login screen appears.
3.  Check the "Health" endpoint at `/api/health` to confirm the backend is responsive.

---
> [!TIP]
> Since this is currently in **Demo Mode**, it uses in-memory storage. All data will reset if the server restarts. For a persistent production database, you can later update the `Store` logic to use MongoDB or PostgreSQL.
