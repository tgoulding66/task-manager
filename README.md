# 🚀 TaskManager Pro - Modern MERN Stack Application

A completely rewritten, modern task management application built with the latest technologies and best practices. This version includes TypeScript, React Query, Tailwind CSS, comprehensive security, and a beautiful dark/light theme.

## ✨ Key Improvements Over Previous Version

### 🎨 Frontend Enhancements
- **TypeScript** - Full type safety and better developer experience
- **React Query (TanStack Query)** - Powerful data fetching, caching, and synchronization
- **Tailwind CSS** - Modern, utility-first CSS framework for beautiful UI
- **Zustand** - Lightweight state management for authentication and theme
- **React Hook Form + Zod** - Robust form handling with validation
- **Error Boundaries** - Graceful error handling and recovery
- **Theme System** - Dark/light mode with system preference detection
- **Modern Icons** - Lucide React icons for consistent design
- **Responsive Design** - Mobile-first approach with excellent UX

### 🔧 Backend Improvements
- **Enhanced Security** - Helmet, rate limiting, CORS, input sanitization
- **Input Validation** - Comprehensive Joi validation schemas
- **Error Handling** - Centralized error handling with proper logging
- **Middleware Stack** - Compression, logging, security headers
- **API Documentation** - Structured endpoints with health checks
- **Rate Limiting** - Protection against abuse and DDoS

### 🏗️ Architecture Improvements
- **Modular Structure** - Better separation of concerns
- **Path Aliases** - Clean imports with TypeScript path mapping
- **Docker Support** - Complete containerization for development and production
- **Environment Management** - Proper configuration management
- **Testing Setup** - Jest and testing utilities configured
- **ESLint Configuration** - Code quality and consistency

---

## 🧱 Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Lightning-fast build tool with HMR
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management and caching
- **React Router 7** - Client-side routing
- **React Hook Form** - Performant forms with validation
- **Zustand** - Lightweight state management
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icon set

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Joi** - Input validation
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container development
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (or use Docker)
- Git

### Option 1: Local Development

```bash
# Clone the repository
git clone <repository-url>
cd task-manager-pro

# Install dependencies for all services
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start development servers
npm run dev
```

### Option 2: Docker Development

```bash
# Clone the repository
git clone <repository-url>
cd task-manager-pro

# Start all services with Docker
npm run docker:dev
```

---

## 📁 Project Structure

```
task-manager-pro/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── api/             # API client and endpoints
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Main app component
│   ├── public/              # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/                 # Node.js Express API
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── tests/               # Test files
│   ├── app.js               # Express app configuration
│   ├── index.js             # Server entry point
│   └── package.json
│
├── docker-compose.dev.yml   # Development Docker setup
├── docker-compose.yml       # Production Docker setup
├── package.json             # Root package.json
└── README.md
```

---

## 🔧 Environment Configuration

### Backend (.env)
```bash
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000/api
```

---

## 🌟 Features

### 🔐 Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- CORS protection
- Input sanitization
- Security headers with Helmet

### 📋 Project Management
- Create, read, update, delete projects
- Project descriptions and due dates
- Project statistics and progress tracking
- Real-time updates with React Query

### ✅ Task Management
- Full CRUD operations for tasks
- Task status: To Do, In Progress, Done
- Priority levels: Low, Medium, High
- Task types: New Feature, Enhancement, Bug
- Point estimation system
- Due dates and notes
- Nested subtasks with completion tracking

### 🎨 User Experience
- **Dark/Light Mode** - Automatic system preference detection
- **Responsive Design** - Works perfectly on all devices
- **Real-time Updates** - Optimistic updates with React Query
- **Form Validation** - Comprehensive client and server validation
- **Error Handling** - Graceful error states with recovery options
- **Loading States** - Smooth loading indicators
- **Toast Notifications** - User feedback for all actions

### 🔍 Advanced Features
- **Search & Filter** - Find tasks by various criteria
- **Sorting** - Sort tasks by date, priority, status
- **Statistics** - Project and task completion insights
- **Drag & Drop** - Reorder tasks (planned)
- **Keyboard Shortcuts** - Power user features (planned)

---

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/users/register     # Register new user
POST /api/users/login        # Login user
GET  /api/users/profile      # Get user profile
PUT  /api/users/profile      # Update user profile
```

### Project Endpoints
```
GET    /api/projects              # Get all projects
POST   /api/projects              # Create project
GET    /api/projects/:id          # Get single project
PUT    /api/projects/:id          # Update project
DELETE /api/projects/:id          # Delete project
GET    /api/projects/:id/stats    # Get project statistics
```

### Task Endpoints
```
GET    /api/projects/:id/tasks    # Get project tasks
POST   /api/tasks                 # Create task
GET    /api/tasks/:id             # Get single task
PUT    /api/tasks/:id             # Update task
DELETE /api/tasks/:id             # Delete task
PATCH  /api/tasks/:id/status      # Update task status
PATCH  /api/tasks/:id/priority    # Update task priority
```

---

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests  
cd frontend && npm test

# Run tests with coverage
npm run test:coverage
```

---

## 🚢 Deployment

### Production Build
```bash
# Build frontend
cd frontend && npm run build

# Start production server
cd backend && npm start
```

### Docker Production
```bash
# Build and start production containers
npm run docker:prod
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- React team for the amazing framework
- TanStack for React Query
- Tailwind CSS for the beautiful design system
- The open source community for all the fantastic tools

---

## 📞 Support

If you have any questions or need help, please open an issue or contact the maintainers.

**Happy task managing! 🎉**
