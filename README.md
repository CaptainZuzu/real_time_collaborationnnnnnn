# Real-Time Collaboration App

A modern React application for real-time document collaboration built with Vite, React, and TypeScript.

## Features

- User Authentication (Login/Register)
- Real-time Document Collaboration
- Modern UI with Bootstrap
- Responsive Design

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open in browser:
- Local: http://localhost:5173
- Network: Check terminal output for network URL

## Project Structure

```
real_time_collab/
├── src/
│   ├── components/     # Reusable components
│   │   └── Navbar.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── App.tsx        # Main App component
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
```

## Opening in VS Code

1. Open VS Code
2. Go to File -> Open Folder
3. Navigate to the `real_time_collab` directory
4. Click "Open"

Or from terminal:
```bash
code .
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build 