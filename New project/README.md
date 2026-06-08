# CLEAN CODE CHECKER

A production-ready Next.js web application that checks uploaded Java source files and returns structured JSON with scores, security findings, performance recommendations, bug risks, maintainability notes, SOLID/design concerns, complexity analysis, and refactoring suggestions.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- Framer Motion
- Lucide React Icons
- Firebase Authentication
- OpenAI SDK
- Next.js API Routes
- Vercel compatible

## Features

- Dark premium SaaS UI
- Landing page with hero, feature cards, login link, and payment link
- Google login page powered by Firebase Authentication
- Payment page with starter, pro, and team package layout
- Dedicated analyzer page
- Drag-and-drop `.java` upload
- Client and server file validation
- 5MB maximum upload size
- Java code viewer with syntax highlighting and line numbers
- OpenAI structured JSON analysis
- Overall, quality, security, performance, and maintainability scores
- Expandable reports for summary, security, performance, bugs, quality, suggestions, and complexity
- Copy results, download PDF report, export JSON, and clear analysis

## OpenAI Setup

Create a `.env.local` file in the project root:

```bash
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-5.5
```

`OPENAI_MODEL` is optional. The app defaults to `gpt-5.5`, based on OpenAI's current production model guidance. You can override it with another OpenAI GPT model available to your account.

## Firebase Google Login Setup

1. Open [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Go to **Build > Authentication > Sign-in method**.
3. Enable **Google** as a sign-in provider and save it.
4. Go to **Project settings > General > Your apps**.
5. Add a new **Web app** if one does not exist yet.
6. Copy the Firebase config values into `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
```

7. Still in Firebase Authentication, open **Settings > Authorized domains**.
8. Make sure `localhost` is allowed for development.
9. Restart the development server after changing `.env.local`.

Open `/login` and click **Continue with Google**.

## Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run typecheck
npm run build
npm start
```

## Deployment To Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add environment variables in Vercel Project Settings:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` optional
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
4. Deploy.

The project uses Next.js API Routes and is compatible with Vercel's Node.js runtime.

## API

`POST /api/analyze`

Request:

```json
{
  "filename": "Example.java",
  "code": "public class Example { }"
}
```

Response:

```json
{
  "ok": true,
  "model": "gpt-5.5",
  "analysis": {
    "overallScore": 85,
    "qualityScore": 90,
    "securityScore": 80,
    "performanceScore": 82,
    "maintainabilityScore": 88,
    "issues": [
      {
        "severity": "High",
        "line": 42,
        "title": "Potential NullPointerException",
        "description": "Object may be null before usage.",
        "category": "Bug"
      }
    ],
    "suggestions": ["Use try-with-resources."],
    "complexity": {
      "estimatedLevel": "Medium",
      "notes": "Contains nested loops."
    },
    "summary": "Overall code quality is good but contains maintainability concerns."
  }
}
```
