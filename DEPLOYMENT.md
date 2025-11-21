# Deployment Guide for Book & Writing Hub

## Deploy to Vercel (Recommended - Free)

### Prerequisites
- GitHub account
- Vercel account (free - sign up at vercel.com)

### Step-by-Step Deployment

#### 1. Push Code to GitHub
Your code is already in GitHub on branch: `claude/book-writing-hub-01MCzchTAnQ6mAk6hrgX7Z9b`

#### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account

2. Click "Add New Project"

3. Import your `Book-and-Writing-Hub` repository

4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

5. Click "Deploy"

#### 3. Add Postgres Database

After your first deployment:

1. Go to your project dashboard on Vercel

2. Click the "Storage" tab

3. Click "Create Database"

4. Select "Postgres"

5. Click "Continue" and accept the agreement

6. Your database will be created automatically

7. Vercel will automatically add the database environment variables to your project

#### 4. Initialize Database Tables

After adding Postgres:

1. Go to your deployed app URL (something like `your-app.vercel.app`)

2. Visit: `https://your-app.vercel.app/api/init`

3. You should see: `{"message":"Database initialized successfully"}`

4. Your app is now fully functional!

#### 5. Access Your App

Visit your app at: `https://your-app.vercel.app`

You can now access it from any device (desktop, laptop, phone) - all your data is stored in the cloud database!

### Custom Domain (Optional)

1. In your Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

### Environment Variables (Optional)

To add AI features:

1. Go to project Settings → Environment Variables
2. Add: `ANTHROPIC_API_KEY` = your API key from anthropic.com
3. Redeploy the app

## Troubleshooting

### If deployment fails:
- Check the build logs in Vercel
- Make sure all dependencies are in package.json

### If database connection fails:
- Make sure you created the Postgres database in Vercel
- Visit `/api/init` to initialize tables
- Check that environment variables are set

### If you see errors about missing tables:
- Visit `https://your-app.vercel.app/api/init` to create tables

## Local Development

To run locally with Vercel Postgres:

1. Install Vercel CLI: `npm i -g vercel`
2. Link project: `vercel link`
3. Pull environment variables: `vercel env pull .env.local`
4. Run dev server: `npm run dev`

## Updating Your App

When you make changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. Vercel automatically deploys when you push to GitHub!

## Data Backup

To backup your data:
- Visit the Analytics page and export (feature coming soon)
- Use Vercel Postgres dashboard to export database
- Or use the Export & Backup feature in the app (coming soon)

## Cost

- Vercel: Free tier includes 100GB bandwidth/month
- Vercel Postgres: Free tier includes 256MB storage, 60 hours of compute/month
- This is plenty for personal writing projects!

## Support

Issues? Check:
- Vercel deployment logs
- Browser console for errors
- Database connection in Vercel dashboard
