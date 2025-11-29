# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the Vendora Client application to Vercel using the Vercel CLI.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Deployment Commands](#deployment-commands)
- [Common Workflows](#common-workflows)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. **Node.js** installed (v18 or higher recommended)
2. **Vercel CLI** installed globally:
   ```bash
   npm install -g vercel
   ```
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
4. **Git** (optional but recommended for version control)

## Initial Setup

### 1. Login to Vercel

First, authenticate with your Vercel account:

```bash
vercel login
```

This will open your browser to complete the authentication process.

### 2. Link Your Project

If this is your first time deploying, link your local project to Vercel:

```bash
cd e:\var\www\vendora\client-side
vercel link
```

The project is already configured with the name `vendora-client`.

## Deployment Commands

### Preview Deployment

Deploy to a preview URL (for testing changes):

```bash
vercel
```

Or with auto-confirmation:

```bash
vercel --yes
```

**Preview URLs** are temporary and perfect for testing new features before going live.

### Production Deployment

Deploy to production (your main live site):

```bash
vercel --prod
```

Or with auto-confirmation:

```bash
vercel --prod --yes
```

**Production URL**: https://vendora-client-eight.vercel.app

## Common Workflows

### After Adding New Features

When you've added new features or made changes:

1. **Test locally first**:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 to test your changes.

2. **Build locally to check for errors**:
   ```bash
   npm run build
   ```
   Fix any TypeScript or build errors before deploying.

3. **Deploy to preview** (test in production-like environment):
   ```bash
   vercel --yes
   ```
   Review the preview URL that's generated.

4. **Deploy to production** (when ready):
   ```bash
   vercel --prod --yes
   ```

### Quick Deploy Workflow

For experienced developers who want to push changes quickly:

```bash
# One-liner: Build locally, then deploy to production
npm run build && vercel --prod --yes
```

### Rollback to Previous Deployment

If something goes wrong, you can rollback:

```bash
# List all deployments
vercel ls

# Promote a specific deployment to production
vercel promote [deployment-url]
```

## Environment Variables

### View Environment Variables

```bash
vercel env ls
```

### Add Environment Variables

```bash
# Add a new environment variable
vercel env add [VARIABLE_NAME]
```

You'll be prompted to:
1. Enter the value
2. Choose environments (Production, Preview, Development)

### Common Environment Variables

For the Vendora Client, you may need:

```bash
# API endpoint
vercel env add NEXT_PUBLIC_API_URL

# Stripe keys (if using payment integration)
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY

# Other service keys
vercel env add NEXT_PUBLIC_APP_URL
```

### Update Environment Variables

```bash
# Remove old variable
vercel env rm [VARIABLE_NAME]

# Add new value
vercel env add [VARIABLE_NAME]
```

After updating environment variables, redeploy:

```bash
vercel --prod --yes
```

## Project Configuration

The project uses [vercel.json](./vercel.json) for configuration:

```json
{
  "name": "vendora-client",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**Note**: The `name` property in vercel.json is deprecated but still works. The project name is now primarily managed through the Vercel dashboard.

## Deployment Checklist

Before deploying to production, ensure:

- [ ] All TypeScript errors are resolved
- [ ] Local build completes successfully (`npm run build`)
- [ ] All tests pass (if you have tests)
- [ ] Environment variables are properly configured
- [ ] No console errors in the browser
- [ ] Preview deployment tested and working
- [ ] Database migrations completed (if applicable)
- [ ] API endpoints are accessible

## Troubleshooting

### Build Fails with TypeScript Errors

**Solution**: Fix TypeScript errors locally first:

```bash
npm run build
```

Common fixes:
- Add missing type definitions
- Ensure all interfaces match their implementations
- Check for missing imports

### "Project name already exists" Error

**Solution**: The project is already linked. Use:

```bash
vercel --yes
```

Or re-link:

```bash
vercel link
```

### Environment Variables Not Working

**Solution**:
1. Verify variables exist:
   ```bash
   vercel env ls
   ```

2. Pull environment variables locally:
   ```bash
   vercel env pull
   ```

3. Redeploy after adding variables:
   ```bash
   vercel --prod --yes
   ```

### Deployment Timeout

**Solution**:
- Check your build logs: `vercel logs [deployment-url]`
- Optimize your build process
- Remove unnecessary dependencies

### "useSearchParams() should be wrapped in a suspense boundary" Error

**Solution**: Wrap components using `useSearchParams()` in a Suspense boundary:

```tsx
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function YourComponent() {
  const searchParams = useSearchParams()
  // Your component code
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <YourComponent />
    </Suspense>
  )
}
```

## Advanced Commands

### Inspect Deployment

View detailed information about a deployment:

```bash
vercel inspect [deployment-url]
```

### View Logs

View runtime logs for a deployment:

```bash
vercel logs [deployment-url]
```

Follow logs in real-time:

```bash
vercel logs [deployment-url] --follow
```

### List All Deployments

```bash
vercel ls
```

### Remove a Deployment

```bash
vercel rm [deployment-url]
```

### Redeploy

Redeploy an existing deployment:

```bash
vercel redeploy [deployment-url]
```

Redeploy to production:

```bash
vercel redeploy [deployment-url] --prod
```

## Best Practices

1. **Always test in preview first**: Deploy with `vercel` before `vercel --prod`
2. **Use environment variables**: Never commit sensitive data
3. **Keep dependencies updated**: Regularly run `npm update`
4. **Monitor deployments**: Check Vercel dashboard for build status
5. **Use Git**: Commit changes before deploying
6. **Document changes**: Update README.md with new features

## Quick Reference

| Command | Description |
|---------|-------------|
| `vercel` | Deploy to preview |
| `vercel --prod` | Deploy to production |
| `vercel --yes` | Deploy with auto-confirm |
| `vercel login` | Login to Vercel |
| `vercel logout` | Logout from Vercel |
| `vercel ls` | List all deployments |
| `vercel env ls` | List environment variables |
| `vercel env add` | Add environment variable |
| `vercel logs [url]` | View deployment logs |
| `vercel inspect [url]` | Inspect deployment details |
| `vercel promote [url]` | Promote deployment to production |
| `vercel rm [url]` | Remove a deployment |
| `vercel link` | Link local project to Vercel |
| `vercel pull` | Pull environment & settings |

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel CLI Reference**: https://vercel.com/docs/cli

## Project Information

- **Project Name**: vendora-client
- **Framework**: Next.js 16.0.1
- **Production URL**: https://vendora-client-eight.vercel.app
- **Vercel Dashboard**: https://vercel.com/augustinmaps01s-projects/vendora-client

---

**Last Updated**: November 5, 2025
