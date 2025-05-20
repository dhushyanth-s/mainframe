# Mainframe Monorepo

This repository contains a collaborative document editing platform built with:

- **Frontend:** Next.js (TypeScript, React 19, TailwindCSS, Milkdown, Clerk, Tiptap, and more)
- **Backend:** Convex (deployed via Docker Compose)

---

## Project Structure

- frontend — Next.js app (UI, authentication, collaborative editor)
- docker-compose.yml — Orchestrates Convex backend and dashboard

---

## Getting Started

### 1. Start the Convex Backend (Docker Compose)

```pwsh
cd e:/mainframe
docker compose up
```
- Backend API: http://localhost:3210
- Dashboard: http://localhost:6791

### 2. Start the Frontend (Next.js)

```pwsh
cd e:/mainframe/frontend
pnpm install # or npm install, yarn, bun
pnpm dev     # or npm run dev, yarn dev, bun dev
```
- Frontend: http://localhost:3000

---

## Features

- Real-time collaborative document editing (Milkdown + Convex)
- User authentication (Clerk)
- Document management (create, view, soft-delete)
- Live session awareness and presence
- Modern, responsive UI (TailwindCSS, HeroUI)

---

## Development

- Edit frontend code in src
- Convex backend logic in convex
- Update backend schema in schema.ts

---

## Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Milkdown Docs](https://milkdown.dev/)
- [Clerk Docs](https://clerk.com/docs)

---

## License

MIT (or specify your license)

---
