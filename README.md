# Gift List

Your personal gift management assistant. Keep track of gifts, budgets, and make every occasion special.

## Core Features

- **Groups**: Create and manage gift groups for different occasions
- **Gift Tracking**: Track gifts with status (planned/purchased/delivered)
- **Budget Management**: Set and monitor budgets for groups/individuals
- **Analytics**: Insights into gift-giving patterns and spending

## Tech Stack

### Core
- Next.js 15.0.3 (App Router)
- React 18.2
- TypeScript 5
- Tailwind CSS 3.4.1

### State & Forms
- React Hook Form 7.5
- Zod Schema Validation
- Custom React Hooks

### UI & Visualization
- Framer Motion 11
- Nivo Charts (@nivo/bar, @nivo/pie, @nivo/line)
- Lucide Icons
- Christmas Light/ Dark theme

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics dashboard
│   ├── gifts/            # Gift management
│   └── groups/           # Group & member management
├── components/
│   ├── analytics/        # Chart components
│   ├── gifts/           # Gift-related components
│   ├── groups/          # Group components
│   ├── members/         # Member components
│   └── ui/              # Shared UI components
├── hooks/                # Custom React hooks
├── services/            # API services
└── types/               # TypeScript definitions
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Format code
npm run format
```

## License

MIT
