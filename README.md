# MERN Auth Starter Template

A production-ready MERN stack authentication starter template with modern features including JWT authentication, email verification, rate limiting, logging, and background job processing.

## ✨ Features

### Backend (Node.js + Express)
- 🔐 **JWT Authentication** with HTTP-only cookies
- 📧 **Email OTP Verification** via Brevo (SendinBlue)
- 🔄 **Background Jobs** with BullMQ and Redis
- 🚦 **Rate Limiting** (Redis-backed) for API protection
- 📝 **Winston Logger** with Morgan HTTP logging and daily log rotation
- 📚 **Swagger API Documentation** at `/api/docs`
- 🛡️ **Security Features**:
  - Account blocking after 5 failed login attempts
  - Email rate limiting (5 emails per 30-minute window)
  - OTP expiration (10 minutes)
  - Password validation with Joi
- 🗃️ **MongoDB** with Mongoose ODM
- ⚡ **Production-ready folder structure**

### Frontend (React + Vite)
- ⚛️ **React 19** with Vite
- 🎨 **Tailwind CSS v4** for styling
- 🗂️ **Zustand** state management with persist middleware
- 🔄 **React Router v7** for navigation
- 🎯 **Protected Routes** with authentication
- 🍞 **React Hot Toast** for notifications
- 📱 **Responsive UI** components

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | Server framework |
| MongoDB + Mongoose | Database |
| Redis + IORedis | Caching & queue storage |
| BullMQ | Background job processing |
| JWT | Token-based authentication |
| Brevo API | Email service |
| Winston + Morgan | Logging |
| Express Rate Limit | API rate limiting |
| Swagger | API documentation |
| Joi | Request validation |
| Bcrypt | Password hashing |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| Vite | Build tool |
| Zustand | State management |
| React Router | Routing |
| Tailwind CSS v4 | Styling |
| Axios | HTTP client |
| React Hot Toast | Notifications |

## 📁 Project Structure

```
MERN-Auth-Zustand-Redis/
├── Server/                      # Backend application
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   │   ├── index.js        # Queue configuration
│   │   │   ├── logger.js       # Winston + Morgan setup
│   │   │   ├── rateLimiting.js # Rate limit config
│   │   │   └── swagger.js      # Swagger setup
│   │   ├── controllers/        # Route controllers
│   │   │   └── authController.js
│   │   ├── lib/                # Libraries
│   │   │   ├── db.js          # MongoDB connection
│   │   │   └── redis.js       # Redis connection
│   │   ├── middlewares/        # Custom middlewares
│   │   │   ├── auth.js        # JWT verification
│   │   │   └── validate.js    # Joi validation
│   │   ├── models/            # Mongoose models
│   │   │   └── user.model.js
│   │   ├── queues/            # BullMQ queues
│   │   │   └── index.js       # Email queue
│   │   ├── routers/           # Express routes
│   │   │   └── authRouter.js
│   │   ├── services/          # Business logic
│   │   │   └── emailService.js
│   │   ├── util/              # Utilities
│   │   │   ├── dotenv.js      # Environment config
│   │   │   ├── generateToken.js
│   │   │   ├── templates/     # Email templates
│   │   │   └── validation/    # Joi schemas
│   │   ├── workers/           # Background workers
│   │   │   └── emailWorker.js
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── logs/                  # Winston logs
│   ├── .env                   # Environment variables
│   └── package.json
│
└── client/                    # Frontend application
    ├── src/
    │   ├── components/        # React components
    │   │   └── ProtectedRoute.jsx
    │   ├── hooks/            # Custom hooks
    │   │   └── useToast.jsx
    │   ├── lib/              # Libraries
    │   │   └── config/
    │   │       └── axios.js  # Axios config
    │   ├── pages/            # Page components
    │   │   ├── auth/         # Auth pages
    │   │   │   ├── Login.jsx
    │   │   │   ├── Signup.jsx
    │   │   │   ├── VerifyOTP.jsx
    │   │   │   ├── ForgotPassword.jsx
    │   │   │   ├── ResetPassword.jsx
    │   │   │   └── VerifyResetOTP.jsx
    │   │   └── client/       # Protected pages
    │   │       └── Dashboard.jsx
    │   ├── services/         # API services
    │   │   └── authService.js
    │   ├── store/            # Zustand stores
    │   │   └── useAuthStore.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── index.html
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **MongoDB** (local or MongoDB Atlas)
- **Redis** (local or Redis Cloud)
- **Yarn** or **npm** package manager

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd MERN-Auth-Zustand-Redis
```

#### 2. Backend Setup

```bash
cd Server

# Install dependencies
yarn install
# or
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database
MONGO_URI=mongodb://localhost:27017/mern-auth-redis

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Redis (default local Redis)
REDIS_URL=redis://localhost:6379

# Email Service (Brevo/SendinBlue)
EMAIL_USER=your-brevo-smtp-login
EMAIL_FROM=your-verified-sender-email@example.com
BREVO_API_KEY=your-brevo-api-key
```

#### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
yarn install
# or
npm install
```

### Environment Variables Explained

#### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/mern-auth` |
| `JWT_SECRET` | Secret key for JWT signing | Generate with `openssl rand -hex 32` |
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `EMAIL_USER` | Brevo SMTP username | From Brevo dashboard |
| `EMAIL_FROM` | Sender email (must be verified) | `noreply@yourdomain.com` |
| `BREVO_API_KEY` | Brevo API key | From Brevo dashboard |

**Getting Brevo API Key:**
1. Sign up at [Brevo](https://www.brevo.com/)
2. Navigate to **Settings** → **API Keys**
3. Create a new API key
4. Verify your sender email in **Senders** section

## 🎯 Running the Application

### Development Mode

You need **3 separate terminals** for full functionality:

#### Terminal 1: Backend Server
```bash
cd Server
yarn dev
# or
npm run dev
```
Server runs at: `http://localhost:5000`

#### Terminal 2: Email Worker (Background Jobs)
```bash
cd Server
yarn dev:worker
# or
npm run dev:worker
```

#### Terminal 3: Frontend
```bash
cd client
yarn dev
# or
npm run dev
```
Frontend runs at: `http://localhost:5173`

### Alternative: Run Backend + Worker Together
```bash
cd Server
yarn dev:all
# or
npm run dev:all
```
*(Note: You'll need to install `concurrently` first: `yarn add -D concurrently`)*

### Production Mode

#### Backend
```bash
cd Server
yarn start
# or
npm start

# In separate terminal
yarn worker
# or
npm run worker
```

#### Frontend
```bash
cd client
yarn build
yarn preview
```

## 📚 API Documentation

Once the server is running, visit the Swagger documentation:
```
http://localhost:5000/api/docs
```

### API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/verify-otp` | Verify email OTP | ❌ |
| POST | `/api/auth/resend-otp` | Resend verification OTP | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |
| GET | `/api/auth/profile` | Get user profile | ✅ |
| POST | `/api/auth/reset-password` | Request password reset | ❌ |
| POST | `/api/auth/update-password` | Update password | ❌ |
| GET | `/api/health` | Health check | ❌ |

## 🔐 Authentication Flow

### Registration Flow
1. User submits registration form
2. Server validates input with Joi
3. Creates user in MongoDB (unverified)
4. Generates 6-digit OTP (10-minute expiry)
5. Adds email job to BullMQ queue
6. Worker processes job and sends email via Brevo
7. User receives OTP email
8. User submits OTP for verification
9. Account becomes verified

### Login Flow
1. User submits credentials
2. Server validates user and password
3. Checks if email is verified
4. Generates JWT token
5. Sets HTTP-only cookie
6. Returns user data and access token

### Password Reset Flow
1. User requests password reset
2. Server sends OTP to email
3. User verifies OTP
4. User submits new password
5. Password is updated (bcrypt hashed)

## 🛡️ Security Features

### Rate Limiting
- **Global**: 100 requests/minute per IP
- **Auth Routes**: 10 requests/minute per IP
- **Email Sending**: 5 emails per 30-minute window per user

### Account Protection
- Failed login attempts tracked
- Account blocked after 5 failed attempts
- OTP expires after 10 minutes
- Passwords hashed with bcrypt (10 salt rounds)

### Password Requirements
- Minimum 6 characters
- Must contain:
  - Uppercase letter
  - Lowercase letter
  - Number
  - Special character (@$!%*?&)

## 📝 Logging

### Winston Logger Features
- **Console**: Colorized output
- **File Logging**:
  - `logs/error.log` - Error level only
  - `logs/combined-YYYY-MM-DD.log` - All levels (rotates daily)
- **Log Rotation**: Keeps 15 days of logs
- **Compression**: Old logs are gzipped

### Morgan HTTP Logging
Logs include:
- Client IP (proxy-aware)
- HTTP method and URL
- Status code
- Response time
- Request body (passwords redacted)

## 🗄️ Database Models

### User Model
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  isVerified: Boolean (default: false),
  loginAttempts: Number (default: 0),
  isBlocked: Boolean (default: false),
  otp: String,
  otpExpiry: Date,
  emailRateLimit: {
    count: Number,
    windowStart: Date,
    resetAfterMinutes: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Troubleshooting

### Common Issues

#### Redis Connection Error
```bash
# Make sure Redis is running
redis-cli ping
# Should return: PONG

# Start Redis (Linux/Mac)
redis-server

# Start Redis (Windows)
# Download from: https://github.com/tporadowski/redis/releases
```

#### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh
# or
mongo

# Start MongoDB (Linux/Mac)
mongod

# MongoDB Atlas (cloud)
# Use connection string from Atlas dashboard
```

#### Email Worker Not Processing Jobs
- Ensure Redis is running
- Check worker logs for errors
- Verify Brevo API key is correct
- Check email sender is verified in Brevo

#### CORS Errors
- Verify `CLIENT_URL` in `.env` matches frontend URL
- Check browser console for specific CORS error

## 📦 Building for Production

### Backend
```bash
cd Server
yarn start
```

### Frontend
```bash
cd client
yarn build

# Output in dist/ folder
# Serve with any static file server or:
yarn preview
```

### Docker Deployment
Both `Server` and `client` directories include Dockerfiles for containerization.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)
- [BullMQ](https://docs.bullmq.io/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review Swagger API docs at `/api/docs`

---

**Built with ❤️ for the developer community**
