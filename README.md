# FAQ_Session

A modern AI-style FAQ discussion platform built with React, TypeScript, Tailwind CSS, and Supabase.

![FAQ_Session Banner](https://images.pexels.com/photo/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=400&dpr=2)

## Overview

FAQ_Session is a community-driven question and answer platform designed with a modern dark UI featuring glassmorphism effects and smooth animations. Users can ask questions, provide answers, and engage in meaningful discussions.

## Features

- **Public FAQ Browsing** - Browse and search FAQs without authentication
- **User Authentication** - Secure email/password authentication with Supabase Auth
- **Ask Questions** - Create new FAQs with categories and tags
- **Discussion System** - Reply to questions, mark answers as accepted
- **User Profiles** - View your questions and replies
- **Search & Filter** - Search FAQs by keyword and filter by category
- **Responsive Design** - Fully responsive across all devices
- **Modern UI** - Dark theme with glassmorphism and smooth animations

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router DOM** - Routing
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **date-fns** - Date formatting

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL Database
  - Authentication
  - Row Level Security
  - Real-time subscriptions

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── FAQCard.tsx
│   ├── FAQAccordion.tsx
│   ├── ReplyCard.tsx
│   ├── SearchBar.tsx
│   ├── CategoryFilter.tsx
│   ├── HeroSection.tsx
│   ├── ProtectedRoute.tsx
│   └── LoadingSpinner.tsx
│
├── context/             # React context providers
│   └── AuthContext.tsx
│
├── layouts/             # Layout components
│   └── MainLayout.tsx
│
├── pages/               # Page components
│   ├── Home.tsx
│   ├── FAQPage.tsx
│   ├── FAQDetails.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── AddFAQ.tsx
│   ├── Profile.tsx
│   └── NotFound.tsx
│
├── routes/              # Routing configuration
│   └── AppRoutes.tsx
│
├── lib/                 # External service configurations
│   └── supabase.ts
│
├── types/               # TypeScript types
│   └── database.ts
│
├── utils/               # Utility functions
│   └── constants.ts
│
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Database Schema

### Tables

#### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, references auth.users |
| name | text | Display name |
| avatar | text | Avatar URL |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

#### faqs
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| question | text | Question title |
| description | text | Detailed description |
| category | text | Category (general, technical, billing, etc.) |
| tags | text[] | Array of tags |
| created_by | uuid | References profiles |
| view_count | integer | Number of views |
| is_resolved | boolean | Whether marked as resolved |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

#### replies
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| faq_id | uuid | References faqs |
| user_id | uuid | References profiles |
| message | text | Reply content |
| is_answer | boolean | If marked as accepted answer |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Last update timestamp |

## API Endpoints

The application uses Supabase client SDK directly from the frontend. Key operations include:

### Authentication
- `supabase.auth.signUp()` - Register new user
- `supabase.auth.signInWithPassword()` - Sign in
- `supabase.auth.signOut()` - Sign out
- `supabase.auth.getSession()` - Get current session

### FAQs
- `supabase.from('faqs').select()` - Get FAQs
- `supabase.from('faqs').insert()` - Create FAQ
- `supabase.from('faqs').update()` - Update FAQ
- `supabase.from('faqs').delete()` - Delete FAQ

### Replies
- `supabase.from('replies').select()` - Get replies for FAQ
- `supabase.from('replies').insert()` - Add reply
- `supabase.from('replies').update()` - Update reply
- `supabase.from('replies').delete()` - Delete reply

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd faq-session
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_SUPABASE_URL | Your Supabase project URL | Yes |
| VITE_SUPABASE_ANON_KEY | Your Supabase anonymous key | Yes |

## Features in Detail

### Public FAQ Browsing
- View all FAQs without signing in
- Search questions by keyword
- Filter by category
- Sort by newest or most viewed

### Authentication Flow
- Email/password registration
- Automatic profile creation on signup
- Session persistence
- Protected routes for authenticated users

### Question & Answer System
- Create questions with categories and tags
- Rich accordion view for FAQ list
- Reply to questions
- Mark replies as accepted answers
- View count tracking

### User Profiles
- View personal statistics
- See all questions asked
- See all replies posted
- Edit display name

## Screenshots

### Home Page
*Hero section with featured FAQs and trending questions*

### FAQ Browser
*Accordion-style FAQ list with search and filters*

### Question Details
*Full question view with replies and answer submission*

### Profile Page
*User statistics and activity overview*

## Security

### Row Level Security (RLS)
All database tables have RLS enabled with restrictive policies:

- **profiles**: Users can read all profiles, update only their own
- **faqs**: Public read, authenticated users can create/update/delete own
- **replies**: Public read, authenticated users can create/update/delete own

### Authentication
- Passwords are hashed by Supabase Auth
- JWT tokens for session management
- Automatic token refresh

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables
4. Deploy

### Backend (Supabase)
The backend is hosted on Supabase:
1. Create a Supabase project
2. Run the migrations
3. Configure authentication settings
4. Update frontend environment variables

## Future Improvements

- [ ] Markdown support in descriptions
- [ ] Image uploads for questions/replies
- [ ] Real-time notifications
- [ ] Email notifications for replies
- [ ] FAQ bookmarking system
- [ ] User reputation system
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Dark/Light theme toggle
- [ ] Internationalization (i18n)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Design inspiration from Samagama FAQ system and Yaksha AI FAQ interface
- Icons by [Lucide](https://lucide.dev)
- Stock photos from [Pexels](https://pexels.com)

---

Built with modern web technologies and designed for the community.
