# Construction App - Frontend

A modern React-based construction project management application built with Vite.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

- Project management and tracking
- Employee management
- Expense tracking
- Task status monitoring
- Inventory management
- Supplier management
- Document uploads
- Budget vs. Expense analysis
- User authentication

## 🛠️ Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS** - Styling

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. Clone the repository

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the frontend directory

   ```bash
   cd frontend
   ```

3. Install dependencies
   ```bash
   npm install
   ```

## 🔐 Environment Setup

1. Copy the example environment file

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your configuration
   ```
   VITE_BACKEND_BASE_URL=http://localhost:8080
   ```

⚠️ **Important:** Never commit `.env` file to GitHub. It's included in `.gitignore` for security.

## 🚀 Running the Application

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── api/                 # API configuration and axios setup
├── components/          # Reusable React components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard charts and summaries
│   ├── Layout/         # Layout components (Navbar, Sidebar, etc.)
│   ├── Projects/       # Project-related components
│   ├── Employees/      # Employee management components
│   ├── Tasks/          # Task management components
│   ├── Expenses/       # Expense tracking components
│   ├── Inventory/      # Inventory management components
│   └── ...
├── pages/              # Page components
├── services/           # API service functions
├── utils/              # Utility functions
├── App.jsx            # Root component
└── main.jsx           # Entry point
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## ⚖️ License

This project is licensed under the MIT License.

## 📞 Support

For questions or issues, please open an issue in the repository.
