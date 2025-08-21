# PM Agent - AI Project Management Assistant

A modern React application for managing projects with an AI assistant to help track progress, analyze weekly updates, and generate solution documents.

## Features

- AI-powered project management assistant
- Real-time chat interface
- Weekly update generation
- Solution document templates
- Firebase authentication (Email/Password and Google)
- Modern dark UI theme

## Tech Stack

- React 18+
- TypeScript
- Vite
- Firebase (Authentication, Firestore, Storage)
- React Router
- Material UI

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pm-agent.git
cd pm-agent
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```
# API Configuration
VITE_API_BASE_URL= "

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Firebase Configuration
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── assets/        # Static assets like images and icons
├── components/    # Reusable UI components
├── config/        # Configuration files
├── contexts/      # React contexts
├── pages/         # Application pages/screens
└── utils/         # Utility functions
```

## Usage

### Authentication

The app supports both email/password and Google authentication via Firebase.

### AI Assistant

The AI assistant can help with:
- Tracking project progress
- Analyzing weekly updates
- Creating solution documents
- Managing tasks and milestones

### Templates

Use the quick action buttons to generate:
- Weekly project update templates
- Solution documentation templates

## License

This project is licensed under the MIT License - see the LICENSE file for details.
