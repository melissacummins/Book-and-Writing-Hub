# Book & Writing Hub

A comprehensive book and writing management system to replace your Notion setup. Built with Next.js, TypeScript, and Vercel Postgres.

## ✨ Features

### 📚 Series & Book Management
- Manage multiple book series and standalone books
- Track themes, lore, tropes, and world-building elements
- Upload and manage book covers (any size)
- Track metadata (titles, subtitles, blurbs)

### ✍️ Writing Hub
- Rich text editor powered by Tiptap (handles large manuscripts)
- Auto-save every 30 seconds
- Write, edit, and organize manuscripts
- Character tracking throughout your story

### 👥 Character Management
- Detailed character profiles with images
- Track names, aliases, and nicknames
- Upload character portraits (any size)

### 📊 Analytics & Tracking
- Word count tracking (drafting vs. revisions)
- Daily writing history
- Track progress across all books

### 🌍 World Building
- Dedicated section for themes, lore, and tropes
- Organize world-building elements by category
- Link to specific series or books

### 💾 Export & Backup
- Export to JSON (complete backup)
- Export to Word (.docx) - Coming soon
- Export to PDF - Coming soon

## 🚀 Quick Start - Deploy to Vercel (Recommended)

**Access from any device (desktop, laptop, phone) with all your data synced!**

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete step-by-step instructions.

**Quick version:**
1. Push to GitHub (already done!)
2. Sign up at [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Add Postgres database in Vercel dashboard
5. Visit `your-app.vercel.app/api/init` to initialize
6. Start writing!

**Cost:** Completely free for personal use (Vercel free tier)

## 🛠 Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript
- **Styling:** TailwindCSS
- **Database:** Vercel Postgres
- **Rich Text Editor:** Tiptap
- **Deployment:** Vercel
- **AI (Optional):** Anthropic Claude API

## 📁 Project Structure

```
├── app/              # Next.js pages and API routes
│   ├── series/      # Series management
│   ├── books/       # Book management & writing interface
│   ├── analytics/   # Word count stats
│   └── api/         # Backend API routes
├── components/       # Reusable React components
├── lib/             # Database and utility functions
└── public/uploads/  # Uploaded images
```

## 💡 Usage Tips

- **Large Manuscripts:** Handles 100k+ word documents smoothly
- **Image Uploads:** No 1MB limits - upload full-size covers and character art
- **Multi-Device:** Access from desktop and laptop with synced data
- **Auto-Save:** Your work saves automatically every 30 seconds
- **Word Tracking:** Distinguishes between drafting new content and editing

## 🔧 Local Development (Optional)

If you want to run locally:

```bash
# Install dependencies
npm install

# Link to Vercel project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run development server
npm run dev
```

## 📝 License

Private project - All rights reserved
