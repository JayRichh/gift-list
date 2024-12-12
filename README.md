# Gift List

![image](https://github.com/user-attachments/assets/3a2a9751-db31-46e1-ac74-1571d66c400a)

## Core Features

- **Groups**: Create and manage gift groups for different occasions
- **Gift Tracking**: Track gifts with status (planned/purchased/delivered)
- **Budget Management**: Set and monitor budgets for groups/individuals
- **Analytics**: Insights into gift-giving patterns and spending
- **CSV Import**: Support for importing gift data from various CSV formats with field mapping
- **Authentication**: Secure user authentication for multiple device data sync
- **Storage**: Persistent data storage with Supabase

## Tech Stack

### Core
- Next.js 15.0.3 (App Router)
- React 18.2
- TypeScript 5
- Tailwind CSS 3.4.1
- Turbopack (Development)

### Database & Auth
- Supabase
- PostgreSQL
- Row Level Security

### State & Forms
- React Hook Form 7.5
- Zod Schema Validation
- Custom React Hooks

### UI & Visualization
- Framer Motion 11
- Nivo Charts (@nivo/bar, @nivo/pie, @nivo/line)
- Lucide Icons
- Christmas theme vibe

![image](https://github.com/user-attachments/assets/bdfeebc4-8566-4cb0-9b49-863aaf889b50)

![image](https://github.com/user-attachments/assets/ebc42477-35b3-4632-8fb8-75a4f770fab4)

![image](https://github.com/user-attachments/assets/d40135c1-610e-4668-831c-8cb453947d6d)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics dashboard
│   ├── auth/             # Authentication pages
│   ├── gifts/            # Gift management
│   └── groups/           # Group & member management
├── components/
│   ├── analytics/        # Chart components
│   ├── auth/            # Authentication components
│   ├── gifts/           # Gift-related components
│   ├── groups/          # Group components
│   ├── members/         # Member components
│   └── ui/              # Shared UI components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                 # Library configurations
│   └── supabase/        # Supabase client & types
├── services/            # API services
└── types/               # TypeScript definitions
```

## Development

```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Format code
npm run format
```

## License

MIT
