# Client Frontend

Modern React application built with Vite, Zustand state management, and Tailwind CSS v4.

## Features

- ⚛️ React 19 with Vite
- 🎨 Tailwind CSS v4
- 🗂️ Zustand state management with persist
- 🔄 React Router v7
- 🔐 Protected routes
- 🍞 React Hot Toast notifications
- 📱 Responsive design

## Quick Start

### Install Dependencies
```bash
yarn install
# or
npm install
```

### Run Development Server
```bash
yarn dev
# App starts at http://localhost:5173
```

### Build for Production
```bash
yarn build
# Output in dist/ folder
```

### Preview Production Build
```bash
yarn preview
```

## Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable components
├── hooks/         # Custom React hooks
├── lib/           # Configuration & utilities
├── pages/         # Page components
│   ├── auth/      # Authentication pages
│   └── client/    # Protected pages
├── services/      # API service layer
├── store/         # Zustand stores
├── App.jsx        # Main app component
└── main.jsx       # Entry point
```

## State Management

This app uses Zustand with persist middleware for:
- User authentication state
- Token management
- Persistent login sessions

## Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage
3. Token persisted across sessions
4. Protected routes check authentication
5. Auto-redirect to login if unauthenticated

## API Integration

Backend API URL: `http://localhost:5000`

Configure in: `src/lib/config/axios.js`

## Styling

Using Tailwind CSS v4 with:
- Utility-first approach
- Responsive design
- Custom components

## Dependencies

Key packages:
- React 19
- Vite 7.x
- Zustand
- React Router v7
- Tailwind CSS v4
- Axios
- React Hot Toast
- Lucide React (icons)

## License

ISC
