# Safari Lodge Booking Platform

A real-time booking platform for African safari lodges, starting with Victoria Falls. This platform allows lodges to manage their room availability efficiently.

## Features

- Lodge authentication system
- Dashboard for availability overview
- Room availability management
- Calendar and list views
- Mobile-first design

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS
- React Query
- React Router
- React Hook Form
- React Calendar

### Backend
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT Authentication

## Project Structure

```
.
├── frontend/          # React frontend application
└── backend/          # Node.js backend application
```

## Setup Instructions

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/safari_booking"
JWT_SECRET="your-secret-key"
PORT=3000
```

## Development

1. Clone the repository
2. Set up environment variables
3. Install dependencies for both frontend and backend
4. Start both servers in development mode

## License

MIT 