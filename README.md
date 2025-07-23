Next.js Blog App :Inkly
This is a Next.js project built with TypeScript, featuring authentication, protected routes, and persistent Redux state. It uses Prisma for database access and JWT for authentication.

Features
Next.js App Router
TypeScript
Redux Toolkit & redux-persist (with encryption)
JWT authentication
Prisma ORM (PostgreSQL)
Protected routes (middleware)
Responsive UI with Tailwind CSS

Getting Started
1. Clone the repository
```
git clone https://github.com/Hussen-ghadban/Inkly.git
cd your-repo-name
```
2. Install dependencies
```
npm install
# or
yarn install
```

3. Set up environment variables
Create a .env file in the root directory and add:

```
DATABASE_URL="your_postgres_connection_string"
JWT_SECRET="your_jwt_secret"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_PERSIST_SECRET="your_persist_secret_here"
```

DATABASE_URL: Your PostgreSQL connection string (used by Prisma).
JWT_SECRET: Secret key for JWT authentication.
NEXT_PUBLIC_API_URL: Base URL for API requests.
NEXT_PUBLIC_PERSIST_SECRET: Secret for encrypting persisted Redux state.

4. Run the development server
```
npm run dev
# or
yarn dev
```

Open http://localhost:3000 in your browser to view the app.

Database Setup
This project uses Prisma. After setting your DATABASE_URL, run:
```
npx prisma generate
npx prisma migrate dev
```
License
MIT