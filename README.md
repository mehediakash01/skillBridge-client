<div align="center">

# SkillBridge

### Connect with Expert Tutors — Learn Anything, Anywhere

[![Live Demo](https://img.shields.io/badge/Live%20Demo-skill--bridge--client-brightgreen?style=for-the-badge&logo=vercel)](https://skill-bridge-client-1h8j.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-skill--bridge--server-blue?style=for-the-badge&logo=vercel)](https://skill-bridge-server-tau.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

> **SkillBridge** is a full-featured online tutoring marketplace where students discover and book expert tutors, tutors manage sessions and earn income, and admins oversee the entire platform — all in one elegant, real-time dashboard experience.

</div>

---

## 🌐 Live URLs

| Resource | URL |
|---|---|
| **Frontend (Live App)** | [https://skill-bridge-client-1h8j.vercel.app](https://skill-bridge-client-1h8j.vercel.app) |
| **Backend REST API** | [https://skill-bridge-server-tau.vercel.app](https://skill-bridge-server-tau.vercel.app) |

---

## 🔐 Demo Credentials

Use these credentials to explore the platform .

### Admin Account
| Field | Value |
|---|---|
| **Email** | `mehedi.akash.dev@gmail.com` |
| **Password** | `68774432` |


---

## ✨ Features

### 🎯 For Students
- **Browse Tutors** — Search, filter by price range & experience, sort by rating/price/newest
- **Tutor Profiles** — View bio, hourly rate, subjects, average rating, availability schedule
- **Book Sessions** — Select available time slots and confirm bookings instantly
- **Student Dashboard** — View upcoming, completed, and cancelled sessions with stats
- **Cancel Bookings** — Cancel anytime before the tutor adds a meeting link
- **Leave Reviews** — Rate and review completed sessions (one review per session)

### 👩‍🏫 For Tutors
- **Tutor Dashboard** — Manage all student bookings with real-time status
- **Meeting Link Management** — Add Google Meet / Zoom links before each session
- **Mark Sessions Complete** — Update session status once teaching is done
- **Weekly Availability** — Set open time slots per day (Mon–Sun)
- **Profile Management** — Update bio, subjects, hourly rate, and profile picture
- **Earnings Visibility** — See total revenue from completed sessions

### 🛡️ For Admins
- **Platform Stats Dashboard** — Total users, tutors, students, bookings, revenue at a glance
- **30-Day Analytics Chart** — Line chart tracking bookings, completions, and revenue over time
- **User Management** — View all users, ban or unban accounts
- **Booking Overview** — See all platform bookings with full student and tutor details
- **Category Management** — Add and manage tutoring subject categories

### 🌐 Platform-wide
- **Role-based Access Control** — `STUDENT`, `TUTOR`, `ADMIN` roles with protected routes
- **Dark / Light Mode** — System-aware theme with manual toggle
- **Responsive Design** — Fully optimized for mobile, tablet, and desktop
- **Image Upload** — Cloudinary-powered profile picture uploads
- **Smooth Animations** — Framer Motion transitions throughout the UI
- **Loading Skeletons** — Skeleton screens during data fetching for polished UX
- **Toast Notifications** — Real-time success/error feedback via Sonner

---

## 🗂️ Application Routes

### Public Routes
| Route | Description |
|---|---|
| `/` | Landing page with hero, featured tutors, testimonials, FAQ |
| `/tutors` | Browse all tutors with filters and pagination |
| `/tutors/[id]` | Individual tutor profile with booking form |
| `/about-Us` | About the platform |
| `/become-a-tutor` | Tutor onboarding information & earnings calculator |
| `/how-it-works` | Step-by-step guide for students and tutors |
| `/login` | User login page |
| `/register` | Account registration |

### Student Dashboard (Protected)
| Route | Description |
|---|---|
| `/dashboard` | Student overview — stats + upcoming sessions |
| `/dashboard/bookings` | Full booking history with cancel & review actions |
| `/dashboard/profile` | Edit student profile & upload avatar |

### Tutor Portal (Protected)
| Route | Description |
|---|---|
| `/tutor/dashboard` | Tutor booking management — add meeting links, mark complete |
| `/tutor/profile` | Edit tutor profile, subjects, and hourly rate |
| `/tutor/availability` | Weekly availability slot manager |

### Admin Panel (Protected — Admin Only)
| Route | Description |
|---|---|
| `/admin-dashboard` | Platform stats + 30-day analytics chart |
| `/admin-dashboard/users` | User list with ban/unban controls |
| `/admin-dashboard/bookings` | All platform bookings overview |
| `/admin-dashboard/categories` | Subject category CRUD |

---

## 🛠️ Tech Stack

### Core Framework
| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.1.6 | Full-stack React framework (App Router) |
| [React](https://react.dev) | 19.2.3 | UI library |
| [TypeScript](https://www.typescriptlang.org) | ^5 | Type safety |

### Styling & UI
| Technology | Version | Purpose |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com) | ^4 | Utility-first CSS framework |
| [shadcn/ui](https://ui.shadcn.com) | ^3.8.4 | Pre-built accessible component library |
| [Radix UI](https://www.radix-ui.com) | ^1.4.3 | Headless UI primitives |
| [Framer Motion](https://www.framer.com/motion) | ^12.34.3 | Smooth animations and transitions |
| [Lucide React](https://lucide.dev) | ^0.563.0 | Icon library |
| [next-themes](https://github.com/pacocoursey/next-themes) | ^0.4.6 | Dark/light mode support |
| [tw-animate-css](https://github.com/...) | ^1.4.0 | Tailwind animation utilities |

### Authentication & Session
| Technology | Version | Purpose |
|---|---|---|
| [better-auth](https://www.better-auth.com) | ^1.4.18 | Authentication client & session management |

### Data Fetching & State
| Technology | Version | Purpose |
|---|---|---|
| [TanStack Query](https://tanstack.com/query) | ^5.90.20 | Server state, caching, mutations |
| [Axios](https://axios-http.com) | ^1.13.5 | HTTP client |

### Forms & Validation
| Technology | Version | Purpose |
|---|---|---|
| [React Hook Form](https://react-hook-form.com) | ^7.71.1 | Performant form management |
| [Zod](https://zod.dev) | ^4.3.6 | Schema validation |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | ^5.2.2 | RHF + Zod integration |
| [TanStack Form](https://tanstack.com/form) | ^1.28.3 | Additional form utilities |

### Charts & Data Visualization
| Technology | Version | Purpose |
|---|---|---|
| [Recharts](https://recharts.org) | ^3.7.0 | 30-day analytics line chart |

### Date & Time
| Technology | Version | Purpose |
|---|---|---|
| [date-fns](https://date-fns.org) | ^4.1.0 | Date formatting and manipulation |
| [react-day-picker](https://react-day-picker.js.org) | ^9.13.1 | Calendar / date input component |

### Media & Notifications
| Technology | Version | Purpose |
|---|---|---|
| [Cloudinary](https://cloudinary.com) | ^2.9.0 | Image upload and storage |
| [Sonner](https://sonner.emilkowal.ski) | ^2.0.7 | Toast notifications (primary) |
| [react-hot-toast](https://react-hot-toast.com) | ^2.6.0 | Additional toast support |

### Environment & Configuration
| Technology | Purpose |
|---|---|
| [@t3-oss/env-nextjs](https://env.t3.gg) | Type-safe environment variables |

---

## 📁 Project Structure

```
skill-bridge-server/
├── app/
│   ├── (adminLayout)/          # Admin panel routes
│   │   ├── admin-dashboard/
│   │   │   ├── page.tsx        # Stats + analytics dashboard
│   │   │   ├── bookings/       # All bookings
│   │   │   ├── categories/     # Subject categories
│   │   │   └── users/          # User management
│   ├── (commonLayout)/         # Public routes
│   │   ├── page.tsx            # Landing page
│   │   ├── tutors/             # Browse + tutor profile
│   │   ├── login/              # Authentication
│   │   ├── register/
│   │   ├── about-Us/
│   │   ├── become-a-tutor/
│   │   └── how-it-works/
│   ├── (dashboard)/            # Student routes
│   │   └── dashboard/
│   │       ├── page.tsx        # Student overview
│   │       ├── bookings/
│   │       └── profile/
│   ├── (tutor)/                # Tutor routes
│   │   └── tutor/
│   │       ├── dashboard/      # Booking management
│   │       ├── profile/
│   │       └── availability/
│   ├── api/
│   │   └── upload/route.ts     # Cloudinary upload endpoint
│   ├── globals.css
│   └── layout.tsx              # Root layout
├── components/
│   ├── landingPage.tsx         # Full landing page component
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeToggle.tsx
│   ├── modules/
│   │   ├── authentication/     # Login / Register forms
│   │   ├── bookings/           # Booking form
│   │   └── tutors/             # TutorCard component
│   ├── providers/
│   │   ├── AuthProviders.tsx   # Session context
│   │   └── QueryProvider.tsx   # TanStack Query setup
│   └── ui/                     # shadcn/ui components
├── src/
│   ├── env.ts                  # Type-safe env config (t3-env)
│   ├── proxy.ts                # Route protection middleware
│   ├── constatns/
│   │   └── role.ts             # ADMIN | STUDENT | TUTOR
│   ├── hooks/
│   │   └── useSession.ts       # Auth session hook
│   ├── lib/
│   │   ├── api.ts              # Axios instance
│   │   ├── auth-client.ts      # better-auth client
│   │   ├── utils.ts            # cn() and helpers
│   │   └── validation/auth.ts  # Zod auth schemas
│   ├── services/
│   │   ├── admin.service.ts    # Admin API calls
│   │   ├── booking.service.ts  # Booking API calls
│   │   ├── tutor.service.ts    # Tutor API calls
│   │   ├── user.service.ts     # User API calls
│   │   └── getAvailability.service.ts
│   └── types/
│       └── index.ts            # Global TypeScript types
├── public/
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API base URL
NEXT_PUBLIC_BACKEND_URL=https://skill-bridge-server-tau.vercel.app

# Frontend URL (used in auth redirects)
FRONTEND_URL=http://localhost:3000

# Full API URL
API_URL=https://skill-bridge-server-tau.vercel.app/api

# Auth base URL (matches backend)
AUTH_URL=https://skill-bridge-server-tau.vercel.app

# Cloudinary credentials (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or yarn / pnpm / bun)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/skill-bridge-server.git
   cd skill-bridge-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your values in .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the codebase |

---

## 🏗️ Architecture Overview

SkillBridge follows the **Next.js App Router** architecture with route groups to cleanly separate concerns:

```
Route Groups:
  (commonLayout)   →  Public pages (Navbar + Footer)
  (dashboard)      →  Student portal (protected)
  (tutor)          →  Tutor portal (protected)
  (adminLayout)    →  Admin panel (protected, ADMIN role only)
```

### Middleware Protection

The custom `proxy.ts` middleware guards all protected routes:
- Unauthenticated users → redirect to `/login`
- Admin users → redirect to `/admin-dashboard`
- Non-admin accessing `/admin-dashboard` → redirect to `/dashboard`

### Data Flow

```
Component
  └── TanStack Query (useQuery / useMutation)
        └── Service function (src/services/*.ts)
              └── fetch() / Axios
                    └── Backend REST API (https://skill-bridge-server-tau.vercel.app)
```

---

## 📦 Key Dependencies

```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "typescript": "^5",
  "tailwindcss": "^4",
  "better-auth": "^1.4.18",
  "@tanstack/react-query": "^5.90.20",
  "react-hook-form": "^7.71.1",
  "zod": "^4.3.6",
  "framer-motion": "^12.34.3",
  "recharts": "^3.7.0",
  "cloudinary": "^2.9.0",
  "date-fns": "^4.1.0",
  "sonner": "^2.0.7",
  "lucide-react": "^0.563.0",
  "next-themes": "^0.4.6"
}
```

---

## 🎨 UI Component Library

Built with **shadcn/ui** and **Radix UI** primitives. Components used across the platform:

`Accordion` · `AlertDialog` · `Avatar` · `Badge` · `Button` · `Calendar` · `Card` · `Command` · `Dialog` · `DropdownMenu` · `Form` · `Input` · `Label` · `NavigationMenu` · `Pagination` · `Popover` · `Select` · `Separator` · `Sheet` · `Skeleton` · `Slider` · `Sonner` · `Table` · `Textarea` · `Tooltip`

---

## 🌙 Theming

SkillBridge supports **Light**, **Dark**, and **System** modes via `next-themes`. The theme toggle is accessible from the Navbar on every page.

---

## 🔒 Authentication

Authentication is powered by **better-auth** connecting to the backend API:

- Session-based auth with cookie credentials
- Role field on user: `STUDENT` | `TUTOR` | `ADMIN`
- Protected routes enforced by Next.js middleware
- Auth client configured at `src/lib/auth-client.ts`

---

## ☁️ Deployment

The frontend is deployed on **Vercel** for zero-config Next.js hosting.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/skill-bridge-server)

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add all `.env.local` variables to Vercel's Environment Variables
4. Deploy — Vercel handles the rest

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ by Mehedi Hasan Akash

[Live Demo](https://skill-bridge-client-1h8j.vercel.app) · [Report Bug](https://github.com/your-username/skill-bridge-server/issues) · [Request Feature](https://github.com/your-username/skill-bridge-server/issues)

</div>
