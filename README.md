# Construction Management Web Application

A comprehensive full-stack web application for managing construction projects, including project tracking, budget management, employee management, task scheduling, inventory management, and expense tracking.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Components](#components)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The Construction Management Application is designed to streamline construction project operations by providing tools for:

- Comprehensive project management and tracking
- Budget planning and expense management
- Employee resource allocation
- Task and timeline management
- Inventory and supply chain management
- Document management and storage
- Real-time reporting and analytics

The application features a modern React frontend with Material-UI components, interactive charts, and a robust Node.js/Express backend with MySQL database.

---

## Features

### 🏗️ Project Management

- Create, read, update, and delete projects
- Track project status (ongoing, pending, completed)
- Manage project timelines and deadlines
- Budget allocation and monitoring
- Project-specific expense tracking
- Employee assignment to projects

### 💰 Financial Management

- Budget planning and comparison
- Expense tracking and categorization
- Budget vs. Expense visualization
- Financial reporting and summaries

### 👥 Employee Management

- Employee registration and profiles
- Role assignment
- Project resource allocation
- Employee tracking and management

### 📋 Task Management

- Create and assign tasks
- Task status tracking (completed, in-progress, pending)
- Task scheduling and timeline
- Task dependencies and relationships

### 📦 Inventory Management

- Inventory item tracking
- Stock level management
- Item categorization
- Supplier integration

### 🏢 Supplier Management

- Supplier database
- Contact information management
- Supply tracking

### 📄 Document Management

- Upload and store project documents
- Cloud storage integration (Cloudinary)
- Document categorization
- File management

### 📊 Dashboard & Analytics

- Project summary overview
- Budget vs. Expense comparison charts
- Task status bar charts
- Project count statistics
- Real-time data visualization

### 🔐 Security & Authentication

- User registration and login
- Password encryption (bcryptjs)
- Session management
- Change password functionality
- Protected routes

---

## Tech Stack

### Frontend

- **Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.0
- **UI Libraries:**
  - Material-UI (MUI) 5.16.7
  - Bootstrap 5.3.3
  - React Bootstrap 2.10.4
- **Charting:**
  - Chart.js 4.4.4
  - React-ChartJS-2 5.2.0
  - Recharts 2.12.7
- **Routing:** React Router DOM 6.26.0
- **HTTP Client:** Axios 1.7.3
- **State Management:** React Context API
- **Icons:** React Icons 5.3.0, Bootstrap Icons 1.11.3
- **Data Table:** React Data Table Component 7.6.2
- **Form Selection:** React Select 5.8.0
- **Pagination:** React Paginate 8.2.0
- **Date Handling:** date-fns 3.6.0
- **Styling:** CSS Modules, Emotion

### Backend

- **Runtime:** Node.js
- **Framework:** Express 4.19.2
- **Database:** MySQL 8.0+
- **Database Driver:** mysql2 3.11.0
- **Authentication:**
  - Passport 0.7.0
  - Passport-Local 1.0.0
  - bcryptjs 3.0.2
- **Session Management:** express-session 1.18.1
- **Security:**
  - Helmet 8.1.0 (HTTP headers security)
  - cors 2.8.5 (CORS middleware)
  - express-rate-limit 7.5.0 (Rate limiting)
- **File Upload:** Multer 1.4.5
- **Cloud Storage:** Cloudinary 2.5.1
- **Utilities:**
  - dotenv 16.4.7 (Environment variables)
  - moment 2.30.1 (Date/time handling)
  - sql-formatter 15.4.0 (SQL formatting)
- **Development:** nodemon 3.1.4 (Auto-reload)

---

## Project Structure

```
CONSTRUCTION App/
├── backend/
│   ├── index.js                 # Main server file
│   ├── package.json            # Backend dependencies
│   ├── .env                    # Environment variables
│   ├── vercel.json            # Vercel deployment config
│   └── uploads/               # File upload directory
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.jsx       # Axios configuration
    │   ├── components/
    │   │   ├── Auth/           # Authentication components
    │   │   ├── Dashboard/      # Dashboard & charts
    │   │   ├── DocumentUploadModal/
    │   │   ├── Employees/      # Employee management
    │   │   ├── Expenses/       # Expense tracking
    │   │   ├── Inventory/      # Inventory management
    │   │   ├── Layout/         # Layout components
    │   │   ├── Projects/       # Project management
    │   │   ├── Suppliers/      # Supplier management
    │   │   ├── Tasks/          # Task management
    │   │   └── projectResources/ # Resource allocation
    │   ├── pages/              # Page components
    │   ├── services/           # API service layers
    │   ├── utils/              # Utility functions
    │   ├── common/             # Shared styling
    │   ├── App.jsx            # Root component
    │   ├── App.css            # Root styles
    │   ├── main.jsx           # Entry point
    │   └── index.html         # HTML template
    ├── package.json           # Frontend dependencies
    ├── vite.config.js         # Vite configuration
    ├── eslint.config.js       # ESLint configuration
    └── vercel.json           # Vercel deployment config
```

---

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **MySQL** (v8.0 or higher) - local installation or remote database
- **Git** (for version control)

### Required Accounts

- **Cloudinary** account (for file storage) - get at [cloudinary.com](https://cloudinary.com)

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "CONSTRUCTION App"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (see Configuration section)
touch .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install
```

---

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=8080

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=construction_management

# Authentication Configuration
SESSION_SECRET=your_generated_secret_key

# Frontend Configuration
FRONTEND_URL=http://localhost:5173

# Environment Mode
NODE_ENV=development

# Cloudinary Configuration (Optional, for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend Environment Variables (if needed)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8080
```

### Database Setup

1. **Create MySQL Database:**

```sql
CREATE DATABASE construction_management;
USE construction_management;
```

2. **Create Tables:**

Import your database schema (tables for users, projects, employees, tasks, expenses, inventory, suppliers, documents, etc.)

3. **Connection Verification:**

Ensure MySQL is running and credentials in `.env` match your database setup.

---

## Running the Application

### Option 1: Run Backend and Frontend Separately

#### Terminal 1 - Backend (Port 8080)

```bash
cd backend
npm start
```

Expected output:

```
Server is running on port 8080
MYSQL connected Successfully
```

#### Terminal 2 - Frontend (Port 5173)

```bash
cd frontend
npm run dev
```

Expected output:

```
Local:   http://localhost:5173/
```

### Option 2: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## API Endpoints

### Authentication

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/status` - Check authentication status
- `POST /auth/change-password` - Change user password

### Projects

- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project details
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `GET /projects/:id/expenses` - Get project expenses
- `GET /projects/:id/employees` - Get project employees
- `GET /completed/projects` - Get completed projects
- `GET /pending/projects` - Get pending projects
- `GET /ongoing/projects` - Get ongoing projects

### Expenses

- `GET /expenses` - Get all expenses
- `GET /expenses/:id` - Get expense details
- `POST /expenses` - Create new expense
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense

### Employees

- `GET /employees` - Get all employees
- `GET /employees/:id` - Get employee details
- `POST /employees` - Create new employee
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

### Tasks

- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get task details
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Inventory

- `GET /inventory` - Get all inventory items
- `GET /inventory/:id` - Get inventory item details
- `POST /inventory` - Create new inventory item
- `PUT /inventory/:id` - Update inventory item
- `DELETE /inventory/:id` - Delete inventory item

### Suppliers

- `GET /suppliers` - Get all suppliers
- `GET /suppliers/:id` - Get supplier details
- `POST /suppliers` - Create new supplier
- `PUT /suppliers/:id` - Update supplier
- `DELETE /suppliers/:id` - Delete supplier

### Documents

- `POST /projects/:projectId/documents` - Upload document
- `GET /projects/:projectId/documents` - Get project documents
- `GET /documents/:id/download` - Download document
- `DELETE /documents/:id` - Delete document

### Dashboard & Analytics

- `GET /project-budget-expenses/:projectId` - Get project budget vs expenses
- `GET /projects-budget-expenses` - Get all projects budget vs expenses
- `GET /projects-task-status` - Get task status summary

---

## Database Schema

The application uses the following main tables:

### Users

- User authentication and profile information
- Email, password (encrypted), role, contact details

### Projects

- Project details and metadata
- Status (ongoing, pending, completed)
- Budget and timeline information

### Employees

- Employee records
- Role, contact information, project assignments

### Tasks

- Task tracking and assignment
- Status (completed, in-progress, pending)
- Deadlines and project association

### Expenses

- Expense records and categorization
- Project association, amount, date

### Inventory

- Stock items and levels
- Supplier association, categories

### Suppliers

- Supplier information and contact details

### Documents

- Document metadata and storage references
- Project association, upload timestamps

---

## Components

### Authentication Components

- **AuthContext.jsx** - Context for authentication state management
- **AuthLayout.jsx** - Layout wrapper for authentication pages
- **ProtectedRoute.jsx** - Route protection for authenticated users
- **ChangePassword.jsx** - Password change functionality
- **Login.jsx** - Login page
- **Signup.jsx** - User registration page

### Dashboard Components

- **ProjectSummery.jsx** - Project overview and statistics
- **ProjectBudgetExpensesChart.jsx** - Budget vs Expense visualization
- **TaskStatusBarChart.jsx** - Task status distribution chart

### Management Components

- **Projects/** - Project CRUD operations and management
- **Employees/** - Employee management and assignments
- **Tasks/** - Task creation and tracking
- **Expenses/** - Expense logging and tracking
- **Inventory/** - Inventory item management
- **Suppliers/** - Supplier information management
- **DocumentUploadModal/** - File upload and management

### Layout Components

- **Navbar.jsx** - Navigation bar
- **Sidebar.jsx** - Side navigation menu
- **Footer.jsx** - Application footer
- **Breadcrumb.jsx** - Breadcrumb navigation
- **TransparentBreadcrumbs.jsx** - Alternative breadcrumb style

### Service Modules

Each feature has a corresponding service module for API communication:

- `employeeService.js`
- `projectService.js`
- `taskService.js`
- `expensesService.js`
- `inventoryServices.js`
- `suppliersServices.js`
- `documentService.js`
- `dashboardServices.js`
- `projectDetails.js`
- `projectResources.js`

---

## Security Features

- **Password Encryption:** bcryptjs for secure password hashing
- **Session Management:** express-session with secure cookie configuration
- **CORS:** Configured to accept requests from frontend only
- **Rate Limiting:** Express rate-limit to prevent abuse
- **Security Headers:** Helmet.js for HTTP security headers
- **Protected Routes:** Authentication middleware on sensitive endpoints
- **File Upload Security:** Multer validation and Cloudinary cloud storage

---

## Performance Optimization

- **Frontend:** Vite for fast development and optimized production builds
- **Lazy Loading:** React components lazy loaded where appropriate
- **API Caching:** Service layer caching for frequently accessed data
- **Database Indexing:** Optimized MySQL queries
- **Image Optimization:** Cloudinary integration for image processing
- **Data Pagination:** Paginated API responses for large datasets

---

## Available Scripts

### Backend

```bash
# Start development server with auto-reload
npm start

# Run tests (when configured)
npm test
```

### Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Troubleshooting

### Database Connection Issues

- Verify MySQL is running: `mysql -u root -p`
- Check `.env` file database credentials
- Ensure database `construction_management` exists

### Frontend Not Connecting to Backend

- Verify backend is running on port 8080
- Check `FRONTEND_URL` in backend `.env`
- Check browser console for CORS errors

### Port Already in Use

```bash
# Kill process on port 8080 (backend)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Kill process on port 5173 (frontend)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

---

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Vercel/Heroku)

1. Configure `vercel.json` for backend
2. Set environment variables on platform
3. Deploy using platform CLI

---

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

## File Upload Configuration

The application uses **Cloudinary** for cloud-based file storage:

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret
3. Add to backend `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## Author

**Suleman Shah** - Development Lead

---

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

## Last Updated

January 2026

---

## Project Status

🚀 **Active Development** - Features are being actively developed and improved.

---

## Roadmap

- [ ] Mobile application (React Native)
- [ ] Advanced reporting and analytics
- [ ] AI-powered project forecasting
- [ ] Real-time notifications
- [ ] Team collaboration features
- [ ] Integration with external APIs
- [ ] Automated backups
- [ ] Multi-language support

---

## Related Documentation

- [API Documentation](./API_DOCS.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Development Guidelines](./CONTRIBUTING.md)
