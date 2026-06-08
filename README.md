# Keep My Plans

Keep My Plans is a web application built using React, Vite, and Firebase. It allows users to collaboratively manage a queue of items to watch/listen to and organize events (meetings/trips).

## Features

- **Anonymous Authentication:** Users can interact anonymously.
- **Group Management:** Create or join groups via a 6-character code.
- **Queue View:** Add items, leave reviews (with a 5-star rating system), and track watch status.
- **Events View:** Plan upcoming events and view past ones, utilizing native Polish date formatting.
- **PWA Ready:** Installable as a Progressive Web Application.
- **Accessibility:** Semantic HTML, ARIA attributes, and accessible color contrasts.

## Tech Stack

- React 19
- Vite
- Firebase (Firestore & Auth)
- React Router DOM v7
- CSS Modules
- Vitest for Unit Testing

## Prerequisites

- Node.js (v18 or higher recommended)
- A Firebase project with Firestore and Anonymous Authentication enabled.

## Setup

1. **Clone the repository and install dependencies:**

   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Copy the `.env.example` file to `.env` and fill in your Firebase configuration values.

   ```bash
   cp .env.example .env
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

## Testing

To run the unit tests using Vitest:

```bash
npm run test
```

## Deployment

The application is configured to be deployed easily to platforms like Vercel.

**Steps for Vercel:**

1. Connect your repository to Vercel.
2. Ensure you add the Firebase environment variables in your Vercel project settings.
3. Vercel will automatically detect the Vite build settings and the `vercel.json` file for client-side routing.

**Firestore Rules deployment:**
Ensure you deploy the firestore rules to secure the database:

```bash
firebase deploy --only firestore:rules
```

*(Requires `firebase-tools` to be initialized in your project)*
