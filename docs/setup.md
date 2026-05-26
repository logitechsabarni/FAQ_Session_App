# Setup Guide

This guide walks you through setting up the FAQ_Session platform from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download Git](https://git-scm.com/)
- A **Supabase account** - [Sign up at supabase.com](https://supabase.com)

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Enter a project name (e.g., "faq-session")
4. Set a secure database password
5. Choose a region closest to your users
6. Click "Create new project"
7. Wait for the project to be provisioned (1-2 minutes)

### 1.2 Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the **Project URL** (this is your `VITE_SUPABASE_URL`)
3. Copy the **anon public** key (this is your `VITE_SUPABASE_ANON_KEY`)

### 1.3 Run Database Migrations

The migrations are included in the Supabase dashboard:

1. Go to the **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy the contents of each migration from `supabase/migrations/` folder
4. Execute each migration in order (001, 002, 003...)

Or use the Supabase CLI:
```bash
supabase db push
```

### 1.4 Configure Authentication

1. Go to **Authentication** > **Providers**
2. Ensure **Email** provider is enabled
3. Go to **Authentication** > **Settings**
4. Configure:
   - Disable email confirmations (for development)
   - Set site URL to your frontend URL
   - Add redirect URLs for your application

## Step 2: Clone and Set Up the Project

### 2.1 Clone the Repository

```bash
git clone <repository-url>
cd faq-session
```

### 2.2 Install Dependencies

```bash
npm install
```

This will install all required packages:
- React and React DOM
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router DOM
- Supabase client
- And more...

### 2.3 Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Run the Development Server

### 3.1 Start the Application

```bash
npm run dev
```

### 3.2 Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the FAQ_Session homepage with sample FAQ data.

## Step 4: Verify the Setup

### 4.1 Check Database Connection

1. The homepage should display sample FAQs
2. Browse the FAQ page - FAQs should load
3. Click on a FAQ to view details

### 4.2 Test Authentication

1. Click "Sign In" in the navigation
2. Click "Create one" to register
3. Enter your details and submit
4. You should be redirected to the homepage
5. The navigation should show your profile avatar

### 4.3 Test Creating a FAQ

1. While logged in, click "Ask Question"
2. Fill in the form:
   - Question title
   - Description
   - Category
   - Tags
3. Submit the form
4. You should be redirected to your new FAQ

### 4.4 Test Replying

1. Open any FAQ
2. Scroll to the reply section
3. Write and submit a reply
4. Your reply should appear in the list

## Common Issues and Solutions

### Issue: "Missing Supabase environment variables"

**Solution:**
- Ensure `.env` file exists in the root directory
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart the development server after adding variables

### Issue: "Failed to fetch FAQs"

**Solution:**
- Check that migrations have been run
- Verify Supabase project is running
- Check browser console for specific errors
- Verify RLS policies are correct

### Issue: "Authentication fails"

**Solution:**
- Verify Supabase Auth is enabled
- Check that email confirmation is disabled (for development)
- Ensure correct project URL and API key
- Clear browser localStorage and try again

### Issue: "Cannot create FAQ"

**Solution:**
- Ensure you're logged in
- Check RLS policy for INSERT on faqs table
- Verify profile was created (check profiles table)
- Check browser console for errors

### Issue: "Styles not loading correctly"

**Solution:**
- Run `npm run dev` to ensure Tailwind is compiled
- Check that `index.css` is imported in `main.tsx`
- Clear browser cache and hard refresh

### Issue: "Build fails"

**Solution:**
- Check TypeScript errors with `npm run typecheck`
- Ensure all imports are correct
- Verify all dependencies are installed
- Try deleting `node_modules` and running `npm install` again

## Development Workflow

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type checking
npm run typecheck
```

### Hot Reloading

The development server supports hot module replacement (HMR):
- Changes to components update instantly
- Styles refresh automatically
- No full page reload needed

### Database Changes

When making database schema changes:

1. Create a new migration file in `supabase/migrations/`
2. Write the SQL migration
3. Run the migration in Supabase dashboard
4. Update TypeScript types in `src/types/database.ts`

## Production Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

### Backend (Supabase)

Your backend is already hosted on Supabase:

1. Ensure migrations are run
2. Update authentication settings
3. Configure production URLs in Supabase dashboard
4. Set up proper RLS policies

## Next Steps

After successful setup:

1. Read the [Authentication Guide](./docs/authentication.md) to understand the auth flow
2. Explore the codebase structure
3. Customize the styling and components
4. Add your own features

## Getting Help

If you encounter issues not covered in this guide:

1. Check the browser console for errors
2. Review the Supabase logs in your dashboard
3. Search existing issues on GitHub
4. Create a new issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details
