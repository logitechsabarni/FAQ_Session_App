# FAQ_Session

A modern AI-style FAQ discussion platform built with React, TypeScript, Tailwind CSS, and Supabase.

![FAQ_Session Banner](https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=400&dpr=2)

## Overview

FAQ_Session is a community-driven question and answer platform designed with a modern dark UI featuring glassmorphism effects and smooth animations. Users can ask questions, provide answers, and engage in meaningful discussions. Inspired by internship portals like Samagama, Yaksha AI, and IIT help desks.

## Features

### Core Features
- **Public FAQ Browsing** - Browse and search FAQs without authentication
- **User Authentication** - Secure email/password authentication with Supabase Auth
- **Ask Questions** - Create new FAQs with categories and tags
- **Discussion System** - Reply to questions, mark answers as accepted
- **User Profiles** - View your questions and replies
- **Search & Filter** - Search FAQs by keyword and filter by category
- **Responsive Design** - Fully responsive across all devices
- **Modern UI** - Dark theme with glassmorphism and smooth animations

### Advanced Features
- **Yaksha Mini AI Chatbot** - AI-powered assistant for instant answers
- **Voice Assistant** - Speech-to-text support for voice commands
- **File Upload** - Document and image upload support
- **AI Help Desk** - Centralized AI-powered support portal

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
│   ├── LoadingSpinner.tsx
│   ├── YakshaMini.tsx       # AI Chatbot
│   ├── ChatbotButton.tsx    # Floating chat button
│   ├── ChatMessage.tsx      # Chat bubble component
│   ├── SuggestedQuestions.tsx
│   ├── TypingIndicator.tsx
│   ├── VoiceAssistant.tsx   # Voice support
│   └── FileUploader.tsx     # File upload
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
│   ├── AIHelpDesk.tsx       # AI Help Desk
│   └── NotFound.tsx
│
├── routes/              # Routing configuration
│   └── AppRoutes.tsx
│
├── lib/                 # External service configurations
│   └── supabase.ts
│
├── types/               # TypeScript types
│   ├── database.ts
│   └── speech.d.ts
│
├── utils/               # Utility functions
│   └── constants.ts
│
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Yaksha Mini AI Chatbot

Yaksha Mini is our AI-powered assistant that helps users find answers quickly.

### Features
- Keyword-based FAQ matching
- Suggested question prompts
- Related FAQ recommendations
- Chat interface with typing animation
- Floating button for quick access

### Usage
1. Click the chat button (bottom-right corner)
2. Type your question or select a suggested prompt
3. Yaksha Mini will search our FAQ database
4. Related FAQs are shown with clickable links

### Supported Queries
- NOC submission and documents
- Mentor assignment and availability
- GitHub setup and configuration
- Zoom sessions and attendance
- Team formation and projects
- Certificates and evaluations

## Voice Assistant

Voice-powered support for hands-free interaction.

### Features
- Speech-to-text transcription
- Pulsing microphone animation
- Supported voice commands
- Browser compatibility detection

### Browser Support
- Chrome (recommended)
- Edge
- Safari (limited)

### Voice Commands
- "Search for internship FAQs"
- "Show my questions"
- "How do I submit NOC?"

## File Upload

Document and image upload support.

### Supported Formats
- Images: JPG, PNG, GIF
- Documents: PDF, DOC, DOCX

### Constraints
- Maximum file size: 5MB
- Drag & drop or click to upload
- Progress indicator
- Preview before submission

## FAQ Categories

The platform includes 27 categories covering:

- **Internship Basics** - Duration, application, prerequisites
- **NOC & Documentation** - Certificate submission, verification
- **Team Formation** - Allocation, conflicts, projects
- **LMS & Courses** - Access, progress, curriculum
- **Certificates** - Completion, verification, recommendations
- **Attendance** - Policy, Zoom sessions, tracking
- **Interviews** - Preparation, coding, take-home assignments
- **GitHub Setup** - Repository, SSH keys, pull requests
- **Open Source** - Contributions, evaluation
- **AI Coursework** - ML, deep learning, tools
- **Voice Sessions** - Mandatory sessions, connectivity
- **Mentorship** - Assignment, meetings, changes
- **Daily Workflow** - Standups, tasks, tracking
- **Project Submission** - Requirements, deadlines
- **Evaluations** - Scoring, feedback
- **Account Access** - Login, password reset
- **Troubleshooting** - Technical issues, bugs

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
| category | text | Category (27 categories available) |
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
- [ ] Internationalization (i18n)
- [ ] AI model integration (OpenAI/Anthropic)
- [ ] Multi-language voice support

## License

This project is licensed under the MIT License.

## Acknowledgments

- Design inspiration from Samagama FAQ system and Yaksha AI FAQ interface
- Icons by [Lucide](https://lucide.dev)
- Stock photos from [Pexels](https://pexels.com)

---

Built with modern web technologies and designed for the community.


https://mern-stack-faq-discu-dmb5.bolt.host/- The app link
