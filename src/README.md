# Project Structure

This document outlines the organized folder structure of the application.

## Directory Overview

```
src/
├── pages/              # All page components
│   ├── auth/          # Authentication pages
│   │   ├── AuthCard.tsx
│   │   ├── LoginCard.tsx
│   │   └── ForgotPasswordCard.tsx
│   ├── dashboard/     # Dashboard-related pages
│   │   ├── Dashboard.tsx
│   │   ├── DashboardHome.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── NewReviewPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── ReviewResultsPage.tsx
│   ├── landing/       # Landing page and its components
│   │   ├── LandingPage.tsx
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── TrustedBy.tsx
│   │   ├── Features.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Pricing.tsx
│   │   └── Footer.tsx
│   └── BillingPage.tsx
├── components/        # Reusable UI components
│   └── ui/           # UI-specific components
│       ├── LeftSection.tsx
│       ├── LightRays.tsx
│       └── StarBorder.tsx
├── layouts/          # Layout components
│   └── AuthLayout.tsx
├── assets/           # Static assets (images, fonts, etc.)
├── App.tsx           # Main application component with routing
├── App.css           # Application styles
├── main.tsx          # Application entry point
└── index.css         # Global styles

```

## Folder Descriptions

### `/pages`
Contains all page-level components that represent different routes in the application.

- **`/auth`**: Authentication-related pages (login, signup, forgot password)
- **`/dashboard`**: Dashboard and its sub-pages (profile, history, reviews, etc.)
- **`/landing`**: Landing page and all its sections (hero, features, pricing, etc.)

### `/components`
Contains reusable UI components that can be used across different pages.

- **`/ui`**: Generic UI components like animations, decorative elements, etc.

### `/layouts`
Contains layout wrapper components that provide consistent structure across pages.

- **`AuthLayout.tsx`**: Layout wrapper for authentication pages

## Import Examples

### Importing a page component:
```tsx
import LandingPage from "./pages/landing/LandingPage";
import Dashboard from "./pages/dashboard/Dashboard";
import LoginCard from "./pages/auth/LoginCard";
```

### Importing a UI component:
```tsx
import LightRays from "../../components/ui/LightRays";
import LeftSection from "../components/ui/LeftSection";
```

### Importing a layout:
```tsx
import AuthLayout from "./layouts/AuthLayout";
```

## Benefits of This Structure

1. **Clear Separation**: Pages, components, and layouts are clearly separated
2. **Scalability**: Easy to add new pages or components in their respective folders
3. **Maintainability**: Related files are grouped together
4. **Discoverability**: Developers can quickly find what they're looking for
5. **Reusability**: UI components can be easily shared across pages
