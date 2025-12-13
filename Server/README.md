# Server Backend

Production-ready Node.js + Express backend with JWT authentication, email verification, and background job processing.

## Features

- 🔐 JWT Authentication with HTTP-only cookies
- 📧 Email OTP verification (Brevo API)
- 🔄 Background job processing with BullMQ
- 🚦 Redis-backed rate limiting
- 📝 Winston + Morgan logging with daily rotation
- 📚 Swagger API documentation
- 🛡️ Security features (account blocking, rate limiting)
- 🗃️ MongoDB with Mongoose

## Quick Start

### Install Dependencies
```bash
yarn install
# or
npm install
```

### Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Run Development Server
```bash
yarn dev
# Server starts at http://localhost:5000
```

### Run Email Worker (Separate Terminal)
```bash
yarn dev:worker
# Worker processes email jobs from queue
```

### Run Both Together
```bash
yarn dev:all
# Runs server + worker concurrently
```

## Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn start` - Start production server
- `yarn worker` - Start email worker
- `yarn dev:worker` - Start worker with hot reload
- `yarn dev:all` - Run server + worker together

## API Documentation

Once running, visit: http://localhost:5000/api/docs

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── lib/           # Database & Redis connections
├── middlewares/   # Custom middlewares
├── models/        # Mongoose models
├── queues/        # BullMQ queues
├── routers/       # Express routes
├── services/      # Business logic
├── util/          # Utilities & validation
├── workers/       # Background workers
├── app.js         # Express app
└── server.js      # Entry point
```

## Environment Variables

See `.env.example` for required environment variables.

## Dependencies

Key packages:
- Express 5.x
- MongoDB/Mongoose
- Redis/IORedis
- BullMQ
- JWT
- Winston/Morgan
- Swagger
- Bcrypt
- Joi

## License

ISC
