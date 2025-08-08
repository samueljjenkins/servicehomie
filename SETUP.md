# Whop App Setup Guide

Welcome to your new Whop app! This guide will help you get everything set up and running.

## 🚀 Quick Start

### 1. Environment Variables Setup

1. **Copy the environment template:**
   ```bash
   cp env-template.txt .env.local
   ```

2. **Get your Whop credentials:**
   - Go to [Whop Dashboard](https://whop.com/dashboard/developer/)
   - Create a new app in the Developer section
   - Copy the environment variables from your app settings

3. **Update your .env.local file:**
   Replace all the placeholder values in `.env.local` with your actual Whop credentials:
   - `WHOP_API_KEY` - Your Whop API key
   - `WHOP_WEBHOOK_SECRET` - Your webhook secret (optional for now)
   - `NEXT_PUBLIC_WHOP_AGENT_USER_ID` - A user ID your app can control
   - `NEXT_PUBLIC_WHOP_APP_ID` - Your app ID
   - `NEXT_PUBLIC_WHOP_COMPANY_ID` - Your company ID

### 2. Configure Your Whop App

In your Whop dashboard, make sure to set:
- **Base URL**: Your deployment domain (use `localhost:3000` for development)
- **App path**: `/experiences/[experienceId]`
- **Discover path**: `/discover`

### 3. Install Dependencies & Run

```bash
# Install dependencies (already done)
pnpm install

# Start the development server
pnpm dev
```

### 4. Test Your App

1. The dev server will start on `http://localhost:3000`
2. Look for a translucent settings icon in the top right
3. Click it and select "localhost" with port 3000
4. Your app should now be running with Whop authentication!

## 🔧 What's Included

### Authentication
- ✅ Whop SDK integration with `@whop/react`
- ✅ Automatic user authentication
- ✅ Protected routes and components

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with WhopApp wrapper
│   ├── page.tsx           # Main landing page
│   ├── discover/          # Discover page for your app
│   ├── experiences/       # Experience pages
│   └── api/              # API routes
├── lib/
│   └── whop-sdk.ts       # Whop SDK configuration
├── .env.development      # Development environment template
└── env-template.txt      # Environment variables template
```

### Key Features
- **Modern Stack**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Whop SDK integration
- **Development**: Hot reload with Turbopack
- **Code Quality**: Biome for linting and formatting

## 🛠️ Next Steps

### Adding Your Own Features

1. **Create new pages** in the `app/` directory
2. **Add API routes** in `app/api/`
3. **Use the Whop SDK** for user data and company operations
4. **Style with Tailwind** CSS classes

### Example: Accessing User Data

```typescript
import { whopSdk } from '@/lib/whop-sdk';

// Get current user
const user = await whopSdk.users.getCurrentUser();

// Get user's companies
const companies = await whopSdk.users.getUserCompanies();
```

### Example: Company Operations

```typescript
import { whopSdk } from '@/lib/whop-sdk';

// Get company details
const company = await whopSdk.companies.getCompany({
  companyId: 'your-company-id'
});

// Get company members
const members = await whopSdk.companies.getCompanyMembers({
  companyId: 'your-company-id'
});
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Any platform that supports Next.js will work. Just make sure to:
- Set all environment variables
- Update your Whop app's Base URL
- Configure webhook URLs if needed

## 📚 Resources

- [Whop Documentation](https://dev.whop.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Whop API Reference](https://dev.whop.com/api)

## 🆘 Troubleshooting

**App not loading?**
- Check your environment variables are set correctly
- Ensure your Whop app's "App path" is set to `/experiences/[experienceId]`
- Verify your Base URL is correct in the Whop dashboard

**Authentication issues?**
- Make sure `NEXT_PUBLIC_WHOP_APP_ID` is set correctly
- Check that your app is installed in a Whop

**Need help?**
- Check the [Whop Documentation](https://dev.whop.com)
- Join the [Whop Discord](https://discord.gg/whop)

---

Happy coding! 🎉
