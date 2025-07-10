# Supabase Setup for Service Homie

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `service-homie`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
5. Click "Create new project"

## 2. Get Your Project Credentials

1. Go to Settings → API in your Supabase dashboard
2. Copy the following values:
   - Project URL
   - Anon (public) key

## 3. Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Set Up Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL commands
4. This will create all necessary tables, indexes, and sample data

## 5. Configure Authentication (Optional)

If you want to use Supabase Auth:

1. Go to Authentication → Settings
2. Configure your site URL: `http://localhost:3000` (for development)
3. Add any additional redirect URLs as needed

## 6. Test the Connection

The project is now set up to use Supabase! The marketplace pages will automatically fetch data from your Supabase database once you:

1. Add your environment variables
2. Run the SQL schema
3. Restart your development server

## Database Tables Created

- **users**: User accounts (homeowners and technicians)
- **technicians**: Technician profiles and service information
- **bookings**: Service bookings between homeowners and technicians
- **reviews**: Reviews left by homeowners for technicians
- **messages**: Chat messages between homeowners and technicians

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:
- Users can only access their own data
- Technicians are publicly viewable
- Bookings are restricted to involved parties
- Reviews are publicly viewable but only creatable by booking homeowners

## Next Steps

1. Update the marketplace pages to use Supabase data instead of mock data
2. Implement user authentication
3. Add booking functionality
4. Implement messaging system
5. Add payment processing 