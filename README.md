# Next.js Three.js Tailwind Template

A modern, full-featured template for rapidly building web applications. Pre-configured with TypeScript, Three.js, Tailwind CSS, and more to eliminate boilerplate setup and get coding faster.


![image](https://github.com/user-attachments/assets/e912b63c-4ff3-497c-b90a-24c6766cb0e4)
![image](https://github.com/user-attachments/assets/717960fe-6811-4621-9f3b-e9201c2f840a)


## Core Technologies

- Next.js 15.0.3 (App Router)
- TypeScript 5
- Three.js 0.170.0 + React Three Fiber 8
- Tailwind CSS 3.4.1
- Framer Motion 11

![image](https://github.com/user-attachments/assets/4e86010d-f88a-4e43-a388-ec54746f8fd0)

## Setup

```bash
git clone https://github.com/JayRichh/next-template
cd next-template
npm install
npm run dev
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── examples/          # Example implementations
│   │   ├── 3d/           # Three.js examples
│   │   ├── ui/           # UI component examples
│   │   └── theme/        # Theme examples
│   ├── three/            # Three.js setup
│   └── api/              # API routes
├── components/
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── services/             # API services
├── types/                # TypeScript definitions
└── utils/               # Utility functions
```

![image](https://github.com/user-attachments/assets/3acd0a7e-3415-4b07-a16d-e8522874879a)

## Features

### UI Components

- Form elements with validation (react-hook-form + zod)
- Data display (Badge, Card, Tooltip)
- Layout (Accordion, Modal, Tabs)
- Feedback (Progress, Spinner, Toast)
- Effects (Gradient backgrounds, animations)

### Three.js Integration

- Scene management with React Three Fiber
- Physics integration (Rapier3D)
- Material showcases
- Interactive examples
- Morph animations

### Development Tools

- TypeScript configuration
- ESLint with strict rules
- Prettier with import sorting
- Hot module replacement
- Monaco code editor integration

![image](https://github.com/user-attachments/assets/eb1375a2-0654-4c88-bcfd-2460cdb01e56)

## Configuration

### Next.js

- Configured for Three.js integration
- App Router setup
- API routes enabled
- Strict mode enabled
- Webpack optimizations for canvas

### Tailwind CSS

- Custom color schemes with HSL variables
- Dark mode support
- Geist font integration
- Custom animations
- Gradient utilities
- Container queries

### TypeScript

- Strict type checking
- Path aliases configured
- Type definitions for Three.js
- Custom type utilities

## Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run format       # Prettier formatting
```

## License

MIT
