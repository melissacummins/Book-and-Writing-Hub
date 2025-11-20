# Book & Writing Hub

A comprehensive book and writing management system to replace your Notion setup. Built with Next.js, TypeScript, and AI assistance.

## Features

### 📚 Series & Book Management
- Manage multiple book series and standalone books
- Track themes, lore, tropes, and world-building elements
- Upload and manage book covers
- Generate metadata (titles, subtitles, blurbs) with AI assistance

### ✍️ Writing Hub
- Rich text editor powered by Tiptap (handles large manuscripts)
- Chapter and scene organization
- Upload, write, or AI-generate manuscripts
- Character mention tracking throughout your story

### 👥 Character Management
- Detailed character profiles with images
- Track names, aliases, and nicknames
- Auto-update profiles based on manuscript mentions
- Upload or generate character images

### 📊 Analytics & Tracking
- Word count tracking (drafting vs. revisions)
- Daily writing history with graphs
- Track progress across books and series

### 🌍 World Building
- Dedicated section for themes, lore, and tropes
- Organize world-building elements by category
- Link to specific series or books

### 💾 Export & Backup
- Export to JSON (complete backup)
- Export to Word (.docx)
- Export to PDF

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (or use SQLite for simplicity)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Book-and-Writing-Hub
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and Anthropic API key.

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser!

## Database Setup

### Option 1: PostgreSQL (Recommended for production)
Install PostgreSQL and create a database:
```bash
createdb bookwritinghub
```

### Option 2: SQLite (Easier for development)
Edit `prisma/schema.prisma` and change:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

Then use this in `.env`:
```
DATABASE_URL="file:./dev.db"
```

## Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript
- **Styling:** TailwindCSS
- **Database:** PostgreSQL (or SQLite)
- **ORM:** Prisma
- **Rich Text Editor:** Tiptap
- **AI:** Anthropic Claude API
- **Charts:** Recharts

## Project Structure

```
├── app/              # Next.js app directory (routes)
├── components/       # React components
├── lib/             # Utility functions and configurations
├── prisma/          # Database schema and migrations
├── public/          # Static assets
│   └── uploads/     # User-uploaded images
└── README.md
```

## Usage Tips

- **Large Manuscripts:** The editor handles documents of any size efficiently
- **Image Uploads:** No file size limits on covers and character images
- **Word Tracking:** Automatically distinguishes between drafting new content and revising existing content
- **AI Features:** Require Anthropic API key for metadata generation and character analysis

## License

Private project - All rights reserved
