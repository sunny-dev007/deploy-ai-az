# NIT AI Document Assistant

## 📋 Repository Overview

**Repository URL:** https://NitorCircles@dev.azure.com/NitorCircles/Hanover%20Hive%20Agentic%20Assistant/_git/NIT-AI-Document-Assistant

This repository contains the NIT AI Document Assistant, a full-stack application designed to provide intelligent document processing and assistance capabilities.

## 🌿 Branch Strategy

### Development Workflow

| Branch | Purpose | Deployment | Description |
|--------|---------|------------|-------------|
| `dev` | Development | Manual/Local | Primary development branch for local development and testing |
| `main` | Production | Automatic | Production-ready code with automatic pipeline triggers |

### Branch Details

#### 🔧 Dev Branch
- **Purpose**: Local development and feature integration
- **Deployment**: Manual deployment for development
- **Workflow**: 
  - All feature development occurs here
  - Code review before merging to main
  - Safe environment for experimentation

#### 🚀 Main Branch
- **Purpose**: Production deployment
- **Deployment**: **Automatic pipeline trigger to WebApp**
- **Workflow**:
  - Receives stable code from dev branch
  - Automatically triggers CI/CD pipeline
  - Deploys directly to production environment

## ⚙️ Technology Stack

### Runtime Environment
- **Node.js**: `20.18.1`
- **NPM**: `9.9.4`

### Framework & Libraries
- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: SQL-based (configured in backend)
- **Authentication**: Microsoft Azure AD integration

## 🚀 Pipeline Configuration

### Automatic Deployment
- **Trigger**: Push to `main` branch
- **Target**: Azure WebApp
- **Pipeline File**: `azure-pipelines.yml`

### Pipeline Stages
1. **Build**: Compile and bundle application

3. **Deploy**: Deploy to Azure WebApp

## 🛠️ Development Setup

### Prerequisites
```bash
node --version  # Should be 20.18.1
npm --version   # Should be 9.9.4
```

### Local Development
```bash
# Clone the repository
git clone https://NitorCircles@dev.azure.com/NitorCircles/Hanover%20Hive%20Agentic%20Assistant/_git/NIT-AI-Document-Assistant

# Switch to dev branch
git checkout dev

# Install dependencies
npm install

# Start development server
npm start
```

## 📁 Project Structure

```
nit-ai-document-assistant/
├── backend/                 # Node.js backend application
├── src/                     # React frontend source
├── public/                  # Static assets
├── azure-pipelines.yml      # CI/CD pipeline configuration
├── package.json            # Root dependencies
└── README.md               # Project documentation
```

## 🔄 Deployment Workflow

### Development to Production
1. **Development**: Work on `dev` branch
2. **Development**: Thoroughly develop and review features locally
3. **Code Review**: Create pull request from `dev` to `main`
4. **Merge**: Approve and merge to `main`
5. **Auto-Deploy**: Pipeline automatically triggers and deploys to WebApp

### Emergency Hotfixes
1. Create hotfix branch from `main`
2. Apply critical fixes
3. Merge directly to `main` for immediate deployment
4. Back-merge to `dev` to maintain consistency

## 📞 Support & Contact

For technical support or questions regarding the repository and deployment pipeline, please contact the development team through the appropriate channels.

---

**Last Updated**: January 2024  
**Maintained by**: NIT Development Team  
**Pipeline Status**: [![Build Status](https://dev.azure.com/NitorCircles/Hanover%20Hive%20Agentic%20Assistant/_apis/build/status/NIT-AI-Document-Assistant?branchName=main)](https://dev.azure.com/NitorCircles/Hanover%20Hive%20Agentic%20Assistant/_build/latest?definitionId=YourDefinitionId&branchName=main)