<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# YieldMax - AI-Powered DeFi Yield Optimizer

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Core Features](#core-features)
- [Installation Guide](#installation-guide)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Backend Services](#backend-services)
- [Database Schema](#database-schema)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Development Workflow](#development-workflow)

***

## 🎯 Project Overview

YieldMax is a comprehensive DeFi yield optimization platform that combines real-time protocol integration, Web3 wallet connectivity, and AI-powered recommendations to help users maximize their cryptocurrency yields across 50+ DeFi protocols.

### 🏗️ Tech Stack

| Component | Technology | Purpose |
| :-- | :-- | :-- |
| **Frontend** | Next.js 15 + TypeScript | React-based UI with SSR |
| **Backend** | Node.js + Express + TypeScript | RESTful API server |
| **Database** | MongoDB + Mongoose | Data persistence |
| **Web3** | Wagmi + Ethers.js + ConnectKit | Blockchain integration |
| **AI/ML** | OpenAI GPT-4 + Python ML | Recommendation engine |
| **Caching** | Redis | Performance optimization |
| **Styling** | Tailwind CSS + shadcn/ui | Component library |
| **Authentication** | JWT + bcrypt | User security |

### 🎨 Design System

- **Theme**: Dark green gradient design
- **Colors**: Black backgrounds with green (\#00ff00) accents
- **Typography**: Inter font family
- **Components**: shadcn/ui based custom components

***

## 🏛️ Architecture

### System Architecture Diagram

```mermaid
graph TB
    A[Frontend - Next.js] --> B[API Gateway - Express]
    B --> C[Authentication Service]
    B --> D[DeFi Integration Service]
    B --> E[AI Recommendation Engine]
    B --> F[Portfolio Service]
    
    C --> G[MongoDB - Users]
    D --> H[External APIs]
    D --> I[Blockchain RPCs]
    E --> J[OpenAI API]
    E --> K[Python ML Models]
    F --> G
    
    H --> L[Moralis API]
    H --> M[DeFiLlama API]
    H --> N[1inch API]
    H --> O[CoinGecko API]
    
    I --> P[Ethereum Mainnet]
    I --> Q[Polygon]
    I --> R[Arbitrum]
```


### Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant DB as MongoDB
    participant AI as AI Engine
    participant DeFi as DeFi APIs
    
    U->>F: Connect Wallet
    F->>B: Authenticate User
    B->>DB: Store/Retrieve User Data
    
    U->>F: Request Recommendations
    F->>B: POST /api/v1/ai/recommendations
    B->>DeFi: Fetch Real-time Yields
    B->>AI: Generate ML Predictions
    AI->>B: Return Strategy
    B->>F: Send Recommendations
    F->>U: Display Strategy
```


***

## 📁 Directory Structure

### Frontend Structure (`client/`)

```
client/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/page.tsx        # Login page component
│   │   │   └── signup/page.tsx       # Registration page
│   │   ├── dashboard/page.tsx        # Main dashboard
│   │   ├── yields/page.tsx           # DeFi yields explorer
│   │   ├── portfolio/page.tsx        # Portfolio management
│   │   ├── strategies/page.tsx       # Investment strategies
│   │   ├── analytics/page.tsx        # Portfolio analytics
│   │   ├── settings/page.tsx         # User preferences
│   │   ├── globals.css               # Global styles & animations
│   │   ├── layout.tsx                # Root layout with providers
│   │   └── page.tsx                  # Homepage component
│   ├── components/                   # Reusable UI components
│   │   ├── auth/                     # Authentication components
│   │   │   ├── LoginForm.tsx         # Login form with validation
│   │   │   └── SignupForm.tsx        # Registration form
│   │   ├── dashboard/                # Dashboard widgets
│   │   │   ├── YieldComparison.tsx   # Yield comparison table
│   │   │   ├── PortfolioTracker.tsx  # Portfolio overview chart
│   │   │   ├── RiskAssessment.tsx    # Risk analysis component
│   │   │   └── RecommendationPanel.tsx # AI recommendations display
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx            # Navigation header
│   │   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   │   ├── AuthLayout.tsx        # Auth pages layout
│   │   │   └── ProtectedRoute.tsx    # Route protection HOC
│   │   ├── providers/                # Context providers
│   │   │   └── Web3Provider.tsx      # Web3 configuration wrapper
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx            # Custom button component
│   │   │   ├── card.tsx              # Card layout component
│   │   │   ├── input.tsx             # Form input component
│   │   │   └── [other-ui-components] # Additional UI elements
│   │   ├── web3/                     # Web3 integration
│   │   │   ├── ConnectWallet.tsx     # Basic wallet connection
│   │   │   └── EnhancedConnectWallet.tsx # Advanced wallet UI
│   │   └── ai/                       # AI-related components
│   │       └── RecommendationEngine.tsx # AI strategy generator
│   ├── contexts/                     # React contexts
│   │   └── AuthContext.tsx           # User authentication state
│   ├── hooks/                        # Custom React hooks
│   │   ├── useWeb3.ts               # Web3 interaction hooks
│   │   └── useYieldData.ts          # Yield data fetching
│   └── lib/                         # Utility libraries
│       ├── utils.ts                 # Helper functions
│       └── wagmi.ts                 # Web3 configuration
├── public/                          # Static assets
│   ├── logo.png                     # YieldMax logo
│   └── favicon.ico                  # Site favicon
├── package.json                     # Dependencies & scripts
├── tailwind.config.js               # Tailwind CSS config
├── next.config.js                   # Next.js configuration
└── tsconfig.json                    # TypeScript config
```


### Backend Structure (`server/`)

```
server/
├── controllers/                     # Request handlers
│   ├── authController.ts            # User authentication logic
│   ├── userController.ts            # User management operations
│   ├── yieldController.ts           # DeFi yield operations
│   ├── portfolioController.ts       # Portfolio management
│   ├── strategyController.ts        # Investment strategies
│   ├── transactionController.ts     # Transaction handling
│   └── aiController.ts              # AI recommendation logic
├── services/                        # Business logic layer
│   ├── authService.ts               # Authentication business logic
│   ├── userService.ts               # User operations
│   ├── yieldService.ts              # Basic yield fetching
│   ├── realDefiService.ts           # Enhanced DeFi integration
│   ├── portfolioService.ts          # Portfolio calculations
│   ├── strategyService.ts           # Strategy management
│   ├── transactionService.ts        # Transaction processing
│   ├── aiRecommendationService.ts   # AI/ML recommendation engine
│   ├── blockchainService.ts         # Blockchain interactions
│   └── externalApiService.ts        # Third-party API integration
├── models/                          # Database schemas
│   ├── User.ts                      # User account schema
│   ├── Yield.ts                     # DeFi yield data schema
│   ├── Portfolio.ts                 # User portfolio schema
│   ├── Strategy.ts                  # Investment strategy schema
│   └── Transaction.ts               # Transaction record schema
├── routes/                          # API route definitions
│   ├── authRoutes.ts                # Authentication endpoints
│   ├── userRoutes.ts                # User management endpoints
│   ├── yieldRoutes.ts               # Yield data endpoints
│   ├── portfolioRoutes.ts           # Portfolio endpoints
│   ├── strategyRoutes.ts            # Strategy endpoints
│   ├── transactionRoutes.ts         # Transaction endpoints
│   └── aiRoutes.ts                  # AI recommendation endpoints
├── middlewares/                     # Express middleware
│   ├── authMiddleware.ts            # JWT token validation
│   ├── errorHandler.ts              # Global error handling
│   ├── validateRequest.ts           # Input validation & rate limiting
│   └── corsMiddleware.ts            # CORS configuration
├── utils/                           # Utility functions
│   ├── logger.ts                    # Winston logging setup
│   ├── validators.ts                # Joi validation schemas
│   ├── responseFormatter.ts         # API response formatting
│   └── constants.ts                 # Application constants
├── config/                          # Configuration files
│   ├── database.ts                  # MongoDB connection setup
│   ├── env.ts                       # Environment variable handling
│   └── server.ts                    # Server configuration
├── python_models/                   # ML model files
│   └── yield_optimizer.py           # Python ML recommendation model
├── tests/                          # Test suites
│   ├── auth.test.ts                # Authentication tests
│   └── yield.test.ts               # Yield service tests
├── logs/                           # Application logs
├── app.ts                          # Express app setup
├── server.ts                       # Server entry point
├── package.json                    # Dependencies & scripts
└── tsconfig.json                   # TypeScript configuration
```


***

## 🚀 Core Features

### Feature Matrix

| Feature | Status | Frontend Component | Backend Service | Description |
| :-- | :-- | :-- | :-- | :-- |
| **User Authentication** | ✅ | `AuthContext`, `LoginForm` | `authService` | JWT-based login/signup |
| **Web3 Wallet Connection** | ✅ | `EnhancedConnectWallet` | `blockchainService` | Multi-wallet support (MetaMask, WalletConnect) |
| **Real-time DeFi Data** | ✅ | `YieldComparison` | `realDefiService` | Live yields from 50+ protocols |
| **Portfolio Tracking** | ✅ | `PortfolioTracker` | `portfolioService` | Real-time portfolio analytics |
| **AI Recommendations** | ✅ | `RecommendationEngine` | `aiRecommendationService` | ML + GPT-powered strategies |
| **Strategy Management** | ✅ | `strategies/page.tsx` | `strategyService` | Pre-built and custom strategies |
| **Transaction History** | ✅ | Portfolio components | `transactionService` | Complete transaction tracking |
| **Risk Assessment** | ✅ | `RiskAssessment` | Multiple services | Dynamic risk scoring |
| **Multi-chain Support** | ✅ | `Web3Provider` | `blockchainService` | Ethereum, Polygon, Arbitrum, etc. |
| **Responsive Design** | ✅ | All components | N/A | Mobile-first responsive UI |

### Core Integrations

| Integration | Purpose | API Endpoint | Service File |
| :-- | :-- | :-- | :-- |
| **Moralis** | Real-time blockchain data | `https://deep-index.moralis.io/api/v2/` | `realDefiService.ts` |
| **DeFiLlama** | Protocol TVL \& yields | `https://api.llama.fi/` | `realDefiService.ts` |
| **1inch** | Optimal swap routing | `https://api.1inch.dev/` | `realDefiService.ts` |
| **CoinGecko** | Price data \& market info | `https://api.coingecko.com/api/v3/` | `externalApiService.ts` |
| **OpenAI** | AI explanations \& analysis | `https://api.openai.com/v1/` | `aiRecommendationService.ts` |
| **Aave API** | Lending protocol data | `https://aave-api-v2.aave.com/` | `realDefiService.ts` |
| **Compound API** | Lending rates \& data | `https://api.compound.finance/` | `realDefiService.ts` |


***

## 🛠️ Installation Guide

### Prerequisites

| Requirement | Version | Installation |
| :-- | :-- | :-- |
| **Node.js** | 18.0+ | `https://nodejs.org/` |
| **MongoDB** | 6.0+ | `https://www.mongodb.com/try/download/community` |
| **Redis** | 7.0+ | `https://redis.io/download` |
| **Python** | 3.9+ | `https://www.python.org/downloads/` |
| **Git** | Latest | `https://git-scm.com/downloads` |

### Step 1: Clone \& Setup

```bash
# Clone the repository
git clone https://github.com/your-username/yieldmax.git
cd yieldmax

# Create project structure
mkdir client server
```


### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd server

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mongoose cors helmet bcryptjs jsonwebtoken joi axios node-cron winston compression dotenv
npm install moralis ethers@5.7.2 redis ioredis python-shell openai

# Install development dependencies
npm install -D typescript ts-node-dev @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/compression jest supertest @types/jest eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Install Python ML dependencies
pip install scikit-learn pandas numpy tensorflow

# Create directory structure
mkdir -p controllers services models routes middlewares utils config tests python_models logs

# Initialize TypeScript
npx tsc --init
```


### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd ../client

# Create Next.js app
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

# Install additional dependencies
npm install wagmi viem@2 @tanstack/react-query connectkit ethers@5.7.2
npm install @walletconnect/web3-provider @coinbase/wallet-sdk
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install sonner @radix-ui/react-dropdown-menu @radix-ui/react-dialog

# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label badge progress dropdown-menu dialog
```


### Step 4: Environment Configuration

**Backend Environment (`.env`)**

```bash
# Create backend environment file
cd ../server
touch .env
```

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/yieldmax

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# External APIs
MORALIS_API_KEY=your_moralis_api_key
COINGECKO_API_KEY=your_coingecko_api_key
ONEINCH_API_KEY=your_1inch_api_key
OPENAI_API_KEY=your_openai_api_key

# Blockchain
INFURA_PROJECT_ID=your_infura_project_id
ALCHEMY_API_KEY=your_alchemy_api_key

# Redis
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

**Frontend Environment (`.env.local`)**

```bash
# Create frontend environment file
cd ../client
touch .env.local
```

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Web3 Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id

# App Configuration
NEXT_PUBLIC_APP_NAME=YieldMax
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered DeFi Yield Optimizer
```


### Step 5: Database Setup

```bash
# Start MongoDB (Linux/Mac)
sudo systemctl start mongod
# or
brew services start mongodb-community

# Start Redis
redis-server

# Create database and collections (optional - auto-created)
mongo
> use yieldmax
> db.users.createIndex({ email: 1 }, { unique: true })
> db.yields.createIndex({ platform: 1, token: 1 }, { unique: true })
```


### Step 6: Start Development Servers

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev

# Terminal 3: Monitor logs (optional)
cd server
tail -f logs/combined.log
```


### Verification Checklist

- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] MongoDB connected (check server logs)
- [ ] Redis connected (check server logs)
- [ ] Health endpoint responds: `curl http://localhost:5000/api/v1/health`

***

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
| :-- | :-- | :-- | :-- | :-- |
| `POST` | `/api/v1/auth/register` | User registration | `{ name, email, password }` | `{ user, token }` |
| `POST` | `/api/v1/auth/login` | User login | `{ email, password }` | `{ user, token }` |
| `GET` | `/api/v1/auth/me` | Get current user | Headers: `Authorization: Bearer <token>` | `{ user }` |
| `POST` | `/api/v1/auth/logout` | User logout | Headers: `Authorization: Bearer <token>` | `{ message }` |

#### Example: User Registration

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64f123...",
      "name": "John Doe",
      "email": "john@example.com",
      "isVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-09-05T07:05:00.000Z"
}
```


### Yield Data Endpoints

| Method | Endpoint | Description | Parameters | Auth Required |
| :-- | :-- | :-- | :-- | :-- |
| `GET` | `/api/v1/yields` | Get all yields | `?category=lending&minApy=4&sortBy=apy` | No |
| `GET` | `/api/v1/yields/top/:limit` | Get top yields | `limit` (path param) | No |
| `GET` | `/api/v1/yields/realtime` | Real-time yields | None | No |
| `GET` | `/api/v1/yields/:id` | Get yield details | `id` (path param) | No |

#### Example: Get Real-time Yields

```bash
curl -X GET "http://localhost:5000/api/v1/yields/realtime?category=lending&limit=10"
```

**Response:**

```json
{
  "status": "success",
  "message": "Real-time yields fetched successfully",
  "data": [
    {
      "platform": "Aave V3",
      "token": "USDC",
      "apy": 4.2,
      "tvl": "$1.2B",
      "riskScore": 0.9,
      "category": "lending",
      "chainId": 1,
      "contractAddress": "0x...",
      "metrics": {
        "dailyVolume": 1000000,
        "utilization": 75.5
      },
      "lastUpdated": "2025-09-05T07:00:00.000Z"
    }
  ]
}
```


### Portfolio Endpoints

| Method | Endpoint | Description | Request Body | Auth Required |
| :-- | :-- | :-- | :-- | :-- |
| `GET` | `/api/v1/portfolios` | Get user portfolio | None | Yes |
| `POST` | `/api/v1/portfolios/positions` | Add position | `{ platform, token, amount, initialValue, apy }` | Yes |
| `PUT` | `/api/v1/portfolios/positions/:id` | Update position | `{ amount?, apy? }` | Yes |
| `DELETE` | `/api/v1/portfolios/positions/:id` | Remove position | None | Yes |
| `GET` | `/api/v1/portfolios/analytics` | Portfolio analytics | None | Yes |

### AI Recommendation Endpoints

| Method | Endpoint | Description | Request Body | Auth Required |
| :-- | :-- | :-- | :-- | :-- |
| `POST` | `/api/v1/ai/recommendations` | Generate recommendations | `{ riskTolerance, investmentAmount, timeHorizon, preferredProtocols }` | Yes |
| `POST` | `/api/v1/ai/optimize` | Optimize strategy | `{ currentStrategy, marketChanges, performanceData }` | Yes |

#### Example: AI Recommendations

```bash
curl -X POST http://localhost:5000/api/v1/ai/recommendations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "riskTolerance": "medium",
    "investmentAmount": 5000,
    "timeHorizon": "medium",
    "preferredProtocols": ["Aave", "Yearn", "Curve"]
  }'
```


### Error Response Format

All errors follow this standard format:

```json
{
  "status": "error",
  "message": "Descriptive error message",
  "error": "Detailed error (development only)",
  "timestamp": "2025-09-05T07:05:00.000Z"
}
```


### HTTP Status Codes

| Code | Meaning | Description |
| :-- | :-- | :-- |
| `200` | OK | Request successful |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid request data |
| `401` | Unauthorized | Authentication required |
| `403` | Forbidden | Access denied |
| `404` | Not Found | Resource not found |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |


***

## 🎨 Frontend Components

### Component Architecture

```mermaid
graph TD
    A[App Layout] --> B[AuthProvider]
    A --> C[Web3Provider]
    
    B --> D[ProtectedRoute]
    D --> E[Dashboard]
    D --> F[Portfolio]
    D --> G[Strategies]
    
    E --> H[YieldComparison]
    E --> I[PortfolioTracker]
    E --> J[RecommendationPanel]
    
    C --> K[ConnectWallet]
    C --> L[Web3 Hooks]
```


### Key Components Documentation

#### AuthContext (`src/contexts/AuthContext.tsx`)

**Purpose**: Global user authentication state management

**Key Functions**:

- `login(email, password)`: Authenticate user
- `signup(email, password, name)`: Register new user
- `logout()`: Clear authentication state
- `isAuthenticated`: Boolean authentication status

**Usage**:

```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />
  }
  
  return <div>Welcome, {user.name}!</div>
}
```


#### EnhancedConnectWallet (`src/components/web3/EnhancedConnectWallet.tsx`)

**Purpose**: Advanced Web3 wallet connection with multi-wallet support

**Features**:

- MetaMask, WalletConnect, Coinbase Wallet support
- ENS name resolution
- Balance display
- Chain switching
- Transaction history access

**Dependencies**:

```tsx
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
```


#### RecommendationEngine (`src/components/ai/RecommendationEngine.tsx`)

**Purpose**: AI-powered investment strategy recommendations

**Key Features**:

- User preference input
- ML-based strategy generation
- Risk assessment display
- Strategy execution interface

**API Integration**:

```typescript
const generateRecommendations = async () => {
  const response = await fetch('/api/v1/ai/recommendations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userPreferences)
  })
}
```


### Component Props \& State

#### YieldComparison Component

| Prop | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `filters` | `YieldFilters` | No | Filter criteria for yields |
| `sortBy` | `'apy' \| 'tvl' \| 'risk'` | No | Sort order preference |
| `limit` | `number` | No | Maximum yields to display |

**State Management**:

```tsx
interface YieldState {
  yields: YieldData[]
  loading: boolean
  error: string | null
  filters: YieldFilters
}
```


#### ProtectedRoute Component

**Purpose**: Route-level authentication protection

**Usage**:

```tsx
function ProtectedPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
```

**Behavior**:

- Redirects unauthenticated users to `/login`
- Shows loading spinner during auth check
- Passes through authenticated users

***

## ⚙️ Backend Services

### Service Layer Architecture

```mermaid
graph LR
    A[Controllers] --> B[Services]
    B --> C[Models]
    B --> D[External APIs]
    B --> E[Blockchain]
    
    B1[authService] --> F[JWT]
    B2[realDefiService] --> G[Moralis API]
    B2 --> H[DeFiLlama API]
    B3[aiRecommendationService] --> I[OpenAI API]
    B3 --> J[Python ML]
```


### Core Services Documentation

#### realDefiService (`services/realDefiService.ts`)

**Purpose**: Real-time DeFi protocol integration

**Key Methods**:


| Method | Parameters | Returns | Description |
| :-- | :-- | :-- | :-- |
| `fetchRealTimeYields()` | None | `Promise<YieldData[]>` | Aggregates yields from all protocols |
| `fetchAaveYields()` | None | `Promise<YieldData[]>` | Aave protocol specific data |
| `getOptimalSwapRoute()` | `fromToken, toToken, amount` | `Promise<SwapRoute>` | 1inch optimal routing |
| `trackPortfolioRealTime()` | `walletAddress` | `Promise<Portfolio>` | Live portfolio tracking |

**Caching Strategy**:

```typescript
// 5-minute cache for yield data
const cacheKey = 'defi_yields_realtime'
await this.redis.setex(cacheKey, 300, JSON.stringify(yields))
```

**Error Handling**:

```typescript
try {
  const data = await this.fetchExternalAPI()
  return data
} catch (error) {
  logger.error('API Error:', error)
  return this.getFallbackData() // Graceful degradation
}
```


#### aiRecommendationService (`services/aiRecommendationService.ts`)

**Purpose**: AI-powered investment recommendations using ML + GPT

**Architecture**:

```mermaid
graph TD
    A[User Profile] --> B[Feature Extraction]
    B --> C[ML Model Prediction]
    C --> D[GPT Enhancement]
    D --> E[Final Recommendation]
    
    F[Market Data] --> B
    G[Historical Performance] --> C
```

**Key Components**:

1. **Feature Engineering**:
```typescript
private extractFeatures(userProfile: UserProfile, marketData: any[]): any {
  const riskScore = { 'low': 0.3, 'medium': 0.6, 'high': 0.9 }[userProfile.riskTolerance]
  const timeHorizonScore = { 'short': 0.3, 'medium': 0.6, 'long': 1.0 }[userProfile.timeHorizon]
  
  return {
    user_risk_score: riskScore,
    investment_amount: userProfile.investmentAmount,
    market_avg_apy: marketData.reduce((sum, item) => sum + item.apy, 0) / marketData.length
    // ... more features
  }
}
```

2. **ML Integration**:
```typescript
private async getMLRecommendations(features: any): Promise<any> {
  const options = {
    mode: 'json' as const,
    scriptPath: './python_models/',
    args: [JSON.stringify(features)]
  }
  
  const results = await PythonShell.run('yield_optimizer.py', options)
  return JSON.parse(results[0])
}
```

3. **GPT Enhancement**:
```typescript
private async enhanceWithAI(mlRecommendations: any, userProfile: UserProfile): Promise<AIRecommendation> {
  const completion = await this.openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: "You are an expert DeFi yield optimization advisor..."
    }],
    temperature: 0.3
  })
  
  return this.combineMLWithAI(mlRecommendations, completion.choices[0].message.content)
}
```


#### blockchainService (`services/blockchainService.ts`)

**Purpose**: Direct blockchain interaction and smart contract calls

**Key Capabilities**:

- Token balance queries
- Gas estimation
- Transaction simulation
- Multi-chain support

**Usage Example**:

```typescript
// Get user's token balance
const balance = await blockchainService.getTokenBalance(
  '0xA0b86a33E6417c02e6991C741c85635E44353613', // USDC contract
  userWalletAddress
)

// Estimate gas for transaction
const gasPrice = await blockchainService.estimateGasPrice()
```


### Service Dependencies

| Service | Dependencies | Purpose |
| :-- | :-- | :-- |
| `realDefiService` | `axios`, `ethers`, `redis` | External API integration |
| `aiRecommendationService` | `openai`, `python-shell` | AI/ML processing |
| `blockchainService` | `ethers`, `infura` | Blockchain interaction |
| `portfolioService` | `mongoose`, `realDefiService` | Portfolio calculations |
| `authService` | `jsonwebtoken`, `bcrypt` | User authentication |


***

## 🗄️ Database Schema

### MongoDB Collections

#### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,                    // User's full name
  email: String,                   // Unique email address
  password: String,                // Hashed password (bcrypt)
  avatar: String,                  // Profile image URL
  isVerified: Boolean,             // Email verification status
  role: String,                    // 'user' | 'admin'
  
  // User preferences for AI recommendations
  preferences: {
    riskTolerance: String,         // 'low' | 'medium' | 'high'
    preferredProtocols: [String],  // ['Aave', 'Yearn', ...]
    notifications: {
      email: Boolean,
      push: Boolean,
      yield: Boolean,
      security: Boolean
    },
    currency: String,              // 'USD' | 'EUR' | 'GBP'
    language: String               // 'en' | 'es' | 'fr'
  },
  
  // Portfolio summary (computed)
  portfolio: {
    totalValue: Number,            // Current portfolio value in USD
    positions: [ObjectId],         // References to Portfolio collection
    performance: {
      daily: Number,               // 24h performance %
      weekly: Number,              // 7d performance %
      monthly: Number,             // 30d performance %
      yearly: Number               // 365d performance %
    }
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })
```


#### Yields Collection

```javascript
{
  _id: ObjectId,
  platform: String,                // 'Aave V3', 'Compound', etc.
  token: String,                   // 'USDC', 'DAI', 'ETH/USDC'
  apy: Number,                     // Annual Percentage Yield
  tvl: String,                     // Total Value Locked ('$1.2B')
  riskScore: Number,               // 0.0 to 1.0 (1.0 = safest)
  category: String,                // 'lending' | 'dex' | 'yield-farming' | 'liquid-staking'
  chainId: Number,                 // 1 (Ethereum), 137 (Polygon), etc.
  contractAddress: String,         // Smart contract address
  
  // Additional protocol metadata
  audits: [String],                // ['PeckShield', 'Trail of Bits']
  
  // Performance metrics
  metrics: {
    dailyVolume: Number,           // 24h trading volume
    weeklyVolume: Number,          // 7d trading volume
    totalUsers: Number,            // Active users count
    utilization: Number,           // Protocol utilization %
    apy1d: Number,                 // 1-day APY
    apy7d: Number,                 // 7-day APY
    apy30d: Number                 // 30-day APY
  },
  
  lastUpdated: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

```javascript
db.yields.createIndex({ platform: 1, token: 1 }, { unique: true })
db.yields.createIndex({ apy: -1 })
db.yields.createIndex({ category: 1, riskScore: -1 })
db.yields.createIndex({ lastUpdated: -1 })
```


#### Portfolios Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to Users collection
  totalValue: Number,              // Portfolio value in USD
  
  // Individual positions
  positions: [{
    platform: String,              // Protocol name
    token: String,                 // Token symbol
    amount: Number,                // Token amount held
    initialValue: Number,          // Initial investment USD value
    currentValue: Number,          // Current USD value
    apy: Number,                   // Current APY for this position
    startDate: Date,               // When position was opened
    lastUpdated: Date,             // Last value update
    transactions: [ObjectId]       // References to Transaction collection
  }],
  
  // Portfolio performance metrics
  performance: {
    daily: Number,                 // 24h change %
    weekly: Number,                // 7d change %
    monthly: Number,               // 30d change %
    yearly: Number                 // 365d change %
  },
  
  riskScore: Number,               // Weighted portfolio risk (0.0-1.0)
  lastRebalance: Date,             // Last rebalancing date
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

```javascript
db.portfolios.createIndex({ userId: 1 }, { unique: true })
db.portfolios.createIndex({ totalValue: -1 })
db.portfolios.createIndex({ lastUpdated: -1 })
```


#### Strategies Collection

```javascript
{
  _id: ObjectId,
  name: String,                    // Strategy display name
  description: String,             // Strategy description
  category: String,                // 'conservative' | 'balanced' | 'aggressive' | 'specialized' | 'ai-powered'
  expectedAPY: Number,             // Expected annual return %
  riskLevel: String,               // 'low' | 'medium' | 'high'
  minInvestment: Number,           // Minimum investment amount
  
  // Protocol allocations
  protocols: [String],             // ['Aave', 'Yearn', 'Curve']
  allocations: [{
    protocol: String,              // Protocol name
    percentage: Number             // Allocation percentage (0-100)
  }],
  
  // Strategy performance tracking
  performance: {
    oneMonth: Number,              // 30d performance %
    threeMonths: Number,           // 90d performance %
    sixMonths: Number,             // 180d performance %
    oneYear: Number                // 365d performance %
  },
  
  // Social features
  followers: Number,               // Number of users following
  isActive: Boolean,               // Strategy availability
  creator: ObjectId,               // Reference to Users (strategy creator)
  
  createdAt: Date,
  updatedAt: Date
}
```


#### Transactions Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,                // Reference to Users collection
  type: String,                    // 'deposit' | 'withdraw' | 'reward' | 'swap' | 'compound'
  platform: String,               // Protocol used
  token: String,                   // Token symbol
  amount: Number,                  // Token amount
  value: Number,                   // USD value at transaction time
  
  // Blockchain transaction data
  txHash: String,                  // Blockchain transaction hash
  status: String,                  // 'pending' | 'completed' | 'failed' | 'cancelled'
  gasUsed: Number,                 // Gas units used
  gasFee: Number,                  // Gas fee in USD
  blockNumber: Number,             // Block number
  fromAddress: String,             // Sender address
  toAddress: String,               // Recipient address
  
  // Additional metadata
  metadata: {
    strategyId: ObjectId,          // Reference to Strategy (if applicable)
    portfolioId: ObjectId,         // Reference to Portfolio
    notes: String,                 // User notes
    pricePerToken: Number          // Token price at transaction time
  },
  
  createdAt: Date,
  updatedAt: Date
}
```


### Database Relationships

```mermaid
erDiagram
    Users ||--o{ Portfolios : owns
    Users ||--o{ Transactions : makes
    Users ||--o{ Strategies : creates
    
    Portfolios ||--o{ Transactions : contains
    Strategies ||--o{ Transactions : executes
    
    Users {
        ObjectId _id
        string email
        string name
        object preferences
        object portfolio
    }
    
    Portfolios {
        ObjectId _id
        ObjectId userId
        array positions
        object performance
    }
    
    Transactions {
        ObjectId _id
        ObjectId userId
        string type
        string platform
        number amount
    }
    
    Strategies {
        ObjectId _id
        ObjectId creator
        string name
        array allocations
    }
    
    Yields {
        ObjectId _id
        string platform
        string token
        number apy
    }
```


***

## ⚙️ Configuration

### Environment Variables Reference

#### Backend Configuration (`server/.env`)

| Variable | Type | Required | Default | Description |
| :-- | :-- | :-- | :-- | :-- |
| `NODE_ENV` | string | No | `development` | Application environment |
| `PORT` | number | No | `5000` | Server port |
| `API_VERSION` | string | No | `v1` | API version prefix |
| `MONGODB_URI` | string | **Yes** | - | MongoDB connection string |
| `JWT_SECRET` | string | **Yes** | - | JWT signing secret |
| `JWT_EXPIRES_IN` | string | No | `7d` | JWT expiration time |
| `MORALIS_API_KEY` | string | **Yes** | - | Moralis API key |
| `OPENAI_API_KEY` | string | **Yes** | - | OpenAI API key |
| `COINGECKO_API_KEY` | string | No | - | CoinGecko API key |
| `ONEINCH_API_KEY` | string | No | - | 1inch API key |
| `INFURA_PROJECT_ID` | string | **Yes** | - | Infura project ID |
| `REDIS_URL` | string | No | `redis://localhost:6379` | Redis connection string |
| `RATE_LIMIT_WINDOW_MS` | number | No | `900000` | Rate limit window (15min) |
| `RATE_LIMIT_MAX_REQUESTS` | number | No | `100` | Max requests per window |
| `LOG_LEVEL` | string | No | `info` | Logging level |

#### Frontend Configuration (`client/.env.local`)

| Variable | Type | Required | Description |
| :-- | :-- | :-- | :-- |
| `NEXT_PUBLIC_API_URL` | string | **Yes** | Backend API base URL |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | string | **Yes** | WalletConnect project ID |
| `NEXT_PUBLIC_INFURA_PROJECT_ID` | string | **Yes** | Infura project ID |
| `NEXT_PUBLIC_APP_NAME` | string | No | Application name |

### API Keys Setup Guide

#### 1. Moralis API Key

```bash
# Visit: https://moralis.io/
# 1. Sign up for free account
# 2. Create new project
# 3. Go to Settings > API Keys
# 4. Copy "Web3 API Key"

MORALIS_API_KEY=your_moralis_api_key_here
```


#### 2. OpenAI API Key

```bash
# Visit: https://platform.openai.com/
# 1. Create account and add billing
# 2. Go to API Keys section
# 3. Create new secret key

OPENAI_API_KEY=sk-your_openai_key_here
```


#### 3. Infura Project ID

```bash
# Visit: https://infura.io/
# 1. Sign up for free account
# 2. Create new project
# 3. Copy Project ID from dashboard

INFURA_PROJECT_ID=your_infura_project_id_here
```


#### 4. WalletConnect Project ID

```bash
# Visit: https://cloud.walletconnect.com/
# 1. Create account
# 2. Create new project
# 3. Copy Project ID

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```


### Tailwind Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Custom green gradient colors
        green: {
          400: '#00ff00',
          500: '#00cc00',
          600: '#009900',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-green": "pulse-green 2s ease-in-out infinite",
      },
      keyframes: {
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-green": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```


### Next.js Configuration (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'assets.coingecko.com',
      'cryptologos.cc',
      'raw.githubusercontent.com',
      'api.dicebear.com'
    ],
    unoptimized: true
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'YieldMax',
    NEXT_PUBLIC_APP_DESCRIPTION: 'AI-Powered DeFi Yield Optimizer',
  },
  experimental: {
    serverActions: true,
  }
}

module.exports = nextConfig
```


***

## 🔧 Troubleshooting

### Common Issues \& Solutions

#### 1. Backend Issues

| Error | Symptom | Solution |
| :-- | :-- | :-- |
| **MongoDB Connection Failed** | `MongoNetworkError: connect ECONNREFUSED` | Ensure MongoDB is running: `sudo systemctl start mongod` |
| **JWT Secret Missing** | `TypeError: Cannot read property 'sign' of undefined` | Set `JWT_SECRET` in `.env` file |
| **Port Already in Use** | `Error: listen EADDRINUSE :::5000` | Kill process: `npx kill-port 5000` or change PORT |
| **Redis Connection Failed** | `ReplyError: NOAUTH Authentication required` | Start Redis: `redis-server` or check REDIS_URL |
| **API Rate Limiting** | `429 Too Many Requests` | Wait for rate limit reset or upgrade API plan |

**Debug Commands:**

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check if Redis is running
redis-cli ping

# View backend logs
tail -f server/logs/combined.log

# Test API endpoints
curl http://localhost:5000/api/v1/health
```


#### 2. Frontend Issues

| Error | Symptom | Solution |
| :-- | :-- | :-- |
| **Hydration Mismatch** | `Warning: Text content did not match` | Add `suppressHydrationWarning={true}` to dynamic content |
| **Web3 Provider Error** | `useConfig must be used within WagmiProvider` | Ensure Web3Provider wraps the app in layout.tsx |
| **Module Not Found** | `Cannot resolve 'wagmi'` | Install dependencies: `npm install wagmi viem@2` |
| **Build Errors** | TypeScript compilation errors | Fix type errors or add `// @ts-ignore` temporarily |
| **API Connection Failed** | Network errors in browser console | Check `NEXT_PUBLIC_API_URL` in `.env.local` |

**Debug Commands:**

```bash
# Clear Next.js cache
rm -rf .next

# Check for TypeScript errors
npm run type-check

# Run in development mode
npm run dev

# Build production version
npm run build
```


#### 3. Web3 Integration Issues

| Error | Symptom | Solution |
| :-- | :-- | :-- |
| **Wallet Not Detected** | "No wallet found" message | Install MetaMask or enable wallet in browser |
| **Wrong Network** | Transaction fails with network error | Switch to supported network (Ethereum, Polygon, etc.) |
| **Insufficient Gas** | Transaction fails with gas error | Increase gas limit or check gas price |
| **Contract Interaction Failed** | Smart contract calls fail | Verify contract address and ABI |

**Web3 Debug Tools:**

```typescript
// Debug wallet connection
console.log('Connected:', isConnected)
console.log('Address:', address)
console.log('Chain:', chain)

// Debug transaction
console.log('Transaction:', transaction)
console.log('Receipt:', receipt)
```


#### 4. AI/ML Issues

| Error | Symptom | Solution |
| :-- | :-- | :-- |
| **OpenAI API Error** | `Invalid API key` | Verify OPENAI_API_KEY and check billing |
| **Python Script Failed** | ML model errors | Install Python dependencies: `pip install scikit-learn pandas` |
| **Recommendation Generation Failed** | Empty or error responses | Check input validation and fallback logic |

### Performance Optimization

#### Backend Performance

```typescript
// Enable compression
app.use(compression())

// Optimize database queries
const yields = await Yield.find(query)
  .select('platform token apy tvl riskScore') // Only select needed fields
  .lean() // Return plain objects instead of Mongoose documents
  .limit(50) // Limit results

// Use Redis caching
const cached = await redis.get(cacheKey)
if (cached) return JSON.parse(cached)
```


#### Frontend Performance

```typescript
// Use React.memo for expensive components
const YieldComparison = React.memo(({ yields }) => {
  return <ExpensiveComponent yields={yields} />
})

// Implement virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window'

// Optimize images
import Image from 'next/image'
<Image src="/logo.png" alt="Logo" width={120} height={120} priority />
```


#### Caching Strategy

| Data Type | Cache Duration | Storage | Invalidation |
| :-- | :-- | :-- | :-- |
| **DeFi Yields** | 5 minutes | Redis | Time-based |
| **User Portfolio** | 1 minute | Redis | User action |
| **Price Data** | 30 seconds | Redis | Time-based |
| **AI Recommendations** | 1 hour | Redis | User preferences change |

### Monitoring \& Logging

#### Backend Logging Setup

```typescript
// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
})
```


#### Health Check Endpoint

```typescript
app.get('/api/v1/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkMongoConnection(),
      redis: await checkRedisConnection(),
      externalAPIs: await checkExternalAPIs()
    }
  }
  res.json(health)
})
```


***

## 🔄 Development Workflow

### Git Workflow

#### Branch Strategy

```bash
main                 # Production-ready code
├── develop         # Integration branch
├── feature/*       # Feature development
├── hotfix/*        # Production fixes
└── release/*       # Release preparation
```


#### Feature Development Workflow

```bash
# 1. Create feature branch
git checkout develop
git checkout -b feature/ai-recommendations

# 2. Make changes and commit
git add .
git commit -m "feat: add AI recommendation engine"

# 3. Push and create PR
git push origin feature/ai-recommendations

# 4. Merge to develop after review
git checkout develop
git merge feature/ai-recommendations

# 5. Deploy to staging for testing
```


### Code Standards

#### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```


#### ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```


### Testing Strategy

#### Backend Tests

```typescript
// Example test file: tests/auth.test.ts
describe('Authentication', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('should register new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(201)

    expect(response.body.data.user.email).toBe('test@example.com')
    expect(response.body.data.token).toBeDefined()
  })
})
```


#### Test Commands

```bash
# Backend tests
cd server
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report

# Frontend tests
cd client
npm test                   # Run Jest tests
npm run test:e2e          # Run Playwright E2E tests
```


### Deployment Pipeline

#### Development Environment

```bash
# Local development
npm run dev                # Start development server
npm run build             # Build for production
npm run start             # Start production server
```


#### Staging Deployment

```bash
# Docker deployment
docker build -t yieldmax-backend ./server
docker build -t yieldmax-frontend ./client

docker run -p 5000:5000 yieldmax-backend
docker run -p 3000:3000 yieldmax-frontend
```


#### Production Deployment

```bash
# Using Vercel for frontend
vercel --prod

# Using Railway for backend
railway login
railway deploy

# Environment variables setup
railway variables set MONGODB_URI="mongodb+srv://..."
railway variables set JWT_SECRET="your-production-secret"
```


### Performance Monitoring

#### Key Metrics to Monitor

| Metric | Target | Monitoring Tool |
| :-- | :-- | :-- |
| **API Response Time** | < 200ms | New Relic / DataDog |
| **Database Query Time** | < 50ms | MongoDB Atlas |
| **Error Rate** | < 1% | Sentry |
| **Uptime** | > 99.9% | StatusPage |
| **Memory Usage** | < 512MB | Railway / Heroku |

#### Alerts Setup

```typescript
// Example: Alert when API response time > 1s
const responseTimeAlert = {
  condition: 'response_time > 1000ms',
  notification: {
    email: 'alerts@yieldmax.app',
    slack: '#alerts'
  }
}
```


### Security Checklist

- [ ] Environment variables secured
- [ ] JWT secrets rotated regularly
- [ ] API rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced in production
- [ ] Database connections encrypted
- [ ] Dependency vulnerabilities scanned
- [ ] CORS properly configured
- [ ] Error messages don't leak sensitive info
- [ ] Regular security audits performed

***

## 📚 Additional Resources

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Wagmi Documentation](https://wagmi.sh/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)


### API References

- [Moralis Web3 API](https://docs.moralis.io/web3-data-api)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [DeFiLlama API](https://defillama.com/docs/api)
- [1inch API](https://docs.1inch.io/)


### Community \& Support

- GitHub Issues: `https://github.com/your-username/yieldmax/issues`
- Discord: `https://discord.gg/yieldmax`
- Documentation: `https://docs.yieldmax.app`

***

**Last Updated**: September 5, 2025
**Version**: 1.0.0
**Contributors**: YieldMax Development Team

***

*This documentation covers the complete YieldMax platform architecture, setup, and development workflow. For specific implementation details, refer to the inline code comments and individual component documentation.*

