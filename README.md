# Customization Tracker — Odoo Online 19 (SaaS)

A centralized tracking tool for Odoo development teams to record client requirements, custom module efforts, customization requests, developer workloads, auto-versioning history (`V1.0 → V1.1 → V2.0`), client sign-offs, and downloadable module files.

---

## 🚀 100% Free Hosting Guide (Render.com)

You can host this full-stack application **100% free** on **Render.com**. Follow these simple steps:

### Step 1: Push project to GitHub

Open terminal in the project directory `d:\Dipanshu\Project\Tracking` and run:

```bash
git init
git add .
git commit -m "Initial commit for Customization Tracker"
```

Create a new repository on [GitHub](https://github.com/new) named `odoo-customization-tracker` (set to Public or Private), then run:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/odoo-customization-tracker.git
git push -u origin main
```

---

### Step 2: Create Free Web Service on Render

1. Go to [render.com](https://render.com) and sign up for a free account.
2. Click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your GitHub repository `odoo-customization-tracker`.
4. Fill in the deployment details:
   - **Name**: `odoo-customization-tracker`
   - **Region**: Select nearest region (e.g. Singapore, Oregon, Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Select **Free** ($0/month)
5. Click **Create Web Service**.

Render will automatically build the React frontend and start the Express server. In 2-3 minutes, your live website link will be ready at:
`https://odoo-customization-tracker.onrender.com`

---

## 💻 Local Development Setup

To run locally on your machine:

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (Express Backend + Vite Frontend concurrently)
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## ✨ Features

- **7 Sidebar Sections**: Dashboard, Requirements, Modules, Customization Requests, Clients, Developers, Audit Log.
- **10-Stage Status Pipeline**: `New` → `Analysis` → `Development` → `Internal Testing` → `Ready for Client` → `Client Testing` → `Changes Requested` → `Rework` → `Approved` → `Closed`.
- **Automatic Version Bump**: Setting Customization Request status to `Approved` automatically increments module version (e.g., `v1.0` → `v1.1`), records version history, and appends an audit log entry.
- **360° Traceability Timeline**: Step-by-step visual timeline tracking requirements to module completion and client sign-offs.
- **File Upload & Downloads**: Team leads can attach and download `.zip` module packages and specification files.
- **Audit Log & CSV Export**: Timestamped history of all system actions with 1-click CSV export.
- **Reset All Data**: Safe system reset option with double confirmation.
