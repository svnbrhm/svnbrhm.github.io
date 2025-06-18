# Complete CI/CD Setup Guide for Next.js + Vercel + Airtable

This guide will help you set up a complete CI/CD workflow for your Next.js project with automatic deployments to Vercel.

## 📋 Prerequisites

- ✅ Next.js project (already set up)
- ✅ Airtable account with API access
- 🔲 GitHub account
- 🔲 Vercel account
- 🔲 Git installed locally

## 🚀 One-Time Setup

### Step 1: GitHub Repository Setup

1. **Create a new repository on GitHub:**
   - Go to [GitHub](https://github.com) and sign in
   - Click "New repository" or go to https://github.com/new
   - Repository name: `runningcrews-website` (or your preferred name)
   - Description: "Global running crew database and community hub"
   - Set to **Public** (required for free Vercel deployments)
   - ❌ **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Connect your local project to GitHub:**
   ```bash
   # Navigate to your project directory
   cd /path/to/your/project
   
   # Add all files to git
   git add .
   
   # Make your first commit
   git commit -m "Initial commit: Next.js running crews website"
   
   # Add GitHub as remote origin (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/runningcrews-website.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

### Step 2: Vercel Account Setup

1. **Create Vercel account:**
   - Go to [Vercel](https://vercel.com)
   - Click "Sign up" and choose "Continue with GitHub"
   - Authorize Vercel to access your GitHub account

2. **Import your project:**
   - On Vercel dashboard, click "New Project"
   - Find your `runningcrews-website` repository
   - Click "Import"

3. **Configure environment variables:**
   - In the "Configure Project" section, expand "Environment Variables"
   - Add the following variables:
     ```
     Name: AIRTABLE_BASE_ID
     Value: [Your Airtable Base ID]
     
     Name: AIRTABLE_PERSONAL_ACCESS_TOKEN
     Value: [Your Airtable Personal Access Token]
     ```
   - ⚠️ **Important:** Make sure these are set for all environments (Production, Preview, Development)

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your site will be available at `https://your-project-name.vercel.app`

### Step 3: Verify Deployment

1. **Check build logs:**
   - In Vercel dashboard, go to your project
   - Click on the latest deployment
   - Review the "Build Logs" to ensure no errors

2. **Test your live site:**
   - Visit your Vercel URL
   - Verify that Airtable data is loading correctly
   - Check that all pages work as expected

## 🔄 Daily Development Workflow

### Standard Git Commands Sequence

```bash
# 1. Check current status
git status

# 2. Stage your changes (choose one):
# Stage all changes:
git add .
# Or stage specific files:
git add path/to/specific/file.tsx

# 3. Commit your changes with a descriptive message
git commit -m "Add new crew search functionality"

# 4. Push to GitHub (this triggers automatic deployment)
git push origin main
```

### How Automatic Deployment Works

1. **Trigger:** When you run `git push origin main`
2. **GitHub:** Receives your code changes
3. **Vercel Webhook:** Automatically detects the push
4. **Build Process:** Vercel pulls the latest code and runs:
   ```bash
   npm install
   npm run build
   ```
5. **Deployment:** If build succeeds, deploys to production
6. **Notification:** You'll receive an email with deployment status

### Typical Development Session

```bash
# Start development server
npm run dev

# Make your changes...
# Test locally at http://localhost:3000

# When ready to deploy:
git add .
git commit -m "Implement crew filtering by location"
git push origin main

# Check deployment at https://your-project.vercel.app
```

## 🌟 Deployment Types

### Production Deployment
- **Trigger:** Push to `main` branch
- **URL:** Your main domain (e.g., `https://runningcrews.vercel.app`)
- **Purpose:** Live site that users see
- **Command:** `git push origin main`

### Preview Deployment
- **Trigger:** Push to any other branch (e.g., `feature/new-search`)
- **URL:** Unique preview URL (e.g., `https://runningcrews-git-feature-new-search.vercel.app`)
- **Purpose:** Test features before merging to main
- **Commands:**
  ```bash
  # Create and switch to feature branch
  git checkout -b feature/new-search
  
  # Make changes and commit
  git add .
  git commit -m "Add advanced search filters"
  
  # Push feature branch (creates preview deployment)
  git push origin feature/new-search
  ```

### Pull Request Deployments
- **Trigger:** Creating a Pull Request on GitHub
- **URL:** Unique preview URL linked to the PR
- **Purpose:** Review changes before merging
- **Workflow:**
  1. Push feature branch: `git push origin feature/new-search`
  2. Create Pull Request on GitHub
  3. Vercel automatically creates preview deployment
  4. Review and test the preview
  5. Merge PR to deploy to production

## 🔧 Advanced Configuration

### Custom Domain (Optional)
1. In Vercel dashboard, go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Environment Variables Management
- **Production:** Set in Vercel dashboard
- **Development:** Use `.env.local` file (never commit this)
- **Preview:** Inherits from production unless overridden

### Build Optimization
The included `vercel.json` file optimizes:
- Build commands
- Environment variables
- Security headers
- Function runtime settings

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails:**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`
   - Verify environment variables are set

2. **Airtable Data Not Loading:**
   - Verify `AIRTABLE_BASE_ID` and `AIRTABLE_PERSONAL_ACCESS_TOKEN`
   - Check Airtable API limits
   - Review Next.js API routes

3. **Git Push Rejected:**
   ```bash
   # Pull latest changes first
   git pull origin main
   # Resolve any conflicts
   # Then push again
   git push origin main
   ```

### Useful Commands

```bash
# Check deployment status
vercel --version
vercel list

# View build logs locally
npm run build

# Test production build locally
npm run build && npm start
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [GitHub Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)

---

**🎉 Congratulations!** You now have a fully automated CI/CD pipeline. Every time you push code to GitHub, Vercel will automatically build and deploy your site!