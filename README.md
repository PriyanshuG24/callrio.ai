# Calrio

Calrio is a modern B2B SaaS platform designed to transform meetings into actionable content.  
With support for role-based meetings (Admin, Guest, Producer), Calrio enables secure collaboration,  
automatic recording, AI-driven transcription, highlight clip generation, and one-click publishing  
to major platforms such as YouTube, LinkedIn, and Spotify.

### Core Features
- 🎥 **Meetings** – Host secure online meetings with admin & producer controls.
- 📼 **Recording** – Store and manage meeting recordings in the cloud.
- 🤖 **AI Transcription** – Auto-generate transcripts with Whisper/AI.
- ✂️ **Smart Clips** – Create highlight clips using AI & ffmpeg.
- 🚀 **Publishing** – Push recordings & clips directly to external platforms.
- 🔐 **Role Management** – Admin, Producer, Guest access control.

### Tech Stack
- **Frontend:** Next.js 14, TailwindCSS, shadcn/ui
- **Backend:** Next.js API Routes / Node.js, PostgreSQL (Prisma/Drizzle)
- **Video SDK:** Daily.co / LiveKit / 100ms
- **Storage:** AWS S3 / Supabase Storage
- **AI Services:** Whisper API, OpenAI, ffmpeg
- **Deployment:** Vercel (frontend), Railway/Supabase (backend + DB)

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
