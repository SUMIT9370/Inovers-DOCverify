# DOCverify - Secure Document Verification System

## 📋 About The Project

DOCverify is a robust document verification system built with modern technologies to provide secure, efficient, and reliable document verification services. It features multi-portal authentication for different user types and comprehensive document management capabilities.

## 🚀 Key Features

### Multi-Portal Authentication
- **Student Portal**: Upload and track academic documents
- **Institute Portal**: Verify and authenticate student documents
- **Company Portal**: Access verified documents for recruitment
- **Government Portal**: Oversee and manage verification processes
- **Admin Portal**: System-wide management and monitoring

### Security Features
- **JWT Authentication**
  - Secure access tokens with automatic refresh
  - Token expiration management
  - Configurable token lifetimes
- **User Authentication**
  - Role-based access control
  - Secure password requirements
  - Email verification system

### Document Management
- Document upload and storage
- Real-time verification status
- Document history tracking
- Multi-format support

## 🛠️ Built With

- **Frontend**:
  - Next.js 14.x
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components

- **Backend**:
  - Node.js
  - TypeScript
  - JWT Authentication

- **Development Tools**:
  - ESLint
  - Prettier
  - Git
  - VS Code

## 📥 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18.x or higher)
- npm (version 9.x or higher) or yarn
- Git

## 🚀 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/SUMIT9370/Inovers-DOCverify.git
   cd Inovers-DOCverify
   ```

2. **Install Dependencies**
   ```bash
   cd Doc-Verify
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the Doc-Verify directory:
   ```env
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
   JWT_EXPIRY=1h
   JWT_REFRESH_EXPIRY=7d

   # Add other environment variables as needed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
Doc-Verify/
├── src/
│   ├── components/     # React components
│   │   ├── UI/        # Reusable UI components
│   │   └── Figma/     # Figma-exported components
│   ├── pages/         # Next.js pages
│   ├── server/        # Server-side code
│   │   └── utils/     # Utilities (JWT, etc.)
│   ├── styles/        # Global styles
│   └── hooks/         # Custom React hooks
├── public/            # Static files
└── ... config files
```

## 🔐 Security Features

- **JWT Authentication**
  - Access and refresh token mechanism
  - Secure token storage
  - Automatic token refresh
  - Token expiration handling

- **Request Security**
  - Rate limiting
  - Input validation
  - CSRF protection
  - Secure headers

## 🚦 API Routes

- **/api/auth**: Authentication endpoints
  - POST /login: User login
  - POST /register: User registration
  - POST /refresh: Token refresh
  - POST /logout: User logout

- **/api/documents**: Document management
  - POST /upload: Document upload
  - GET /verify: Document verification
  - GET /status: Verification status

## 🧪 Running Tests

```bash
npm run test
# or
yarn test
```

## 📝 Development Guidelines

1. **Code Style**
   - Follow TypeScript best practices
   - Use ESLint and Prettier configurations
   - Write meaningful commit messages

2. **Git Workflow**
   - Create feature branches from main
   - Use pull requests for reviews
   - Keep commits focused and atomic

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Sumit - [@SUMIT9370](https://github.com/SUMIT9370)

Project Link: [https://github.com/SUMIT9370/Inovers-DOCverify](https://github.com/SUMIT9370/Inovers-DOCverify)

## 🙏 Acknowledgments

- Next.js Documentation
- Tailwind CSS
- Shadcn UI
- JWT Authentication Best Practices
So this is Built by the team in awards solving the issue of Smart India hackathon Authority city validator for Academia Presented by the government of Jharkhand  25029
