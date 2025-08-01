# 🚀 Nitor Customer Management Portal

<div align="center">

![Nitor Infotech](https://img.shields.io/badge/Nitor-Infotech-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-16.x+-339933?style=for-the-badge&logo=node.js)
![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoft-azure)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-7952B3?style=for-the-badge&logo=bootstrap)

**A modern, analytics-driven customer management platform with AI-powered insights**

[🔥 Live Demo](#demo) • [📖 Documentation](#documentation) • [🛠️ Setup](#installation) • [🤝 Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [✨ Features](#features)
- [🛠️ Tech Stack](#tech-stack)
- [🚀 Quick Start](#quick-start)
- [📦 Installation](#installation)
- [⚙️ Configuration](#configuration)
- [🔐 Authentication](#authentication)
- [📊 Analytics Dashboard](#analytics-dashboard)
- [🏗️ Project Structure](#project-structure)
- [🎯 Usage](#usage)
- [🔧 Development](#development)
- [📱 API Documentation](#api-documentation)
- [🧪 Testing](#testing)
- [🚢 Deployment](#deployment)
- [🤝 Contributing](#contributing)
- [📄 License](#license)

---

## ✨ Features

### 🎯 **Core Features**
- 📊 **Analytics Dashboard** - Real-time customer metrics and KPIs
- 👥 **Customer Management** - Complete customer lifecycle management
- 🔐 **Azure AD Integration** - Secure Microsoft authentication
- 🚀 **Static Mode** - Demo mode with bypass authentication
- 📱 **Responsive Design** - Mobile-first, cross-device compatibility
- 🎨 **Modern UI/UX** - Beautiful animations with Framer Motion

### 🤖 **AI-Powered Components**
- 💬 **AI Chatbot** - Intelligent customer support assistant
- 📄 **Document Chat** - Interactive document processing
- 🧠 **MCP Analytics** - Advanced analytics with AI insights
- 🔧 **MCP Tools** - Comprehensive toolset for data management

### 📈 **Analytics & Insights**
- 📊 Customer engagement scoring
- 📈 Project completion tracking
- ⭐ Satisfaction ratings
- 📅 Activity monitoring
- 🏢 Multi-company support

---

## 🛠️ Tech Stack

### **Frontend**
- ⚛️ **React 18** - Modern React with hooks
- 🎨 **Bootstrap 5** - Responsive UI framework
- 🎭 **Framer Motion** - Smooth animations
- 🔐 **MSAL React** - Microsoft authentication
- 📱 **React Router** - Client-side routing
- 🎯 **React Icons** - Beautiful icon library

### **Backend**
- 🟢 **Node.js** - JavaScript runtime
- ⚡ **Express.js** - Web application framework
- 🗄️ **SQL Server** - Enterprise database (commented for static mode)
- 🔐 **Azure AD** - Authentication & authorization
- 🌐 **CORS** - Cross-origin resource sharing

### **Development & Deployment**
- 📦 **npm** - Package management
- 🔧 **Azure DevOps** - CI/CD pipeline
- ☁️ **Azure Cloud** - Hosting & services
- 🐳 **Docker Ready** - Containerization support

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/nitor-infotech/customer-portal.git
cd customer-portal

# Install dependencies for both frontend and backend
npm install
cd backend && npm install

# Start the development servers
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
npm start
```

🎉 **That's it!** Your application will be running at:
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:8080

---

## 📦 Installation

### **Prerequisites**
- 📋 Node.js 16.x or higher
- 📋 npm 8.x or higher
- 📋 Azure AD tenant (for authentication)
- 📋 SQL Server (optional - for database mode)

### **Step-by-Step Setup**

1. **Clone & Install**
   ```bash
   git clone https://github.com/nitor-infotech/customer-portal.git
   cd customer-portal
   npm install
   cd backend && npm install && cd ..
   ```

2. **Environment Configuration**
   ```bash
   # Create environment files
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

3. **Configure Authentication**
   ```javascript
   // src/authConfig.js
   export const msalConfig = {
     auth: {
       clientId: "YOUR_AZURE_CLIENT_ID",
       authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
       redirectUri: "http://localhost:3001"
     }
   };
   ```

4. **Start Development**
   ```bash
   # Start backend (Terminal 1)
   cd backend && npm start
   
   # Start frontend (Terminal 2)
   npm start
   ```

---

## ⚙️ Configuration

### **Frontend Configuration**
```javascript
// src/envConfig.js
export const getPublicPath = () => {
  return process.env.PUBLIC_URL || '/';
};

// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? `${window.location.origin}/api`
  : 'http://localhost:8080/api';
```

### **Backend Configuration**
```javascript
// backend/server.js
const PORT = process.env.PORT || 8080;

// Database Configuration (when enabled)
const config = {
  user: process.env.DB_USER || 'your_username',
  password: process.env.DB_PASSWORD || 'your_password',
  server: process.env.DB_SERVER || 'your_server.database.windows.net',
  database: process.env.DB_NAME || 'your_database'
};
```

---

## 🔐 Authentication

### **Azure AD Integration**
The application supports two authentication modes:

#### **🔒 Normal Authentication**
- Microsoft Azure AD integration
- Single Sign-On (SSO) capability
- Role-based access control
- Secure token management

#### **🚀 Static Mode (Demo)**
- Bypass authentication for demos
- Static customer data
- Full feature access
- Perfect for presentations

### **Login Options**
1. **Sign in with Microsoft** - Full Azure AD authentication
2. **ByPass - Enter Static Mode** - Demo mode with static data

---

## 📊 Analytics Dashboard

### **Key Metrics**
- 👥 **Total Customers** - Live customer count with growth percentage
- 📈 **Active Projects** - Project tracking with completion rates
- ⭐ **Customer Satisfaction** - Real-time satisfaction scoring
- 🏢 **Partner Companies** - Multi-industry partnerships

### **Customer Analytics**
- 📊 **Engagement Score** - Customer activity tracking (0-100%)
- 🎯 **Projects Completed** - Historical project data
- ⏱️ **Last Activity** - Real-time activity monitoring
- 📅 **Member Since** - Customer lifecycle tracking

### **Visual Components**
- 📈 Interactive progress bars
- 🎨 Animated metric cards
- ⭐ Star rating systems
- 📊 Real-time data visualization

---

## 🏗️ Project Structure

```
nitor-customer-portal/
├── 📁 src/                          # Frontend source code
│   ├── 📁 components/               # React components
│   │   ├── 🤖 ChatBot.js           # AI chatbot component
│   │   ├── 📄 DocumentChat.js      # Document processing
│   │   ├── 🔐 Login.js             # Authentication component
│   │   ├── 🛡️ ProtectedRoute.js    # Route protection
│   │   └── 📊 Header.js            # Navigation header
│   ├── 👥 Customers.js             # Customer list & analytics
│   ├── 📋 CustomerDetails.js       # Detailed customer view
│   ├── ⚙️ authConfig.js           # Azure AD configuration
│   └── 🎨 *.css                   # Styling files
├── 📁 backend/                      # Backend source code
│   ├── 📁 controllers/             # Business logic
│   ├── 📁 models/                  # Data models
│   ├── 📁 routes/                  # API routes
│   ├── 📁 middleware/              # Authentication middleware
│   └── 🚀 server.js               # Express server
├── 📁 public/                      # Static assets
│   ├── 📁 assets/                  # Images, icons
│   └── 📄 samplejson/             # Static demo data
└── 📋 package.json                # Project dependencies
```

---

## 🎯 Usage

### **Customer Management**
1. **View Dashboard** - Access analytics overview
2. **Browse Customers** - Navigate customer directory
3. **View Details** - Click on any customer for detailed view
4. **Analytics** - Monitor engagement scores and metrics

### **AI Features**
1. **AI Chatbot** - Navigate to `/chatbot` for intelligent assistance
2. **Document Chat** - Use `/document-chat` for document processing
3. **MCP Tools** - Access advanced analytics at `/mcp-analytics`

### **Authentication Modes**
1. **Production Mode** - Use Microsoft authentication
2. **Demo Mode** - Click "ByPass" for static data demonstration

---

## 🔧 Development

### **Development Scripts**
```bash
# Frontend development
npm start              # Start development server
npm run build         # Build for production
npm test              # Run tests
npm run eject         # Eject from Create React App

# Backend development
cd backend
npm start             # Start backend server
npm run dev           # Start with nodemon (if configured)
npm test              # Run backend tests
```

### **Code Structure Guidelines**
- 📁 Components in `/src/components/`
- 🎨 Styles co-located with components
- ⚙️ Configuration in dedicated config files
- 🔧 Utilities in `/src/utils/` (when created)

### **Development Best Practices**
- ✅ Use functional components with hooks
- ✅ Implement proper error boundaries
- ✅ Follow responsive design principles
- ✅ Use TypeScript for better type safety (future enhancement)

---

## 📱 API Documentation

### **Customer Endpoints**
```http
GET    /api/customers           # Get all customers
GET    /api/customers/:id       # Get customer by ID
POST   /api/customers           # Create new customer (auth required)
PUT    /api/customers/:id       # Update customer (auth required)
DELETE /api/customers/:id       # Delete customer (auth required)
```

### **Authentication Endpoints**
```http
GET    /auth/profile           # Get user profile
POST   /auth/login             # Login user
POST   /auth/logout            # Logout user
```

### **Static Mode**
When in static mode, all endpoints return predefined data without database calls.

---

## 🧪 Testing

### **Frontend Testing**
```bash
npm test                    # Run all tests
npm test -- --coverage    # Run with coverage report
```

### **Backend Testing**
```bash
cd backend
npm test                   # Run backend tests
```

### **Testing Strategy**
- 🧪 Unit tests for components
- 🔗 Integration tests for API endpoints
- 🎭 E2E tests for user workflows
- 📊 Performance testing for analytics

---

## 🚢 Deployment

### **Azure Deployment**
1. **Build Application**
   ```bash
   npm run build
   cd backend && npm install --production
   ```

2. **Azure App Service**
   - Deploy frontend to Azure Static Web Apps
   - Deploy backend to Azure App Service
   - Configure environment variables

3. **Database Setup**
   - Uncomment database code in backend
   - Configure Azure SQL Database
   - Update connection strings

### **Docker Deployment**
```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### **Development Workflow**
1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

### **Code Standards**
- ✅ Follow ESLint configuration
- ✅ Write meaningful commit messages
- ✅ Add tests for new features
- ✅ Update documentation as needed

### **Pull Request Process**
- 📋 Ensure all tests pass
- 📝 Update README if needed
- 🔍 Request review from maintainers
- ✅ Address feedback promptly

---

## 📞 Support & Contact

### **Nitor Infotech**
- 🌐 **Website**: [www.nitorinfotech.com](https://www.nitorinfotech.com)
- 📧 **Email**: support@nitorinfotech.com
- 💼 **LinkedIn**: [Nitor Infotech](https://linkedin.com/company/nitor-infotech)

### **Technical Support**
- 🐛 **Issues**: [GitHub Issues](https://github.com/nitor-infotech/customer-portal/issues)
- 📖 **Documentation**: [Wiki](https://github.com/nitor-infotech/customer-portal/wiki)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/nitor-infotech/customer-portal/discussions)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
Copyright (c) 2024 Nitor Infotech

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🎉 Acknowledgments

- 🙏 **Microsoft Azure** - For authentication and cloud services
- 🎨 **React Community** - For the amazing ecosystem
- 🎭 **Framer Motion** - For beautiful animations
- 🎯 **Bootstrap Team** - For responsive design framework
- 👥 **Nitor Infotech Team** - For continuous support and innovation

---

<div align="center">

**⭐ If you found this project helpful, please give it a star!**

**Built with ❤️ by [Nitor Infotech](https://www.nitorinfotech.com)**

![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge)

</div>
