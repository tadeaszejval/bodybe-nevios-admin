# Setting Up Supabase Authentication

This document guides you through setting up Supabase authentication for the UI Foundations Kit.

## 1. Create a Supabase Project

1. Go to [Supabase](https://app.supabase.io/) and sign up or log in
2. Create a new project
3. Choose a name and password for your project
4. Wait for the project to be initialized

## 2. Configure Project Settings

### Get API Credentials

1. In your Supabase project dashboard, go to **Project Settings** → **API**
2. Under **Project API keys**, copy the following values:
   - **URL**: Your Supabase project URL
   - **anon public**: Your anonymous key

### Configure Environment Variables

1. Create a `.env` file at the root of your project (or edit existing one) with the following values:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

2. Replace the placeholders with your actual values

## 3. Enable Authentication Providers

### Email/Password Authentication

1. Go to **Authentication** → **Providers**
2. Email provider should be enabled by default
3. Toggle **Confirm email** based on your needs

### OAuth Providers (Optional)

To enable Google or GitHub authentication:

1. Go to **Authentication** → **Providers**
2. Click on your chosen provider (Google, GitHub, etc.)
3. Follow the provider-specific instructions to get your Client ID and Client Secret
4. Enter these credentials and enable the provider

## 4. Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add the following URLs:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: 
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000`
     - Any other URLs where you want to redirect after authentication

## 5. Restart Your App

After configuring everything, restart your Next.js app to apply the changes:

```bash
npm run dev
```

## Usage

The authentication system provides the following features:

- User registration with email/password
- Email/password login
- Google and GitHub OAuth login (if configured)
- Protected routes (dashboard)
- User profile and logout functionality

You can access authentication functions using the `useAuth` hook:

```jsx
import { useAuth } from "../context/AuthProvider";

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  
  // Check if user is logged in
  if (user) {
    return <div>Welcome, {user.email}!</div>;
  }
  
  // ...rest of component
}
``` 