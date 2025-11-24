# RNSTweets - RNSIT Social Platform

A modern, AI-moderated social media platform built exclusively for RNSIT students and faculty. Features real-time interactions, intelligent content moderation, and a clean, responsive user interface.

## Features

### Core Social Features
- **Tweet Posting** - Share thoughts with the RNSIT community (280 characters max)
- **Interactions** - Like, retweet, reply, and share tweets
- **User Profiles** - View profiles with tweet history, follower counts, and bios
- **Following System** - Follow/unfollow users and build your network
- **Explore** - Discover trending content and search tweets
- **Bookmarks** - Save tweets for later
- **Notifications** - Real-time alerts for likes, follows, mentions, and replies
- **Direct Messages** - Private conversations with other users
- **Trending** - View what's trending in the RNSIT community

### AI-Powered Moderation
- **Automatic Content Scanning** - All tweets are analyzed for toxicity using OpenRouter API
- **Demerit System** - Toxic content receives demerit points based on severity
- **User Suspension** - Users reaching 50 demerits are automatically suspended
- **Admin Dashboard** - View flagged content, statistics, and top offenders

### Theme Support
- **Dark/Light Mode** - Toggle between themes with persistent storage
- **Responsive Design** - Fully responsive on mobile, tablet, and desktop
- **Modern UI** - Clean, intuitive interface with smooth interactions

## Tech Stack

- **Frontend**: Next.js 16 with React 19, TypeScript
- **Styling**: Tailwind CSS v4 with dark mode support
- **Database**: MongoDB
- **Authentication**: JWT with @rnsit.ac.in email validation
- **Security**: bcryptjs password hashing
- **AI Moderation**: OpenRouter API (Llama 3.2 model)
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB instance (local or cloud)
- OpenRouter API key (get free at openrouter.ai)

### Installation

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment Variables**
   
   Create a `.env.local` file in the root directory:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/rnstweets
   JWT_SECRET=your-secret-key-here
   OPENROUTER_API_KEY=your-openrouter-api-key
   NEXT_PUBLIC_API_URL=http://localhost:3000
   \`\`\`

3. **Seed Dummy Data (Optional)**
   
   To populate the database with sample users and tweets:
   \`\`\`bash
   npm run seed
   \`\`\`

4. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Email Requirements

- Only @rnsit.ac.in email addresses are accepted for registration
- Example: `student@rnsit.ac.in`, `faculty@rnsit.ac.in`

## Default Credentials (After Seeding)

Sample accounts created by the seed script:
- **Rajesh Kumar** - rajesh@rnsit.ac.in (tech enthusiast)
- **Priya Sharma** - priya@rnsit.ac.in (UI/UX Designer)
- **Arjun Verma** - arjun@rnsit.ac.in (Full-stack developer)
- **Neha Kapoor** - neha@rnsit.ac.in (Writer)
- **Amit Singh** - amit@rnsit.ac.in (Sports enthusiast)

All sample accounts use password: `password123` (only after seeding)

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout with theme provider
│   ├── globals.css           # Global styles and design tokens
│   ├── feed/                 # Home feed with tweet composer
│   ├── explore/              # Discovery and search
│   ├── profile/              # User profiles
│   ├── bookmarks/            # Saved tweets
│   ├── notifications/        # User notifications
│   ├── messages/             # Direct messaging
│   ├── trending/             # Trending topics
│   ├── admin/                # Admin dashboard
│   ├── login/                # Authentication
│   ├── signup/               # Registration
│   └── api/graphql/          # GraphQL API
├── components/
│   └── theme-switcher.tsx    # Dark/light mode toggle
├── lib/
│   ├── db.ts                 # MongoDB connection
│   ├── auth.ts               # JWT utilities
│   ├── ai-moderation.ts      # OpenRouter integration
│   └── models/               # MongoDB schemas
│       ├── User.ts
│       ├── Tweet.ts
│       ├── Bookmark.ts
│       ├── Notification.ts
│       └── ...
└── scripts/
    └── seed-data.ts          # Database seeding script
\`\`\`

## Key Features Explained

### AI Moderation System
- Analyzes tweet content for toxicity using Llama 3.2 model
- Assigns demerit points (5-15) based on toxicity level
- Blocks posts with very high toxicity scores
- Automatically suspends users at 50+ demerits

### Authentication
- Email verification requires @rnsit.ac.in domain
- Passwords hashed with bcryptjs
- JWT tokens stored in localStorage
- Automatic token validation on protected routes

### Responsive Design
- Mobile-first approach
- Sidebar collapses on smaller screens
- Touch-friendly interface
- Optimized for all device sizes

## API Endpoints

All API interactions go through `/api/graphql` GraphQL endpoint.

Key Queries:
- `feed` - Get user's feed
- `explore` - Get discovery feed
- `userByUsername` - Get user profile
- `bookmarks` - Get saved tweets
- `notifications` - Get notifications
- `conversations` - Get direct messages
- `trendingHashtags` - Get trending topics

Key Mutations:
- `signup` - Create new account
- `login` - User authentication
- `createTweet` - Post new tweet
- `likeTweet` - Like a tweet
- `followUser` - Follow a user
- `addBookmark` - Bookmark a tweet
- `sendMessage` - Send direct message

## Deployment

### Deploy to Vercel

1. Push to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Vercel auto-deploys on push

### Required Environment Variables on Vercel
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `OPENROUTER_API_KEY` - Your OpenRouter API key

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Server-side rendering with Next.js
- Image optimization
- Code splitting
- Lazy loading of components
- Efficient database queries

## Security Features

- Email verification required
- JWT-based authentication
- Password hashing with bcryptjs
- XSS protection with React
- CSRF protection via Next.js
- AI content moderation
- User suspension system

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in .env.local
- Verify network access if using cloud MongoDB

### OpenRouter API Issues
- Verify API key is correct
- Check API rate limits
- Ensure sufficient API credits

### Theme Not Persisting
- Clear browser cache
- Check localStorage permissions
- Verify JavaScript is enabled

## Future Enhancements

- Media uploads (images/videos)
- Quoted tweets
- Tweet threads
- User analytics
- Premium features
- Mobile app
- Real-time notifications with WebSockets

## Contributing

This is an educational project for RNSIT. For improvements or bug reports, please create an issue.

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, contact the development team or raise an issue in the repository.

---

Built with passion for the RNSIT community.
