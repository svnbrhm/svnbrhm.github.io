# 🚀 Deployment Quick Reference

## Daily Workflow Commands

### Basic Deployment (Production)
```bash
# 1. Check what changed
git status

# 2. Stage all changes
git add .

# 3. Commit with message
git commit -m "Your descriptive commit message"

# 4. Deploy to production
git push origin main
```

### Feature Branch Workflow (Preview)
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, then:
git add .
git commit -m "Implement your feature"

# Push for preview deployment
git push origin feature/your-feature-name

# When ready, merge to main:
git checkout main
git merge feature/your-feature-name
git push origin main
```

## Deployment Types

| Branch | Deployment Type | URL | Purpose |
|--------|----------------|-----|----------|
| `main` | Production | `your-site.vercel.app` | Live site |
| `feature/*` | Preview | `your-site-git-feature-*.vercel.app` | Testing |
| Pull Request | Preview | Unique preview URL | Code review |

## Environment Variables

**Required for deployment:**
- `AIRTABLE_BASE_ID`
- `AIRTABLE_PERSONAL_ACCESS_TOKEN`

**Set in:** Vercel Dashboard → Project Settings → Environment Variables

## Useful Commands

```bash
# Start local development
npm run dev

# Test production build locally
npm run build && npm start

# Check git status
git status

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

## Troubleshooting 

**Build fails?**
1. Check Vercel build logs
2. Test locally: `npm run build`
3. Verify environment variables

**Push rejected?**
```bash
git pull origin main
# Resolve conflicts if any
git push origin main
```

**Need to rollback?**
1. Go to Vercel dashboard
2. Find previous deployment
3. Click "Promote to Production"

---

💡 **Remember:** Every `git push origin main` triggers automatic deployment to production!